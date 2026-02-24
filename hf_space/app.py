import spaces
import gradio as gr
import torch
import os
import warnings

from transformers import AutoProcessor, AutoModelForImageTextToText, logging as hf_logging
from peft import PeftModel

warnings.filterwarnings("ignore")
hf_logging.set_verbosity_error()

HF_TOKEN = os.environ.get("HUGGINGFACE_TOKEN") or None
BASE_MODEL_ID = "google/medgemma-4b-it"
ADAPTER_REPO_ID = "BernesLy/medgemma-4b-it-sft-lora-crc100k"

print("Loading processor...")
processor = AutoProcessor.from_pretrained(BASE_MODEL_ID, token=HF_TOKEN)
processor.tokenizer.padding_side = "right"

print("Loading base model onto CPU...")
base_model = AutoModelForImageTextToText.from_pretrained(
    BASE_MODEL_ID,
    torch_dtype=torch.bfloat16,
    device_map="cpu",
    token=HF_TOKEN,
)

print("Applying LoRA adapters...")
model = PeftModel.from_pretrained(base_model, ADAPTER_REPO_ID)
model.generation_config.max_length = None
model.eval()

print("Model ready.")


@spaces.GPU
def answer_mri_question(question: str) -> str:
    if not question or not question.strip():
        return "Please enter a question."

    model.to("cuda")

    messages = [
        {"role": "user", "content": [{"type": "text", "text": question}]}
    ]

    prompt = processor.tokenizer.apply_chat_template(
        messages, tokenize=False, add_generation_prompt=True
    )

    inputs = processor.tokenizer(prompt, return_tensors="pt").to("cuda")

    with torch.no_grad():
        output_ids = model.generate(
            **inputs,
            max_new_tokens=512,
            do_sample=False,
        )

    # Slice off the prompt tokens to get only the generated answer
    generated_ids = output_ids[0][inputs["input_ids"].shape[1]:]
    answer = processor.tokenizer.decode(generated_ids, skip_special_tokens=True)

    return answer


demo = gr.Interface(
    fn=answer_mri_question,
    inputs=gr.Textbox(
        label="MRI Question",
        placeholder="Ask an MRI-related question...",
        lines=3,
    ),
    outputs=gr.Textbox(label="Answer", lines=10),
    title="MedGemma MRI Assistant",
    description="Fine-tuned MedGemma 4B model for MRI-related clinical and technical questions.",
)

demo.launch()
