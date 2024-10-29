from langchain_openai import ChatOpenAI # type: ignore
from dotenv import load_dotenv # type: ignore
from langchain.document_loaders import GithubFileLoader # type: ignore
from langchain_openai import ChatOpenAI # type: ignore
import os
from client_driver import *
from langchain_core.documents import Document 
import chromadb # type: ignore
from langchain_chroma import Chroma # type: ignore
from langchain_core.prompts import ChatPromptTemplate # type: ignore
from langchain_core.prompts import MessagesPlaceholder # type: ignore
from langchain.agents.output_parsers.openai_tools import OpenAIToolsAgentOutputParser # type: ignore
from langchain.agents import AgentExecutor # type: ignore
from langchain.agents.format_scratchpad.openai_tools import format_to_openai_tool_messages # type: ignore
from langchain_core.messages import AIMessage, HumanMessage # type: ignore
from langchain_core.tools import tool # type: ignore
import chainlit as cl # type: ignore
from langchain.tools.retriever import create_retriever_tool # type: ignore
from langchain_community.tools.tavily_search import TavilySearchResults # type: ignore
from langchain_core.tools import tool # type: ignore


#======================== Initialization =========================
ACCESS_TOKEN = "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"
os.environ["TAVILY_API_KEY"] = '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'
search = TavilySearchResults()
load_dotenv()
loader = GithubFileLoader(
    repo="mhabdulbaaki/RAG-DEMO",  # the repo name
    access_token=ACCESS_TOKEN,
    github_api_url="https://api.github.com",
    file_filter=lambda file_path: file_path.endswith(
        ".txt"
    ),
)
documents = loader.load()
llm = ChatOpenAI(openai_api_key="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")



#======================== Vector Stores =========================
# mesopotania vector
vector = create_or_load_vector_store("babylonia_myths")
vector = add_docs_to_vector_store(vector, documents)

# error code vector
# vs = create_and_load_documents_to_vector_store(
#     collection_name="error_codes",
#     path_to_documents=".\data\error_codes",
#     )
vs = create_or_load_vector_store(collection_name="error_codes")

# manuals vector
# vs_manuals = create_and_load_documents_to_vector_store(
#     collection_name="user_manuals_store",
#     path_to_documents=".\data\manuals",
#     )
vs_manuals = create_or_load_vector_store(collection_name="user_manuals_store")




#======================== Custom Tools =========================

error_retriever = vs.as_retriever()
error_retriever_tool = create_retriever_tool(
    error_retriever,
    "error_codes_tool",
    """
    Use this tool to lookup error codes. 
    If error codes are not provided, ask user for the error code.
    Use the error_codes_tool to answer questions about error codes.
    You may ask for the device specific information like the model number and device name and brand.
    If you dont find information from the vector store, you may use the tavily_search tool to lookup information on the error code specific for the device.
    """	,
)

user_manuals_retriever = vs_manuals.as_retriever()
user_manuals_tool = create_retriever_tool(
    user_manuals_retriever,
    "user_manuals_tools",
    """
    Use this tool for any queries regarding ultrasound device troubleshooting  or repairs. 
    The Ultrasound device must be of philips brand.
   """	,
)

retriever = vector.as_retriever()
retriever_tool = create_retriever_tool(
    retriever,
    "babylonia_myths",
    "Search for information about the legend and myths about the mesopotania regions and it's legends. For any questions about the Myths and Legends of Babylonia and Assyria or Mesopotania, you must use this tool!",
)

tools = [retriever_tool,
        #  user_manuals_tool, error_retriever_tool, 
         search]

load_dotenv()
chat_history = []

company = ""
time = ""
results = ""
error_code = ""	
resultsDone = False

