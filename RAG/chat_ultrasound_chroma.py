from chainlit.types import Feedback
from langchain_openai import OpenAI
from langchain.chains import LLMChain, APIChain
from langchain.memory.buffer import ConversationBufferMemory
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts import MessagesPlaceholder
from langchain.agents.output_parsers.openai_tools import OpenAIToolsAgentOutputParser
from langchain.agents import initialize_agent, Tool
from langchain.agents import AgentExecutor
from langchain.agents.format_scratchpad.openai_tools import format_to_openai_tool_messages
from math import sqrt
from langchain_core.messages import AIMessage, HumanMessage

from langchain_core.tools import tool
from langchain_community.retrievers import TavilySearchAPIRetriever

import chainlit as cl

import chainlit.data as cl_data # for chainlit feedback system

import os

from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_community.document_loaders import GithubFileLoader, PyPDFLoader

from getpass import getpass
from langchain_openai import OpenAIEmbeddings

from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter

from langchain.tools.retriever import create_retriever_tool

import pickle
from pathlib import Path
from tqdm import tqdm

from langchain_postgres import PGVector

# Import the requests library
import requests

import json

from datetime import datetime
import time

from langchain.schema import Document




#---------------- Feedback system class -----------------------

last_user_prompt = "" # store very last user prompt

# Store existing feedback
feedback_file = "feedback.jsonl"

class CustomDataLayer(cl_data.BaseDataLayer):

    async def upsert_feedback(self, feedback) -> str:
        global feedback_file, last_user_prompt

        # Dictionary to store new feedback
        new_feedback = {
            'id': feedback.forId,
            'user_prompt': last_user_prompt,
            'feedback': feedback.comment,
            'value': feedback.value
        } 

        # print captured feedback in chainlit console
        print(new_feedback)

        # Append new feedback to existing feedback json file
        with open(feedback_file, "a") as file:

            # append new feedback to file (Serialize and write as a single line)
            file.write(json.dumps(new_feedback) + "\n")

        # return await super().upsert_feedback(feedback)

    
    # Stub implementations for other abstract methods
    async def build_debug_url(self, *args, **kwargs): pass
    async def create_element(self, element_dict): pass
    async def create_step(self, step_dict): pass
    async def create_user(self, user): pass
    async def delete_element(self, element_id): pass
    async def delete_feedback(self, feedback_id): pass
    async def delete_step(self, step_id): pass
    async def delete_thread(self, thread_id): pass
    async def get_element(self, thread_id, element_id): pass
    async def get_thread(self, thread_id): pass
    async def get_thread_author(self, thread_id): pass
    async def get_user(self, user_id): pass
    async def list_threads(self, pagination, filters): pass
    async def update_step(self, step_dict): pass
    async def update_thread(self, thread_id, name=None, user_id=None, metadata=None, tags=None): pass





#---------------- Feedback system class -----------------------



# Load environment variables from .env file
load_dotenv()


os.environ["TAVILY_API_KEY"] = os.environ.get("TAVILY_API_KEY", "")

# React app backend URL
backend_url = os.environ.get("REACT_APP_BACKEND_URL", "http://127.0.0.1:5000")

# Modal endpoint for fine-tuned MedGemma MRI model
mri_modal_endpoint = os.environ.get("MRI_MODAL_ENDPOINT", "")
mri_modal_token = os.environ.get("MRI_MODAL_TOKEN", "")

tavily_search = TavilySearchResults()

chat_history = []
city = ""
country = ""
results = ""
resultsDone = False

openai_api_key = os.environ.get("OPENAI_API_KEY", "")
model_name = "gpt-4o"

embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)

collection_name = 'ultrasound_manuals'
error_collection_name = "error_manuals"
maintenance_collection_name = "maintenance_manuals"
device_history_collection_name = "device_history"

# Device / tenant identity for this deployment. There is a single device today,
# but every stored document is tagged with this identity so the schema is already
# fleet-ready: reference docs (manuals/errors/maintenance) are scoped by
# brand + model; device history is scoped by device_id + customer_id.
DEVICE_BRAND = os.environ.get("DEVICE_BRAND", "Philips")
DEVICE_MODEL = os.environ.get("DEVICE_MODEL", "HDI-5000")
DEVICE_ID = os.environ.get("DEVICE_ID", "HDI5000-DEMO-001")
CUSTOMER_ID = os.environ.get("CUSTOMER_ID", "default")

