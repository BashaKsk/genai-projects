"""
Generate a polished two-column PDF resume for Basha Karuchola Shaik.

Run:
    cd langchainupdated
    uv add reportlab            # one-time
    uv run python ../resume/generate_resume.py

Output:  resume/Basha_Resume.pdf

NOTE: lines marked  # TODO  are facts I couldn't read from the image or verify.
Edit the DATA dict below to correct them, then re-run.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import (
    BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, Table, TableStyle,
)

# ----------------------------------------------------------------------------
# 1) DATA  — edit anything marked TODO
# ----------------------------------------------------------------------------
NAME = "BASHA KARUCHOLA SHAIK"
TITLE = "Senior Full Stack Developer"

CONTACT = [
    ("Email", "basha@patternlab.ai"),
    ("Phone", "+91 90000 00000"),          # TODO: real phone
    ("Location", "Hyderabad, India"),
    ("GitHub", "github.com/BashaKsk"),
    ("LinkedIn", "linkedin.com/in/basha"),  # TODO: real LinkedIn
    ("Live demo", "ksk-rag-conversational.streamlit.app"),
]

SUMMARY = (
    "Full-stack developer (4 yrs) across React, Node.js and Python, now building and "
    "shipping GenAI products with LangChain, RAG and Neo4j knowledge graphs. Team-lead "
    "experience; a self-driven learner who takes ownership end-to-end and ships to production."
)

# Each experience entry: (role, company, dates, [bullets])
EXPERIENCE = [
    (
        "Senior Full Stack Developer / Team Lead",
        "Patternlab.AI, Hyderabad",
        "Sep 2024 – Present",
        [
            "<b>Developed a GenAI seafood-traceability system:</b> modeled processing stages as a "
            "Neo4j knowledge graph, complemented by a LangChain chatbot for straightforward batch "
            "and Purchase Order queries (self-taught in Neo4j and Cypher).",
            "<b>Created and launched Pattern Intelligence:</b> this machine-analytics product features "
            "a color-coded Machine Timeline, providing clients with real-time, at-a-glance insights.",
            "<b>Automated the delivery of daily and weekly reports:</b> reports are now sent "
            "seamlessly via email and WhatsApp.",
        ],
    ),
    (
        "Full Stack Developer",
        "CyberMart India, Hyderabad",
        "Oct 2023 – Sep 2024",
        [
            "<b>Automated the order-to-delivery pipeline:</b> integrated third-party logistics "
            "partners (Shiprocket — Ecom Express, DTDC — and Bluedart), eliminating manual "
            "shipment handling.",
            "<b>Built invoice and waybill templates:</b> dynamic EJS templates with barcodes, "
            "auto-generated and delivered to customers.",
        ],
    ),
    (
        "Full Stack Developer",
        "Crenspire Technologies, Ahmedabad",
        "Mar 2023 – Sep 2023",
        [
            "<b>Developed web features for a Canada-based client:</b> worked to professional "
            "coding standards and code-review practices.",
        ],
    ),
    (
        "Full Stack Developer",
        "Sanketika Consulting Pvt Ltd, Bangalore",
        "Mar 2022 – Dec 2022",
        [
            "<b>Built full-stack web application features:</b> developed and maintained features "
            "using React and Node.js.",
        ],
    ),
]

PROJECTS = [
    (
        "Conversational RAG Chatbot  (deployed)",
        "LangChain · FAISS · HuggingFace · Groq · Streamlit",
        "Document-QA chatbot with PDF upload + chat memory, live on Streamlit Cloud. "
        "Embeddings run locally (HuggingFace) for zero per-use cost; users bring their own LLM key.",
    ),
    (
        "NestJS Microservices System",
        "NestJS · Stripe · MongoDB · Docker",
        "Distributed system with auth, reservation, payments & notifications services — JWT "
        "auth, Stripe payments, event-driven messaging, and Docker Compose orchestration.",
    ),
    (
        "Enhanced Q&A Chatbot",
        "LangChain (LCEL) · Streamlit",
        "LLM chat app with model picker plus temperature and max-token controls, built on "
        "modern LCEL chains.",
    ),
    (
        "ML Fundamentals",
        "scikit-learn · pandas",
        "Regression and classification (logistic regression, KNN) with feature engineering "
        "(encoding, scaling, selection) and scikit-learn pipelines across multiple datasets.",
    ),
]

SKILLS = [
    ("AI / ML", "LangChain, RAG, LCEL, FAISS, HuggingFace, Neo4j knowledge graphs, "
                "GenAI chatbots, prompt engineering; scikit-learn, pandas (regression, "
                "classification, feature engineering, pipelines)"),
    ("Frontend", "React, TypeScript, JavaScript, HTML, CSS, Bootstrap, React Hook Form"),
    ("Backend", "Node.js, Python, REST APIs, design patterns"),
    ("Databases", "MongoDB, SQL"),
    ("Cloud / Tools", "AWS, Git, Bitbucket, Jira, Puppeteer"),
]

EDUCATION = [
    ("Full Stack Development & ML", "Nelware Disruptive Technologies", "Apr 2021 – Feb 2022"),
    ("B.Tech, Mechanical Engineering", "Rajiv Gandhi University of Knowledge & Technologies",
     "2018 – 2022"),  # TODO: confirm years
]

STRENGTHS = ["Team Leadership", "Mentoring", "Ownership", "Clear Communication"]

# ----------------------------------------------------------------------------
# 2) STYLE
# ----------------------------------------------------------------------------
NAVY = colors.HexColor("#1f3b57")
ACCENT = colors.HexColor("#2e6da4")
LIGHT = colors.HexColor("#f2f5f8")
GREY = colors.HexColor("#555555")

# sidebar (white text on navy)
side_h = ParagraphStyle("side_h", fontName="Helvetica-Bold", fontSize=10.5,
                        textColor=colors.white, spaceBefore=10, spaceAfter=4,
                        leading=13, alignment=TA_LEFT)
side_t = ParagraphStyle("side_t", fontName="Helvetica", fontSize=8.5,
                        textColor=colors.whitesmoke, leading=12, spaceAfter=2)
side_label = ParagraphStyle("side_label", fontName="Helvetica-Bold", fontSize=8.5,
                            textColor=colors.white, leading=12)
name_st = ParagraphStyle("name", fontName="Helvetica-Bold", fontSize=18,
                        textColor=colors.white, leading=21, spaceAfter=2)
title_st = ParagraphStyle("title", fontName="Helvetica", fontSize=10,
                        textColor=colors.HexColor("#bcd3e8"), leading=13, spaceAfter=6)

# main column
main_h = ParagraphStyle("main_h", fontName="Helvetica-Bold", fontSize=12,
                        textColor=NAVY, spaceBefore=10, spaceAfter=2, leading=15)
role_st = ParagraphStyle("role", fontName="Helvetica-Bold", fontSize=10.5,
                        textColor=colors.black, leading=13)
meta_st = ParagraphStyle("meta", fontName="Helvetica-Oblique", fontSize=8.5,
                        textColor=GREY, leading=12, spaceAfter=2)
bullet_st = ParagraphStyle("bullet", fontName="Helvetica", fontSize=9,
                        textColor=colors.HexColor("#222222"), leading=12.5,
                        leftIndent=10, bulletIndent=0, spaceAfter=3)
body_st = ParagraphStyle("body", fontName="Helvetica", fontSize=9,
                        textColor=colors.HexColor("#222222"), leading=12.5, spaceAfter=4)
proj_st = ParagraphStyle("proj", fontName="Helvetica-Bold", fontSize=10,
                        textColor=colors.black, leading=13)


def hr(color=ACCENT, width=0.8):
    t = Table([[""]], colWidths=[None], rowHeights=[2])
    t.setStyle(TableStyle([("LINEBELOW", (0, 0), (-1, -1), width, color)]))
    return t


# ----------------------------------------------------------------------------
# 3) BUILD COLUMN CONTENT
# ----------------------------------------------------------------------------
def build_sidebar():
    f = [Paragraph(NAME, name_st), Paragraph(TITLE, title_st)]
    f.append(Paragraph("CONTACT", side_h))
    for label, val in CONTACT:
        f.append(Paragraph(f"<b>{label}:</b> {val}", side_t))
    f.append(Paragraph("SKILLS", side_h))
    for cat, items in SKILLS:
        f.append(Paragraph(cat, side_label))
        f.append(Paragraph(items, side_t))
        f.append(Spacer(1, 3))
    f.append(Paragraph("EDUCATION", side_h))
    for deg, school, yrs in EDUCATION:
        f.append(Paragraph(f"<b>{deg}</b>", side_t))
        f.append(Paragraph(school, side_t))
        f.append(Paragraph(yrs, side_t))
        f.append(Spacer(1, 4))
    f.append(Paragraph("STRENGTHS", side_h))
    f.append(Paragraph(" · ".join(STRENGTHS), side_t))
    return f


def build_main():
    f = [Paragraph("SUMMARY", main_h), hr(), Spacer(1, 4),
        Paragraph(SUMMARY, body_st)]
    f.append(Paragraph("WORK EXPERIENCE", main_h))
    f.append(hr())
    f.append(Spacer(1, 4))
    for role, company, dates, bullets in EXPERIENCE:
        f.append(Paragraph(f"{role} — <font color='#2e6da4'>{company}</font>", role_st))
        f.append(Paragraph(dates, meta_st))
        for b in bullets:
            f.append(Paragraph(b, bullet_st, bulletText="•"))
        f.append(Spacer(1, 5))
    f.append(Paragraph("PROJECTS", main_h))
    f.append(hr())
    f.append(Spacer(1, 4))
    for title, stack, desc in PROJECTS:
        f.append(Paragraph(title, proj_st))
        f.append(Paragraph(stack, meta_st))
        f.append(Paragraph(desc, body_st))
        f.append(Spacer(1, 3))
    return f


# ----------------------------------------------------------------------------
# 4) LAYOUT  — sidebar background + two frames
# ----------------------------------------------------------------------------
PAGE_W, PAGE_H = A4
MARGIN = 0
SIDEBAR_W = 62 * mm


def draw_sidebar_bg(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(NAVY)
    canvas.rect(0, 0, SIDEBAR_W, PAGE_H, stroke=0, fill=1)
    canvas.restoreState()


def main():
    out = __file__.rsplit("/", 1)[0] + "/Basha_Resume.pdf"
    doc = BaseDocTemplate(out, pagesize=A4,
                        leftMargin=0, rightMargin=0, topMargin=0, bottomMargin=0)

    pad = 7 * mm
    side_frame = Frame(pad, pad, SIDEBAR_W - 2 * pad, PAGE_H - 2 * pad,
                    id="side", showBoundary=0)
    main_frame = Frame(SIDEBAR_W + pad, pad, PAGE_W - SIDEBAR_W - 2 * pad,
                    PAGE_H - 2 * pad, id="main", showBoundary=0)

    # Two-column independent layout: render both as one row in an outer table
    # placed in a single full-width frame is awkward; instead we use a frame per
    # column and flow sidebar first, then main, via a page template with both.
    doc.addPageTemplates([
        PageTemplate(id="resume", frames=[side_frame, main_frame],
                    onPage=draw_sidebar_bg)
    ])

    story = build_sidebar()
    story.append(FrameBreakFlowable())   # jump to main frame
    story += build_main()
    doc.build(story)
    print(f"✓ wrote {out}")


# small helper flowable to force a frame break
from reportlab.platypus import FrameBreak as FrameBreakFlowable  # noqa: E402

if __name__ == "__main__":
    main()
