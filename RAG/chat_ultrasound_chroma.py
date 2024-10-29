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
collection_name = 'ultrasound_manuals'
error_collection_name = "error_manuals"
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
            If the query is about error codes, use the error_code_search tool to get the description of that error code, and use the ultrasound_search outline steps the user can follow to fix it. If the error code is not found, tell the user to provide a valid error code, do not assume anything.

            For any other general information, use the tavily_search tool.

            Always use the most appropriate tool for each query.

            '''
        ),
        MessagesPlaceholder(variable_name="chat_history"),
        ("user", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ]
)   

@cl.on_chat_start
def setup_chain():
    llm = ChatOpenAI(openai_api_key="sk-OJ2_gW9HAKApES_5DbyRODLahM36bT13evmH3wxERkT3BlbkFJ5fwb2Eq-euILAFeg8IeJp5lw3MSHOxRFyB7Agjn28A", model="gpt-3.5-turbo")
    tools = [retriever_tool, error_retriever_tool, tavily_search]
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

    
