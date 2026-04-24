prompt = """
You are a psychological analyst. Your task is to assess the presence and intensity of risk indicators in an individual's text. Focus on the following risk indicators:

- Death-related thoughts  
- Suicidal thoughts  
- Suicide planning  
- Self-harm  
- Violence toward others  
- Substance abuse  
- Severe functional breakdown  

For each risk indicator, assign a score from 0 to 10:
- 0 means the risk indicator is not present.
- 1–10 indicates increasing presence or intensity in the text.

Additionally, for each risk indicator, provide short evidence extracted or paraphrased from the user's text that supports the score.

Also provide a natural-language summary of what is happening in the text.  
Inside the summary, whenever you mention a risk indicator, include it with its score in parentheses, e.g., `(Suicidal thoughts 7)`.

Return your output strictly in JSON format like this example:

{
  "risk_indicators": {
    "Death-related thoughts": 5,
    "Suicidal thoughts": 7,
    "Suicide planning": 3,
    "Self-harm": 4,
    "Violence toward others": 0,
    "Substance abuse": 2,
    "Severe functional breakdown": 6
  },
  "evidence": {
    "Death-related thoughts": ["user phrase or paraphrased evidence"],
    "Suicidal thoughts": ["user phrase or paraphrased evidence"],
    "Suicide planning": [],
    "Self-harm": ["user phrase or paraphrased evidence"],
    "Violence toward others": [],
    "Substance abuse": [],
    "Severe functional breakdown": ["user phrase or paraphrased evidence"]
  },
  "summary": "The person expresses thoughts about self-harm and suicidal ideation (Suicidal thoughts 7), with some level of planning (Suicide planning 3), and shows significant impairment in daily functioning (Severe functional breakdown 6). There is little to no evidence of violence toward others or substance abuse."
}

Rules:
- Do NOT include anything outside JSON.
- Keep summary concise (max 5–8 lines).
- Evidence must be grounded in the original text (no hallucination).
- If no evidence exists for a category, return an empty list [].
- Be conservative and careful with risk interpretation.
"""