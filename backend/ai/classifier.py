def classify_document_type(filename: str, title: str = "", content_text: str = "") -> str:
    """Auto-classify document type based on filename and title"""
    text = f"{filename} {title} {content_text}".lower()

    rules = {
        "FIR": ["fir", "first information", "police report", "complaint"],
        "Witness Statement": ["witness", "statement", "testimony", "deposition"],
        "Investigation Report": ["investigation", "report", "findings", "enquiry"],
        "Evidence Record": ["evidence", "exhibit", "proof", "seized"],
        "Forensic Report": ["forensic", "lab report", "analysis", "cyber forensics"],
        "Charge Sheet": ["charge sheet", "chargesheet", "prosecution", "final report"],
        "Court Filing": ["court", "filing", "petition", "judgment", "order"],
        "Legal Notice": ["notice", "summon", "legal", "warrant"],
        "Medical Report": ["medical", "injury", "postmortem", "autopsy"],
        "Photograph": ["photo", "image", "picture", "visual"],
        "Audio Recording": ["audio", "recording", "voice", "call"],
        "Video Recording": ["video", "footage", "cctv", "clip"],
    }

    for doc_type, keywords in rules.items():
        for keyword in keywords:
            if keyword in text:
                return doc_type

    return "Other"