# Postgres/pgvector (Neon) connection. Collections are populated once by
# seed_pgvector.py; the app just connects to them here (no PDF loading at boot).
# langchain_postgres uses SQLAlchemy, which needs the "+psycopg" driver prefix.
_raw_db_url = os.environ.get("DATABASE_URL", "")
if _raw_db_url.startswith("postgresql://"):
    PG_CONNECTION = _raw_db_url.replace("postgresql://", "postgresql+psycopg://", 1)
elif _raw_db_url.startswith("postgres://"):
    PG_CONNECTION = _raw_db_url.replace("postgres://", "postgresql+psycopg://", 1)
else:
    PG_CONNECTION = _raw_db_url


def get_vectorstore(collection):
    """Connect to an existing pgvector collection (seeded by seed_pgvector.py)."""
    return PGVector(
        embeddings=embeddings,
        collection_name=collection,
        connection=PG_CONNECTION,
        use_jsonb=True,
        create_extension=False,  # the `vector` extension was enabled during Neon setup
    )


def history_metadata(doc_type):
    """Metadata tags for a runtime device-history document (fleet-ready schema)."""
    return {
        "brand": DEVICE_BRAND,
        "model": DEVICE_MODEL,
        "device_id": DEVICE_ID,
        "customer_id": CUSTOMER_ID,
        "doc_type": doc_type,
        "timestamp": datetime.now().isoformat(),
    }


# Connect to the seeded collections
vector = get_vectorstore(collection_name)
error_vector_store = get_vectorstore(error_collection_name)
maintenance_vector_store = get_vectorstore(maintenance_collection_name)
device_history_vector_store = get_vectorstore(device_history_collection_name)

# Create retriever tool
retriever = vector.as_retriever()
retriever_tool = create_retriever_tool(
    retriever,
    "ultrasound_search",
    "Search for information about Ultrasound Machine. For any questions about Ultrasound Machine, you must use this tool!",
)


# Create error code retriever tool
error_retriever = error_vector_store.as_retriever()
error_retriever_tool = create_retriever_tool(
    error_retriever,
    "error_code_search",
    "Retrieve error code descriptions. For any questions about error codes, you must use this tool!",
)


# Create maintenance_docs retriever tool
maintenance_retriever = maintenance_vector_store.as_retriever()
maintenance_retriever_tool = create_retriever_tool(
    maintenance_retriever,
    "maintenance_search",
    "Retrieve information on Philips ultrasound systems, including product specifications, maintenance protocols, disinfection guidelines, and usage instructions. For any questions regarding the operation, setup, or handling of Philips ultrasound systems, use this tool!",
)


# Create device_history retriever tool
device_history_retriever = device_history_vector_store.as_retriever()
device_history_retriever_tool = create_retriever_tool(
    device_history_retriever,
    "device_history_search",
    "Retrieve historical data on device logs, self-test reports, error code descriptions, and other stored interactions related to Philips ultrasound systems. For questions requiring past information or troubleshooting context for Philips ultrasound systems, use this tool!",
)






def process_resource(res_all):
    return "\n\n".join(res.page_content for res in res_all)




# CUSTOM TOOLS WILL BE DEFINED HERE


@tool("retrieve_logs_from_api", return_direct=False)
def retrieve_logs_from_api() -> str:
    """
    Calls the Flask API's /api/retrieve-logs endpoint to fetch the logs.
    """

    global device_history_vector_store

    api_url = f"{backend_url}/api/retrieve-logs"

    try:
        response = requests.get(api_url)

        if response.status_code == 200:

            # Save response
            logs = response.json()

            # ------------------------------------------------------------
            # Create document from logs and add to vectorstore
            documents = []
            for log in logs:
                document = Document(
                    page_content=str(log),  # Ensure the log is converted to string
                    metadata=history_metadata("log"),
                )
                documents.append(document)

            # Assuming device_history_vector_store is already initialized and accessible
            device_history_vector_store.add_documents(documents)

            print("\nAdded response to device history vectorstore for memory...\n")

            # ------------------------------------------------------------


            return f"Successfully retrieved logs: {logs}"
        
        else:
            return "Failed to retrieve logs. Please try again later."
    
    except Exception as e:
        return f"An error occured while fetching the logs: {str(e)}"
    


