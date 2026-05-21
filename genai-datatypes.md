# GenAI / RAG — Core Data Types Cheatsheet

A reference of every data type that flows through a typical RAG pipeline, in the order they appear.

```
Raw file → Document → Chunk → Embedding → Vector Store → Retriever
                                                              ↓
                                                          Prompt → LLM → Response
```

---

## 1. Document

A unit of text **plus metadata** about where it came from. The universal currency of LangChain pipelines.

```python
from langchain_core.documents import Document

doc = Document(
    page_content="The quick brown fox jumps over the lazy dog.",
    metadata={"source": "sample.pdf", "page": 0}
)
```

| Field | Type | Purpose |
|---|---|---|
| `page_content` | `str` | The actual text |
| `metadata` | `dict` | Source info: file path, page number, URL, author, timestamp, etc. |

**Comes from:** `DocumentLoader` (PDF loader, web loader, CSV loader, etc.)
**Goes to:** `TextSplitter`

---

## 2. Chunk

A **smaller `Document`** produced by splitting a larger one. Same `Document` class — there's no separate `Chunk` type. The word "chunk" is just convention for "a document that was split from a bigger doc".

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,        # max chars per chunk
    chunk_overlap=50,      # chars repeated between adjacent chunks
)
chunks = splitter.split_documents([doc])   # List[Document]
```

**Why chunk?**

- LLMs have token limits — can't stuff a whole book in a prompt
- Smaller pieces = more precise retrieval (only the relevant paragraph reaches the LLM)
- Embeddings work better on focused text than on long mixed-topic documents

**Why overlap?**

To preserve context that sits on chunk boundaries — e.g. a sentence that gets split would otherwise lose meaning. Overlap of ~10% of chunk size is a typical default.

---

## 3. Embedding (Vector)

A **list of floats** that represents the semantic meaning of a piece of text. Similar text → similar vectors (close in vector space).

```python
from langchain_openai import OpenAIEmbeddings

embedder = OpenAIEmbeddings(model="text-embedding-3-small")
vector = embedder.embed_query("What is RAG?")

print(type(vector))     # <class 'list'>
print(len(vector))      # 1536 (depends on model)
print(vector[:5])       # [0.012, -0.034, 0.087, ...]
```

**Key properties:**

| Property | Value |
|---|---|
| Type | `list[float]` |
| Length | Fixed per model (e.g. 1536 for `text-embedding-3-small`, 3072 for `text-embedding-3-large`) |
| Comparison | Cosine similarity — close vectors = similar meaning |

**Two methods on embedders:**

- `.embed_query(text)` — for the user's question
- `.embed_documents([text1, text2])` — for chunks (batched)

---

## 4. Vector Store

A specialized database that stores `(vector, document)` pairs and supports **fast nearest-neighbor search** ("which K vectors are closest to this query vector?").

```python
from langchain_community.vectorstores import FAISS

vectorstore = FAISS.from_documents(chunks, embedder)
# Internally stores: List[(vector, Document)]
```

**Common options:**

| Vector Store | Where it runs |
|---|---|
| **FAISS** | In-memory (Facebook AI Similarity Search) — fast, local, no persistence by default |
| **Chroma** | Local, persistent |
| **Pinecone** | Cloud, managed |
| **Weaviate / Qdrant / Milvus** | Self-hosted or cloud |
| **pgvector** | Postgres extension |

**Save & reload FAISS:**

```python
vectorstore.save_local("my_index")
loaded = FAISS.load_local("my_index", embedder, allow_dangerous_deserialization=True)
```

---

## 5. Retriever

The **interface** for fetching relevant chunks from a vector store. Every vector store can give you one via `.as_retriever()`.

```python
retriever = vectorstore.as_retriever(
    search_type="similarity",     # or "mmr" for diversity
    search_kwargs={"k": 3},       # return top 3 chunks
)

results = retriever.invoke("What is RAG?")   # List[Document]
```

**Why a separate type?** So your downstream code doesn't care *how* the chunks came back — could be FAISS, Pinecone, or hybrid keyword+vector search. The output is always `List[Document]`.

---

## 6. Messages (for Chat LLMs)

The structured prompt format used by chat models. Three main types:

```python
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

messages = [
    SystemMessage(content="You are a helpful assistant."),
    HumanMessage(content="What is RAG?"),
    AIMessage(content="RAG stands for...")    # model's previous reply
]
```

| Type | Role | When to use |
|---|---|---|
| `SystemMessage` | Instructions / persona | "you are a coding tutor", "respond in JSON" |
| `HumanMessage` | User input | The current user question |
| `AIMessage` | Model's response | Past replies (multi-turn conversations) |

---

## 7. Prompt Template

A **string with placeholders** that get filled in at runtime. Lets you reuse the same prompt structure with different variables.

```python
from langchain_core.prompts import ChatPromptTemplate

template = ChatPromptTemplate.from_messages([
    ("system", "Answer the question using ONLY the context below.\n\n{context}"),
    ("human", "{question}"),
])

prompt = template.invoke({
    "context": "RAG combines retrieval with generation...",
    "question": "What is RAG?",
})
# → List[Message] ready to send to the LLM
```

---

## 8. Tokens

The atomic units that LLMs actually process. Roughly **1 token ≈ 4 characters** for English (~750 words ≈ 1000 tokens).

```python
import tiktoken
enc = tiktoken.encoding_for_model("gpt-4o-mini")
tokens = enc.encode("Hello, world!")
print(tokens)        # [9906, 11, 1917, 0]   ← list of ints
print(len(tokens))   # 4
```

**Why you care:**

- LLM pricing is per-token (input & output charged separately)
- Models have a context limit (e.g. `gpt-4o-mini` = 128k tokens)
- Chunk sizes are usually expressed in chars but should fit within the model's context once retrieved

---

## Putting it together — full pipeline types

```python
# RAW
pdf_file: str = "../content/sample.pdf"

# LOAD
documents: list[Document] = PyPDFLoader(pdf_file).load()

# SPLIT
chunks: list[Document] = splitter.split_documents(documents)

# EMBED + STORE
vectorstore: VectorStore = FAISS.from_documents(chunks, embedder)

# RETRIEVE
retriever: BaseRetriever = vectorstore.as_retriever(search_kwargs={"k": 3})
relevant_chunks: list[Document] = retriever.invoke("What is RAG?")

# PROMPT
prompt: list[Message] = template.invoke({
    "context": "\n\n".join(c.page_content for c in relevant_chunks),
    "question": "What is RAG?",
})

# GENERATE
response: AIMessage = llm.invoke(prompt)
answer: str = response.content
```

---

## Quick mental model

| Concept | One-line definition |
|---|---|
| **Document** | Text + metadata |
| **Chunk** | A small Document split from a big one |
| **Embedding** | A fixed-length list of floats representing meaning |
| **Vector store** | DB that finds similar vectors fast |
| **Retriever** | Black-box "give me K relevant Documents" interface |
| **Message** | One turn in a chat (system/human/AI) |
| **Prompt template** | A reusable message-list with placeholders |
| **Token** | What LLMs actually count and bill for |
