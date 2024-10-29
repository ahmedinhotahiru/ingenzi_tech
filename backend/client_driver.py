import os
# from uuid import uuid4
from langchain_core.documents import Document # type: ignore
# from langchain.tools.retriever import create_retriever_tool
import chromadb # type: ignore
from langchain_chroma import Chroma # type: ignore
from langchain_community.document_loaders import PyPDFLoader # type: ignore
from langchain_openai import OpenAIEmbeddings # type: ignore
from langchain_text_splitters import RecursiveCharacterTextSplitter # type: ignore
from dotenv import load_dotenv, find_dotenv # type: ignore
load_dotenv(find_dotenv())

current_dir = os.getcwd()
chroma_db_path = os.path.join(current_dir, "chroma_db")

# embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))
embeddings = OpenAIEmbeddings(openai_api_key="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")

persistent_client = chromadb.PersistentClient(path=chroma_db_path)


def load_chunk_persist_pdf(directory_path: str) :
    documents = []
    for file in os.listdir(directory_path):
        if file.endswith('.pdf'):
            pdf_path = os.path.join(directory_path, file)
            loader = PyPDFLoader(pdf_path)
            documents.extend(loader.load())
            # async for page in loader.alazy_load():
            #     documents.append(page)
    return documents

def create_and_load_documents_to_vector_store(collection_name:str, path_to_documents:str) -> Chroma:
    vector_store = Chroma(
    client=persistent_client,
    collection_name=collection_name,
    embedding_function=embeddings,
    create_collection_if_not_exists=True,)
    
    documents = []
    
    if path_to_documents is not None:
        documents = load_chunk_persist_pdf(path_to_documents)
        
        text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
        is_separator_regex=False,
    )
        chunked_docs = text_splitter.split_documents(documents)
        
        vector_store.add_documents(documents=chunked_docs)
    
    return vector_store

def create_or_load_vector_store(collection_name:str) -> Chroma:
    """Load a vector store or create one if doesn't exist"""	
    vector_store = Chroma(
        client=persistent_client,
        collection_name=collection_name,
        embedding_function=embeddings,
        create_collection_if_not_exists=True,
    )
    
    return vector_store
    
def add_docs_to_vector_store(vector_store:Chroma, documents:list[Document]) -> Chroma:
    """Add documents to vector store"""	
    vector_store.add_documents(documents=documents)
    return vector_store

def lookup_error_code(vector_store:Chroma, error_code:str) -> list[Document]:
    """Lookup error code in vector store"""
    return vector_store.similarity_search(query=error_code)



# retriever = vector_store.as_retriever()
# retriever_tool = create_retriever_tool(
#     retriever,
#     "babylonia_myths",
#     "Search for information about the legend and myths about the mesopotania regions and it's legends. For any questions about the Myths and Legends of Babylonia and Assyria or Mesopotania, you must use this tool!",
# )




# vs = create_and_load_documents_to_vector_store(
#     collection_name="error_codes",
#     path_to_documents=".\data\error_codes"
# )


# vs = create_or_load_vector_store(collection_name="error_codes")

# results = vs.search("0005", search_type="similarity")
# print("Results: ", results)
# for doc in results:
#     print(f"Document: {doc.page_content}, Metadata: {doc.metadata}")




# print("Hello World 1",persistent_client.list_collections())
# print("Hello World 2",persistent_client.get_or_create_collection("DEMO_ONE"))