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

import chromadb
from langchain_community.vectorstores import Chroma

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


# os.environ["TAVILY_API_KEY"] = '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'
os.environ["TAVILY_API_KEY"] = os.environ.get("TAVILY_API_KEY", "")

tavily_search = TavilySearchResults()

chat_history = []
city = ""
country = ""
results = ""
resultsDone = False

openai_api_key = os.environ.get("OPENAI_API_KEY", "")
model_name = "gpt-4o"

embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)

# Directory containing the PDF files
pdf_directory = "Manuals"
error_directory = "Errors"
maintenance_directory = "Maintenance_docs"
device_history_directory = "device_history"
collection_name = 'ultrasound_manuals'
error_collection_name = "error_manuals"
maintenance_collection_name = "maintenance_manuals"
device_history_collection_name = "device_history"
db_path = "./chroma_db"

def initialize_vectorstore(collection_name="ultrasound_manuals", pdf_directory="Manuals", db_path="./chroma_db"):
    """
    Args:
        collection_name (str): The name of the collection
        pdf_directory (str): The directory where the documents to use are stored

    Returns:
        Chroma: Vectorstore
    """


    # ChromaDB vector store
    persistent_client = chromadb.PersistentClient(path=db_path) #Initialize chromadb
    collection = persistent_client.get_or_create_collection(collection_name) # Get/Create collection/table of vector store

    vector_store = Chroma(
        collection_name=collection_name,
        client=persistent_client,
        embedding_function=embeddings
    )

    # If collection is empty, load initial documents
    if collection.count() == 0:
        print("\nLoading documents into new collection...")
        extracted_documents = []

        pdf_files = [f for f in os.listdir(pdf_directory) if f.endswith('.pdf')]

        # First progress bar for PDF processing
        with tqdm(total=len(pdf_files), desc="Processing PDFs") as pdf_pbar:
            for filename in pdf_files:
                if filename.endswith(".pdf"):
                    pdf_file_path = os.path.join(pdf_directory, filename)
                    pdf_loader = PyPDFLoader(pdf_file_path)
                    extracted_texts = pdf_loader.load()
                    extracted_documents.extend(extracted_texts)
                    pdf_pbar.update(1)
        
        # Split documents
        text_splitter = RecursiveCharacterTextSplitter()
        # text_splitter = RecursiveCharacterTextSplitter(chunk_size=250, chunk_overlap=75)
        print("\nSplitting documents...")
        documents_splits = text_splitter.split_documents(extracted_documents)

        # Add these document embedded chunks to the initialized vector store
        vector_store.add_documents(documents_splits)
        print(f"\nCreated and populated new collection: {collection_name}")

    else:
        print(f"\nLoaded existing collection: {collection_name}")

    return vector_store




# Use the function to load or create vector store
vector = initialize_vectorstore(collection_name, pdf_directory, db_path)
error_vector_store = initialize_vectorstore(error_collection_name, error_directory, db_path)
maintenance_vector_store = initialize_vectorstore(maintenance_collection_name, maintenance_directory, db_path)
device_history_vector_store = initialize_vectorstore(device_history_collection_name, device_history_directory, db_path)

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

    api_url = "http://127.0.0.1:5000/api/retrieve-logs"

    try:
        response = requests.get(api_url)

        if response.status_code == 200:

            # Save response
            logs = response.json()

            # ------------------------------------------------------------
            # Get the current timestamp
            current_timestamp = datetime.now().isoformat()

            # Create document from logs and add to vectorstore
            documents = []
            for log in logs:
                document = Document(
                    page_content=str(log),  # Ensure the log is converted to string
                    metadata={"source": "device_log", "timestamp": current_timestamp}  # Dynamic timestamp
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
    api_url = "http://127.0.0.1:5000/api/self-test-report"
    
    try:

        # call endpoint url to initiate self test using the request library
        response = requests.get(api_url)

        # Check if the API Call returned a success status
        if response.status_code == 200:

            # save response
            self_test_report = response.json()

            # ------------------------------------------------------------
            # Get the current timestamp
            current_timestamp = datetime.now().isoformat()

            # Create document from self-test report and add to vectorstore
            documents = []
            document = Document(
                page_content=str(self_test_report),  # Ensure report is converted to string
                metadata={"source": "self_test_report", "timestamp": current_timestamp}  # Dynamic timestamp
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

    api_url = f"http://127.0.0.1:5000/api/lookup-code?code={errorCode}"

    try:

        # Call API endpoint to get error code description
        response = requests.get(api_url)

        # Check if the request was successful
        if response.status_code == 200:

            # save the response
            error_code_description = response.json()

            # ------------------------------------------------------------
            # Create document from error code description and add to vectorstore
            documents = []
            document = Document(
                page_content=str(error_code_description),  # Ensure description is converted to string
                metadata={"source": "error_code_description", "timestamp": "2024-12-03T12:00:00"}  # Example metadata
            )
            documents.append(document)

            # Assuming device_history_vector_store is already initialized and accessible
            device_history_vector_store.add_documents(documents)

            print("\nAdded response to device history vectorstore for memory...\n")

            
            # ------------------------------------------------------------


            return f"Error code description: {error_code_description}"
        
        else:
            return f"Failed to retrieve the error code description. HTTP Status: {response.status_code}"


    except Exception as e:
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
    get_last_service_date_url = "http://127.0.0.1:5000/api/last-service-date"
    # API endpoint to get the last service date
    api_url = "http://127.0.0.1:5000/api/last-service-date"

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
    api_url = "http://127.0.0.1:5000/api/last-service-date"

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
    tools = [retriever_tool, maintenance_retriever_tool, get_error_code_description, retrieve_logs_from_api, initiate_self_test_from_api, schedule_maintenance, get_maintenance_info, device_history_retriever_tool, tavily_search]
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

    

