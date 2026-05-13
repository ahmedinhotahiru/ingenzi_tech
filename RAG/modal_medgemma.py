import os

import modal
from fastapi import Header, HTTPException
from pydantic import BaseModel

BASE_MODEL = "google/medgemma-4b-it"
ADAPTER_REPO = "BernesLy/medgemma-4b-it-sft-lora-crc100k"


def _download_weights():
    from huggingface_hub import snapshot_download

    token = os.environ["HF_TOKEN"]
    snapshot_download(BASE_MODEL, token=token)
    snapshot_download(ADAPTER_REPO, token=token)


image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install(
        "torch==2.4.0",
        "transformers>=4.55,<5",
        "accelerate>=0.34",
        "peft>=0.13",
        "huggingface_hub>=0.25",
        "fastapi[standard]",
        "pydantic>=2",
    )
    .run_function(
        _download_weights,
        secrets=[modal.Secret.from_name("huggingface")],
    )
)

app = modal.App("medgemma-mri")


class Query(BaseModel):
    question: str
    max_new_tokens: int = 512


@app.cls(
    image=image,
    gpu="A10G",
    scaledown_window=300,
    timeout=600,
    secrets=[
        modal.Secret.from_name("huggingface"),
        modal.Secret.from_name("mri-endpoint-auth"),
    ],
)
class MedGemma:
    @modal.enter()
    def load(self):
        import torch
        from peft import PeftModel
        from transformers import AutoModelForImageTextToText, AutoProcessor

        self.torch = torch
        self.processor = AutoProcessor.from_pretrained(BASE_MODEL)

        model = AutoModelForImageTextToText.from_pretrained(
            BASE_MODEL,
            torch_dtype=torch.bfloat16,
            device_map="auto",
        )
        model = PeftModel.from_pretrained(model, ADAPTER_REPO)
        self.model = model.merge_and_unload()
        self.model.eval()

    @modal.fastapi_endpoint(method="POST")
    def infer(self, query: Query, authorization: str = Header(None)):
        expected = f"Bearer {os.environ['MRI_ENDPOINT_TOKEN']}"
        if authorization != expected:
            raise HTTPException(status_code=401, detail="unauthorized")

        messages = [
            {
                "role": "system",
                "content": [{"type": "text", "text": "You are an expert medical assistant."}],
            },
            {
                "role": "user",
                "content": [{"type": "text", "text": query.question}],
            },
        ]

        inputs = self.processor.apply_chat_template(
            messages,
            add_generation_prompt=True,
            tokenize=True,
            return_dict=True,
            return_tensors="pt",
        ).to(self.model.device, dtype=self.torch.bfloat16)

        input_len = inputs["input_ids"].shape[-1]
        with self.torch.inference_mode():
            generation = self.model.generate(
                **inputs,
                max_new_tokens=query.max_new_tokens,
                do_sample=False,
            )
        answer = self.processor.decode(
            generation[0][input_len:], skip_special_tokens=True
        )
        return {"answer": answer}