# Error Lookup Tool
@tool("ErrorLookupTool", return_direct=False)
def ErrorLookupTool(errorCode: str = None) -> str:
  """
  use this tool when you need to lookup or search error codes from the vector store
  given an error code.
  To use the tool you must provide the error code
  """
  global error_code
  error_code = errorCode

  if error_code:
      #use error code to retrieve relevant information
      # error codes vector store
    results = lookup_error_code(vs, error_code)
    resultsDone = True
    return results
  else:
    return "Kindly provide the error code so I can help you!"
  
prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            '''
You are a technical assistant that helps users troubleshoot medical ultrasound machines
Use the ErrorLookupTool to to lookup error codes from the error codes vector store.
Use the error_retriever_tool for error lookup. for a given error code retrieve the corresponding Text Message and the module name.
Also, you queries about Philips ultrasound devices, you must use the user_manuals_tool

  Before proceeding to the next step, ensure the prior one is fully completed. Please don't mention any STEP ; just act on it.
  Be sure that you do not skip any steps.

  Step #0: For any questions not related to ultrasound device troubleshooting or repairs, just answer with your common knowledge

  Step #1: Use the custom tools to retrieve relevant information regarding the device.
- If the user input does not specify an error code, then ask the user for the error code.  Do not fill this in yourself.
- Confirmation Check: tell the user what the error code is are.

  Step #2: Proceed to lookup the error code in the error codes vector store or search the manuals for any relevant information
- Use the ErrorLookupTool, the user_manuals_tool, and the error_retriever_tool to retrieve relevant information.
- Confirmation Check: Inform the user of the retrieved information.

  Step #3: Complete the task

            '''
        ),
        MessagesPlaceholder(variable_name="chat_history"),
        ("user", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ]
) 

#Stock Market Tool
@tool("stock_market", return_direct=False)
def stock_market(companyName: str, timePeriod: str):
    """
    For information market market trends, stock prices or company financials, ask the user to provide the company's name along side the time period.
    if either the company or the time period is not provided, ask the user to provide both. Or provide them with only general information about the company and ask time to specify the time period to retrieve information.
  
    """
    
    global company, time, results, resultsDone
    company = companyName
    time = timePeriod
    
    search = TavilySearchResults(
        max_results=10,
        include_answer=True,
        include_raw_content=True,
        include_images=False,
    )
    if not company or not time:
        return 'Kindly provide both company name and time frame to retrieve market information about company'
    search_query = f'{company} market trends within {time}.'
    results = search.invoke(input=search_query)
    resultsDone = True
    return results

prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            '''
  You are a specialist on the Myths and Legends of Babylonia and the general Mesopatania regions that helps users answer questions about the history and myths of the region.
  Use the babylonia_myths tool to answer questions about Mesopotania or Myths and Legends of Babylonia and Assyria.

  For information market market trends, stock prices or company financials, ask the user to provide the company's name along side the time period.
  if either the company or the time period is not provided, ask the user to provide both. Or provide them with only general information about the company and ask time to specify the time period to retrieve information.
  For other general queries, use the retriever tool and the tavily_search tool to answer the user's questions.
  Use the tavily_search tool to answer questions about current events or information not about Myths and Legends of Babylonia and Assyria.


            '''
        ),
        MessagesPlaceholder(variable_name="chat_history"),
        ("user", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ]
)




# ======================== Chainlit ========================
@cl.on_chat_start
def setup_chain():
    llm = ChatOpenAI(openai_api_key="sk-1eknDwgVIQFcyUjwDaYWOEh3KHiDQvqvTqk8OrdKipT3BlbkFJIvmno7Xt2iw0s79d7EODeB_AVh8ds6zkrFjNk_fWsA", model="gpt-3.5-turbo")
    tools = [stock_market, 
            #  user_manuals_tool, 
             retriever_tool, 
             search,
             ErrorLookupTool,
             ]
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
    global company, time, results, resultsDone

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
        # print("================================================")
        # print(results[0]['content'])
        fn = cl.CopilotFunction(name="formfill", args={"fieldA": company, "fieldB": time, "fieldC": result['output']})
        resultsDone = False
        res = await fn.acall()
        await cl.Message(content="Form info sent").send()

    