@tool("initiate_self_test_from_api", return_direct=False)
def initiate_self_test_from_api() -> str:
    """
    Calls the Flask API's /api/self-test-report endpoint to run simulated device self test
    """

    global device_history_vector_store

    # endpoint url to call
    api_url = f"{backend_url}/api/self-test-report"
    
    try:

        # call endpoint url to initiate self test using the request library
        response = requests.get(api_url)

        # Check if the API Call returned a success status
        if response.status_code == 200:

            # save response
            self_test_report = response.json()

            # ------------------------------------------------------------
            # Create document from self-test report and add to vectorstore
            documents = []
            document = Document(
                page_content=str(self_test_report),  # Ensure report is converted to string
                metadata=history_metadata("self_test"),
            )
            documents.append(document)

            # Assuming device_history_vector_store is already initialized and accessible
            device_history_vector_store.add_documents(documents)

            print("\nAdded response to device history vectorstore for memory...\n")

            # ------------------------------------------------------------


            return f"Self-test initiated successfully. Report: {self_test_report}"
        
        else:
            return "Failed to initiate the self-test. Please try again later."

    except Exception as e:
        return f"An error occured while initiating the self test: {str(e)}"
    


@tool("get_error_code_description", return_direct=False)
def get_error_code_description(errorCode: str) -> str:
    
    """
    Fetches the description of an error code using the lookup-code API endpoint.
    """

    global device_history_vector_store

    api_url = f"{backend_url}/api/lookup-code?code={errorCode}"

    try:

        # Call API endpoint to get error code description
        print(f"\n[get_error_code_description] GET {api_url}\n")
        response = requests.get(api_url, timeout=30)

        # Check if the request was successful
        if response.status_code == 200:

            # save the response
            error_code_description = response.json()

            # ------------------------------------------------------------
            # Create document from error code description and add to vectorstore
            documents = []
            document = Document(
                page_content=str(error_code_description),  # Ensure description is converted to string
                metadata=history_metadata("error_lookup"),
            )
            documents.append(document)

            # Assuming device_history_vector_store is already initialized and accessible
            device_history_vector_store.add_documents(documents)

            print("\nAdded response to device history vectorstore for memory...\n")

            
            # ------------------------------------------------------------


            return f"Error code description: {error_code_description}"
        
        else:
            # Log the full detail (URL, status, response headers and body) to the
            # server console so it's visible in the Render logs. A 429, 5xx, etc.
            # usually explains itself in the body (e.g. a Cloudflare/Render rate
            # limit page or a JSON error), which the status code alone hides.
            print(
                f"\n[get_error_code_description] FAILED\n"
                f"  URL: {api_url}\n"
                f"  Status: {response.status_code}\n"
                f"  Server header: {response.headers.get('Server')}\n"
                f"  Content-Type: {response.headers.get('Content-Type')}\n"
                f"  Body (first 500 chars): {response.text[:500]}\n"
            )
            return (
                f"Failed to retrieve the error code description. "
                f"The backend at {backend_url} returned HTTP {response.status_code}."
            )


    except Exception as e:
        print(f"\n[get_error_code_description] EXCEPTION calling {api_url}: {e}\n")
        return f"An error occurred while looking up the error code: {str(e)}"





