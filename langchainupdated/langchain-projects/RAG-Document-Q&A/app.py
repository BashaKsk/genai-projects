import streamlit as st
import openai
from langchain_groq import ChatGroq
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain_classic.chains.retrieval import create_retrieval_chain
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFDirectoryLoader



import os
from dotenv import load_dotenv

load_dotenv()

os.environ['LANGCHAIN_API_KEY'] = os.getenv("LANGCHAIN_API_KEY")

os.environ['LANGCHAIN_TRACING_V2'] = "true"

os.environ['LANGCHAIN_PROJECT'] = os.getenv("LANGCHAIN_PROJECT")

os.environ['GROQ_API_KEY'] = os.getenv('GROQ_API_KEY')

grok_api_key = os.getenv('GROQ_API_KEY')

llm = ChatGroq(model='llama-3.3-70b-versatile')


prompt= ChatPromptTemplate.from_template(
    """

Answer the questions based on the provided context only

Please provide most accurate response based on the question

<context>
{context}
<context>

Question: {input}

"""
)


def create_vector_embeddings():
    if "vectors" not in st.session_state:
        papers_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'research_papers')
        st.session_state.embeddings = OpenAIEmbeddings()
        st.session_state.loader = PyPDFDirectoryLoader(papers_dir) ## Data Ingestion
        st.session_state.docs =  st.session_state.loader.load() # Document loading
        st.session_state.text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        st.session_state.final_documens = st.session_state.text_splitter.split_documents(st.session_state.docs[:50])

        st.session_state.vectors = FAISS.from_documents( st.session_state.final_documens,  st.session_state.embeddings )




user_prompt = st.text_input("Enter your query from the research papers")


if st.button("Document embedding"):
    create_vector_embeddings()
    st.write("Vecotr Embeddings is ready")



import time 


if user_prompt:
    document_chain = create_stuff_documents_chain(llm, prompt)

    retreiver = st.session_state.vectors.as_retriever()

    retreival_chain = create_retrieval_chain(retreiver, document_chain)


    start = time.process_time()

    response = retreival_chain.invoke({'input': user_prompt})

    print(f"response time: {time.process_time() - start}")

    st.write(response['answer'])

    #With a streamlit expander

    with st.expander("Document similarity search"):

        for i , doc in enumerate(response['context']):
            st.write(doc.page_content)
            st.write('-----------')




