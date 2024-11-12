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




os.environ["TAVILY_API_KEY"] = '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'

tavily_search = TavilySearchResults()

load_dotenv()
chat_history = []
city = ""
country = ""
results = ""
resultsDone = False


ACCESS_TOKEN = "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"


embeddings = OpenAIEmbeddings(openai_api_key="sk-OJ2_gW9HAKApES_5DbyRODLahM36bT13evmH3wxERkT3BlbkFJ5fwb2Eq-euILAFeg8IeJp5lw3MSHOxRFyB7Agjn28A")

# Directory containing the PDF files
pdf_directory = "Manuals"
error_directory = "Errors"
maintenance_directory = "Maintenance_docs"
collection_name = 'ultrasound_manuals'
error_collection_name = "error_manuals"
maintenance_collection_name = "maintenance_manuals"
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


        # if collection_name == "error_manuals":
        #     text_splitter = RecursiveCharacterTextSplitter(
        #         separators=["\n", ",", "}", "]"],
        #         keep_separator=True,
        #         is_separator_regex=False,
        #         chunk_size=500,
        #         chunk_overlap=100
        #     )
        #     print("\nSplitting error documents...")
        #     documents_splits = text_splitter.split_documents(extracted_documents)
        # else:
        
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
# maintenance_vector_store = initialize_vectorstore(maintenance_collection_name, maintenance_directory, db_path)


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
# maintenance_retriever = maintenance_vector_store.as_retriever()
# maintenance_retriever_tool = create_retriever_tool(
#     maintenance_retriever,
#     "maintenance_search",
#     "Retrieve information on Philips ultrasound systems, including product specifications, maintenance protocols, disinfection guidelines, and usage instructions. For any questions regarding the operation, setup, or handling of Philips ultrasound systems, use this tool!",
# )






def process_resource(res_all):
    return "\n\n".join(res.page_content for res in res_all)


# CUSTOM TOOLS WILL BE DEFINED HERE


# error retriever tool
# user manuals tool



prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            '''

            You are an AI assistant.

            For questions about Ultrasound Machine and its related issues, use the ultrasound_search tool.
            If the query is about error codes, use the error_code_search tool to get the description of that error code, and use the ultrasound_search to outline steps the user can follow to fix it. If the error code is not found, tell the user to provide a valid error code, do not assume anything.

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




# prompt = ChatPromptTemplate.from_messages(
#     [
#         (
#             "system",
#             '''

#             You are an advanced AI assistant specializing in Philips ultrasound systems and related diagnostic equipment. You have access to multiple specialized tools to assist users effectively:

#             1. **ultrasound_search** - For any questions about the ultrasound machine itself, including general information, troubleshooting, setup, and operational guidance.

#             2. **error_code_search** - Use this tool to retrieve descriptions of specific error codes:
#                - When a query includes an error code (e.g., "0008"), first use the tool to locate an exact match. If not found, suggest that the user recheck the code for accuracy, or ask if they would like a list of similar codes if possible.
#                - If the code is found, retrieve its description. For troubleshooting steps, use **ultrasound_search** to provide practical guidance on resolving the issue. Avoid assumptions if the code is not located.

#             3. **maintenance_search** - For detailed information on maintenance, cleaning, technical specifications, safety standards, and usage instructions for Philips ultrasound systems.

#             4. **tavily_search** - For general inquiries that fall outside the specific functions of ultrasound machines, error codes, or maintenance, use this tool as a fallback.

#             **Instructions for Usage**:
#             - Always select the tool that best matches the user's query. For error codes, confirm exact matches where possible. If not located on the first try, clarify with the user or suggest possible similar codes if helpful.
#             - Provide concise initial responses and progressively disclose more details upon user request. 

#             **Example Scenarios**:
#             - "How do I clean the TEE transducer?" → Use **maintenance_search**.
#             - "What does error code E123 mean?" → Use **error_code_search** first, then **ultrasound_search** for troubleshooting if found.
#             - "Can the ultrasound machine export to DICOM?" → Use **ultrasound_search**.
#             - "What are the system requirements for Q-Station?" → Use **maintenance_search**.

#             Be clear, friendly, and professional in tone, providing information logically, especially for actionable steps. Always verify and prioritize user safety.

#             '''
#         ),
#         MessagesPlaceholder(variable_name="chat_history"),
#         ("user", "{input}"),
#         MessagesPlaceholder(variable_name="agent_scratchpad"),
#     ]
# )   



@cl.on_chat_start
def setup_chain():
    llm = ChatOpenAI(openai_api_key="sk-OJ2_gW9HAKApES_5DbyRODLahM36bT13evmH3wxERkT3BlbkFJ5fwb2Eq-euILAFeg8IeJp5lw3MSHOxRFyB7Agjn28A", model="gpt-3.5-turbo")
    tools = [retriever_tool, error_retriever_tool, tavily_search]
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
    global city, country, results, resultsDone

    user_message = message.content.lower()
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

    

