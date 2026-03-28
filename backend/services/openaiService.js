import axios from "axios";

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
 * Send code to Google Gemini API (Free Tier) and return a structured review object.
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
  const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "dummy_key") {
    throw new Error("Missing GEMINI_API_KEY in .env");
  }

  let attempts = 0;
  const maxAttempts = 2;

  while (attempts < maxAttempts) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 2000,
            responseMimeType: "application/json"
          }
        },
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      const raw = response.data.candidates[0].content.parts[0].text.trim();
      const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "");
      return JSON.parse(cleaned);
    } catch (error) {
      attempts++;
      if (error.response?.status === 429 && attempts < maxAttempts) {
        console.warn(`Gemini Rate Limit (429). Retrying attempt ${attempts}...`);
        await new Promise(r => setTimeout(r, 2000)); // Wait 2 seconds before retry
        continue;
      }
      if (error.response?.status === 429) {
        console.error("Gemini API Rate Limit hit after retries. Quota exceeded.");
      } else {
        console.error("Gemini API Error:", error.response?.data || error.message);
      }
      throw error;
    }
  }
};