@tool("schedule_maintenance", return_direct=False)
def schedule_maintenance(next_service_date: datetime) -> str:
    """
    Schedules maintenance for a device by submitting the next service date and fetching the last service date from the API.

    Parameters:
    - next_service_date (str): The next service date in ISO format (e.g., '2025-10-15T14:00:00').

    Returns:
    - A confirmation message if successful, or an error message if any step fails.
    """

    # Define the API endpoints
    get_last_service_date_url = f"{backend_url}/api/last-service-date"
    # API endpoint to get the last service date
    api_url = f"{backend_url}/api/last-service-date"

    try:
        # Step 1: Retrieve last service date from API
        response = requests.get(api_url)

        if response.status_code == 200:

            # Get the current next service date to now be set as last service date
            last_service_date = response.json().get("next_service_date")
            
            # Parse last service date into a datetime object if needed
            # last_service_date = datetime.utcfromtimestamp(last_service_date)
            
            # Step 2: Parse the user-provided next service date
            # next_service_date_obj = datetime.strptime(next_service_date, "%Y-%m-%d %H:%M:%S")
            
            # Step 3: Convert both dates to Unix timestamps
            # last_service_timestamp = int(last_service_date.timestamp())
            next_service_timestamp = int(next_service_date.timestamp())
            
            # Step 4: Submit both dates to the backend
            payload = {
                "last_service_date": last_service_date,
                "next_service_date": next_service_timestamp,
            }
            response = requests.post(api_url, json=payload)

            if response.status_code == 200:
                return f"Successfully scheduled maintenance. Next service date set to {next_service_date.strftime('%d %b %Y %H:%M')}."
            else:
                return f"Failed to schedule maintenance. API response: {response.text}"

        else:
            return "Failed to retrieve the last service date."

    except Exception as e:
        return f"An error occurred during scheduling: {str(e)}"






@tool("get_maintenance_info", return_direct=False)
def get_maintenance_info() -> str:
    """
    Get information on maintenance dates from the API.

    Returns:
    - A confirmation message if successful, or an error message if any step fails.
    """

    
    # API endpoint to get the last service date
    api_url = f"{backend_url}/api/last-service-date"

    try:
        # Step 1: Retrieve last service date from API
        response = requests.get(api_url)

        if response.status_code == 200:

            last_service_date = response.json().get("last_service_date")
            next_service_date = response.json().get("next_service_date")

            # Parse last service date into a datetime object if needed
            last_service_date = datetime.fromtimestamp(last_service_date)
            next_service_date = datetime.fromtimestamp(next_service_date)

            return f"Successfully retrieved service dates. Last service date was {last_service_date.strftime('%d %b %Y %H:%M')}, and next service date is {next_service_date.strftime('%d %b %Y %H:%M')}."

        else:
            return "Failed to retrieve service dates."

    except Exception as e:
        return f"An error occurred during retrieval: {str(e)}"



@tool("query_mri_model", return_direct=False)
def query_mri_model(question: str) -> str:
    """
    Uses a fine-tuned MedGemma model to answer MRI (Magnetic Resonance Imaging) related questions.
    Use this tool for any questions about MRI systems, MRI safety, MRI operation, MRI setup,
    MR-conditional devices, MRI scanning protocols, magnetic field strength, MRI camera usage,
    or any other MRI-specific clinical or technical queries.
    Do NOT use this tool for ultrasound-related questions.
    """
    if not mri_modal_endpoint or not mri_modal_token:
        return "MRI model service is not configured. Set MRI_MODAL_ENDPOINT and MRI_MODAL_TOKEN."

    try:
        response = requests.post(
            mri_modal_endpoint,
            headers={"Authorization": f"Bearer {mri_modal_token}"},
            json={"question": question},
            timeout=120,
        )
        response.raise_for_status()
        return response.json().get("answer", "(no answer returned)")

    except Exception as e:
        return f"An error occurred while querying the MRI model: {str(e)}"


# error retriever tool
# user manuals tool



prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            '''

            You are an AI assistant. Your name is Tony, and you are a digital twin and a clone of the physical HDI 5000 ultrasound machine. So give personalised responses

            For questions about Ultrasound Machine and its related issues, use the ultrasound_search tool.
            
            If the query is about error codes, use the get_error_code_description tool to get the description of the specific error code, identify what the main issue is from the error code description and use that to query the ultrasound_search to figure out how to resolve that issue. When done, make sure to first display the description of the error code to the user, before going ahead to outline the steps to fix it. If the user does not specify the error code, then ask the user for the missing input. Do not fill these in yourself. If the error code is not found, tell the user to provide a valid error code, do not assume anything.

            For any questions related to the operation, setup, or handling of ultrasound systems, such as product specifications, maintenance protocols, disinfection guidelines, or usage instructions, use the maintenance_search tool.

            If the user asks for new logs from the device, use the retrieve_logs_from_api tool.

            If the user asks for a self-test, use the initiate_self_test_from_api tool.

            If the users asks to schedule maintenance date, use the schedule_maintenance tool to update the service dates. If the user does not provide a valid date for the next service, ask for clarification and do not proceed until a valid input is provided. If the user asks you to suggest a date for the next maintenance, suggest a date that is 3 months from the last service date, and ask the user for confirmation to proceed to schedule next maintenance to that date. Only proceed to schedule maintenance upon the user's approval. If the user asks when the last or next maintenance date is, use the get_maintenance_info tool to get them the appropriate service date.


            You have access to a device_history_search tool. Use this tool when a question requires past device logs, past self-test reports, past reported errors and error codes, or any other stored information relevant to troubleshooting. Whenever required, always check the vector store for historical context before responding if relevant data might exist.

            Whenever the either user sends a message in a particular language or instructs you to respond in a particular language, make sure to respond in that language, and keep responding in that language until the user either changes language or instructs you to change language.


            For any questions specifically about MRI (Magnetic Resonance Imaging) systems — including MRI safety, MRI operation, MRI setup, MR-conditional devices, magnetic field strength, MRI camera usage, or any MRI-specific clinical or technical topics — use the query_mri_model tool. Do NOT use this tool for ultrasound questions.

            For any other general information, use the tavily_search tool.

            Always use the most appropriate tool for each query.

            '''
        ),
        MessagesPlaceholder(variable_name="chat_history"),
        ("user", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ]
)   

# For any questions related to the operation, setup, or handling of ultrasound systems, such as product specifications, maintenance protocols, disinfection guidelines, or usage instructions, use the maintenance_search tool.





import chainlit as cl

@cl.set_starters
async def set_starters():
    return [
        cl.Starter(
            label="Retrieve Device Logs",
            message="Retrieve device logs",
            icon="/public/help-center.svg",
            ),

        cl.Starter(
            label="Initiate Self Test",
            message="Initiate self test",
            icon="/public/maintenance.svg",
            ),
        cl.Starter(
            label="Error Code Help",
            message="I have an error code and need help getting the description and how to fix it",
            icon="/public/error.svg",
            ),
        cl.Starter(
            label="General Help",
            message="I have an issue on my ultrasound machine and need your help troubleshooting it.",
            icon="/public/idea.svg",
            )
        ]



@cl.on_chat_start
async def setup_chain():

    # Send a greeting message when the chat starts
    # await cl.Message(content="Hello there! 👋 \nI'm Tony 😎, the digital twin of your HDI 5000 ultrasound device 🩺✨. \nAs your device's virtual clone, I know everything about its performance, history, and how to keep it running smoothly. 🔧💡 \nHow can I assist you today? 😊").send()
    
    await cl.Message(content="Hello there! 👋 \nI'm Tony, the digital twin of your HDI 5000 ultrasound device. \n\nHow can I assist you today?").send()

    # For Feedback system (Instantiate feedback)
    cl_data._data_layer = CustomDataLayer()

    # llm = ChatOpenAI(openai_api_key="sk-OJ2_gW9HAKApES_5DbyRODLahM36bT13evmH3wxERkT3BlbkFJ5fwb2Eq-euILAFeg8IeJp5lw3MSHOxRFyB7Agjn28A", model="gpt-3.5-turbo")
    # llm = ChatOpenAI(base_url=endpoint, openai_api_key=git_token, model=model_name)
    llm = ChatOpenAI(openai_api_key=openai_api_key, model=model_name)
    tools = [retriever_tool, maintenance_retriever_tool, get_error_code_description, retrieve_logs_from_api, initiate_self_test_from_api, schedule_maintenance, get_maintenance_info, device_history_retriever_tool, query_mri_model, tavily_search]
    # tools = [retriever_tool, get_error_code_description, retrieve_logs_from_api, initiate_self_test_from_api, tavily_search]

    # tools = [retriever_tool, error_retriever_tool, retrieve_logs_from_api, initiate_self_test_from_api, tavily_search]
    # tools = [retriever_tool, error_retriever_tool, maintenance_retriever_tool, tavily_search]
    llm_with_tools = llm.bind_tools(tools)

    agent = (
    {
        "input": lambda x: x["input"],
        "agent_scratchpad": lambda x: format_to_openai_tool_messages(
            x["intermediate_steps"]
        ),
        "chat_history": lambda x: x["chat_history"]
    }
    | prompt
    | llm_with_tools
    | OpenAIToolsAgentOutputParser()
)
    agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

    cl.user_session.set("llm_chain", agent_executor)


