import axios from "axios";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

/**
 * Sanitize user code to prevent prompt injection attacks.
 * Strips sequences that could break out of the code block in the prompt.
 */
function sanitizeCode(code) {
  return code
    .replace(/```/g, "'''")          // Break out of markdown code blocks
    .slice(0, 8000);                  // Hard cap at 8000 chars
}

/**
 * Send code to OpenAI and return a structured review object.
 */
export const analyzeCode = async (code, language) => {
  const safeCode = sanitizeCode(code);

  const systemPrompt = `You are a senior software engineer conducting a thorough code review.
Your task is to analyze the provided code and return ONLY a valid JSON object — no markdown, no explanation outside the JSON.

The JSON must follow this exact schema:
{
  "bugs": [
    { "text": "description of the bug", "line": "Line X or Lines X–Y", "fix": "corrected code snippet" }
  ],
  "security_issues": [
    { "text": "description of the security issue", "line": "Line X", "fix": "safe replacement code" }
  ],
  "improvements": [
    { "text": "description of the improvement", "line": "Line X or Lines X–Y", "fix": "improved code snippet" }
  ],
  "summary": "one or two paragraph plain-English summary of the overall code quality",
  "rating": <integer 1–10>
}

Rules:
- Be precise and actionable. Every item must include a "fix" with real code.
- "rating" must be an integer between 1 and 10.
- Return ONLY the JSON object. No prose before or after it.
- Do not include markdown backticks around the JSON.`;

  const userPrompt = `Language: ${language}\n\nCode:\n${safeCode}`;

  const response = await axios.post(
    OPENAI_URL,
    {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: 2000,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const raw = response.data.choices[0].message.content.trim();

  // Strip accidental markdown fences if the model adds them
  const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "");

  const parsed = JSON.parse(cleaned);
  return parsed;
};
