// src/services/aiService.js
// ALL Gemini AI logic lives here — not in controllers or routes.
// This is the "service layer" the assignment requires.
// Controllers simply call this function and use the result.

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Gemini client reads GEMINI_API_KEY from process.env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const VALID_SENIORITIES = ['Junior', 'Mid', 'Senior', 'Lead', 'Not Specified'];

const withRetry = async (fn, retries = 3, delayMs = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      const isRetryable = err.message?.includes('503') || err.message?.includes('overloaded') || err.message?.includes('unavailable');
      if (isRetryable && i < retries - 1) {
        await new Promise(r => setTimeout(r, delayMs));
      } else {
        throw err;
      }
    }
  }
};

const parseJobDescription = async (jobDescription) => {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-lite',
    generationConfig: { responseMimeType: 'application/json' }
  });

  // ── Call 1: Parse the job description into structured fields ──
  const parseResult = await withRetry(() => model.generateContent({
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `You are an expert at analyzing job descriptions.
Extract structured information and return ONLY valid JSON.
Never include any explanation, markdown, or text outside the JSON object.

Analyze this job description and return ONLY this exact JSON structure:
{
  "company": "company name or empty string if not found",
  "role": "job title",
  "requiredSkills": ["skill1", "skill2"],
  "niceToHaveSkills": ["skill1", "skill2"],
  "seniority": "Junior | Mid | Senior | Lead | Not Specified",
  "location": "location or Remote or empty string"
}

Job Description:
${jobDescription}`
          }
        ]
      }
    ]
  }));

  const parseContent = parseResult.response.text();
  if (!parseContent) {
    throw new Error('Gemini returned an empty response for JD parsing');
  }

  let parsedData;
  try {
    parsedData = JSON.parse(parseContent);
  } catch {
    throw new Error('Gemini returned invalid JSON for JD parsing');
  }

  // Make sure seniority is one of our allowed values
  if (!VALID_SENIORITIES.includes(parsedData.seniority)) {
    parsedData.seniority = 'Not Specified';
  }

  // Make sure arrays are actually arrays
  if (!Array.isArray(parsedData.requiredSkills))    parsedData.requiredSkills    = [];
  if (!Array.isArray(parsedData.niceToHaveSkills))  parsedData.niceToHaveSkills  = [];

  // ── Call 2: Generate resume bullet point suggestions ──
  const suggestionsResult = await withRetry(() => model.generateContent({
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `You are an expert resume writer.
Generate specific, quantifiable resume bullet points tailored to a job description.
Return ONLY valid JSON. Never include explanation or markdown outside the JSON.

Generate 4 strong resume bullet points for this role.
Make them specific to the skills listed. Use action verbs and include metrics where possible.

Role: ${parsedData.role}
Required Skills: ${parsedData.requiredSkills.join(', ')}
Seniority: ${parsedData.seniority}

Return ONLY this JSON:
{
  "suggestions": ["bullet 1", "bullet 2", "bullet 3", "bullet 4"]
}`
          }
        ]
      }
    ]
  }));

  const suggestionsContent = suggestionsResult.response.text();
  if (!suggestionsContent) {
    throw new Error('Gemini returned empty response for suggestions');
  }

  let suggestionsData;
  try {
    suggestionsData = JSON.parse(suggestionsContent);
  } catch {
    throw new Error('Gemini returned invalid JSON for suggestions');
  }

  if (!Array.isArray(suggestionsData.suggestions)) {
    suggestionsData.suggestions = [];
  }

  return {
    parsedData,
    resumeSuggestions: suggestionsData.suggestions
  };
};

module.exports = { parseJobDescription };