@cl.on_message
async def handle_message(message: cl.Message):

    global last_user_prompt # For feedback system
    global city, country, results, resultsDone
    

    user_message = message.content.lower()

    # Update last_user_prompt to this new user_message content for feedback system
    last_user_prompt = user_message

    llm_chain = cl.user_session.get("llm_chain")

    result = llm_chain.invoke({"input": user_message, "chat_history": chat_history})
    chat_history.extend(
    [
        HumanMessage(content=user_message),
        AIMessage(content=result["output"]),
    ]
    )
    if resultsDone == False:  # not yet done, keep going around
        await cl.Message(result['output']).send()
    else:
        # send the add request to the UI

        fn = cl.CopilotFunction(name="formfill", args={"fieldA": city, "fieldB": country, "fieldC": result['output']})
        resultsDone = False
        res = await fn.acall()
        await cl.Message(content="Form info sent").send()


# ---------------------------------------------------------------------------
# REST endpoint: POST /chat
#
# Chainlit runs on FastAPI/uvicorn, so we attach a plain JSON endpoint to the
# same server. When this app is deployed (e.g. on Render), other services can
# send a question and get the answer back, e.g.:
#
#   curl -X POST https://<your-deployment>/chat \
#        -H "Content-Type: application/json" \
#        -d '{"message": "What does error code 1234 mean?"}'
#
# Pass an optional "session_id" to keep conversation memory across calls.
# If the CHAT_API_KEY env var is set, callers must send
# "Authorization: Bearer <key>".
# ---------------------------------------------------------------------------
from chainlit.server import app as fastapi_app
from fastapi import Header
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional

# In-memory history per session_id. Callers without a session_id are stateless.
_rest_sessions = {}

# The agent executor is built lazily on first request (and cached), so that
# simply importing this module never requires an OpenAI key. The vectorstores
# and tools are already loaded at module level, so building it is cheap. History
# is passed in per-request, so this single executor serves every caller.
_rest_executor = None


def _get_rest_executor():
    global _rest_executor
    if _rest_executor is None:
        rest_tools = [
            retriever_tool,
            maintenance_retriever_tool,
            get_error_code_description,
            retrieve_logs_from_api,
            initiate_self_test_from_api,
            schedule_maintenance,
            get_maintenance_info,
            device_history_retriever_tool,
            query_mri_model,
            tavily_search,
        ]
        llm_with_tools = ChatOpenAI(
            openai_api_key=openai_api_key, model=model_name
        ).bind_tools(rest_tools)
        rest_agent = (
            {
                "input": lambda x: x["input"],
                "agent_scratchpad": lambda x: format_to_openai_tool_messages(
                    x["intermediate_steps"]
                ),
                "chat_history": lambda x: x["chat_history"],
            }
            | prompt
            | llm_with_tools
            | OpenAIToolsAgentOutputParser()
        )
        _rest_executor = AgentExecutor(
            agent=rest_agent, tools=rest_tools, verbose=False
        )
    return _rest_executor


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None


@fastapi_app.post("/chat")
def rest_chat(body: ChatRequest, authorization: Optional[str] = Header(None)):
    # Optional shared-secret auth.
    api_key = os.environ.get("CHAT_API_KEY", "")
    if api_key and authorization != f"Bearer {api_key}":
        return JSONResponse({"error": "unauthorized"}, status_code=401)

    if not body.message or not body.message.strip():
        return JSONResponse({"error": "message is required"}, status_code=400)

    history = _rest_sessions.get(body.session_id, []) if body.session_id else []

    try:
        result = _get_rest_executor().invoke(
            {"input": body.message, "chat_history": history}
        )
    except Exception as e:
        return JSONResponse({"error": f"agent error: {e}"}, status_code=500)

    answer = result["output"]

    if body.session_id:
        history.extend(
            [HumanMessage(content=body.message), AIMessage(content=answer)]
        )
        _rest_sessions[body.session_id] = history

    return JSONResponse({"response": answer, "session_id": body.session_id})

    

