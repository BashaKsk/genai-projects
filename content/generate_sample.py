from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer

doc = SimpleDocTemplate("sample.pdf", pagesize=letter)
styles = getSampleStyleSheet()
story = []

title = "Introduction to Retrieval-Augmented Generation (RAG)"
story.append(Paragraph(title, styles["Title"]))
story.append(Spacer(1, 12))

sections = [
    ("What is RAG?",
     "Retrieval-Augmented Generation (RAG) is a technique that combines a "
     "retrieval system with a large language model. Instead of relying only on "
     "the model's training data, RAG fetches relevant context from an external "
     "knowledge base and provides it to the model at inference time."),
    ("Why use RAG?",
     "RAG reduces hallucination, allows the model to use up-to-date information, "
     "and makes it possible to cite sources. It is much cheaper than fine-tuning "
     "a model on private data and the knowledge base can be updated without "
     "retraining."),
    ("Core components",
     "A RAG pipeline has four pieces: a document loader, a text splitter that "
     "creates chunks, an embedding model that turns each chunk into a vector, "
     "and a vector store such as FAISS that supports nearest-neighbor search."),
    ("Typical workflow",
     "At query time the user question is embedded, the top K most similar "
     "chunks are retrieved from the vector store, and those chunks are passed "
     "as context inside the prompt to the language model. The model then "
     "generates an answer grounded in that context."),
    ("Common pitfalls",
     "Chunk size matters: chunks that are too small lose context, chunks that "
     "are too large dilute the signal. A typical starting point is 500 "
     "characters with 50 characters of overlap. Quality of embeddings also "
     "directly affects retrieval quality."),
]

for heading, body in sections:
    story.append(Paragraph(heading, styles["Heading2"]))
    story.append(Paragraph(body, styles["BodyText"]))
    story.append(Spacer(1, 12))

doc.build(story)
print("Generated sample.pdf")
