// src/services/aiService.js
// ALL OpenAI logic lives here — not in controllers or routes.
// This is the "service layer" the assignment requires.
// Controllers simply call this function and use the result.

const OpenAI = require('openai');

// OpenAI client reads OPENAI_API_KEY from process.env automatically
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const VALID_SENIORITIES = ['Junior', 'Mid', 'Senior', 'Lead', 'Not Specified'];

const parseJobDescription = async (jobDescription) => {
  // ── Call 1: Parse the job description into structured fields ──
  const parseResponse = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an expert at analyzing job descriptions.
Extract structured information and return ONLY valid JSON.
Never include any explanation, markdown, or text outside the JSON object.`
      },
      {
        role: 'user',
        content: `Analyze this job description and return ONLY this exact JSON structure:
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
    ],
    response_format: { type: 'json_object' }, // forces valid JSON output
    temperature: 0.3 // low = more predictable and structured
  });

  const parseContent = parseResponse.choices[0]?.message?.content;
  if (!parseContent) {
    throw new Error('OpenAI returned an empty response for JD parsing');
  }

  let parsedData;
  try {
    parsedData = JSON.parse(parseContent);
  } catch {
    throw new Error('OpenAI returned invalid JSON for JD parsing');
  }

  // Make sure seniority is one of our allowed values
  if (!VALID_SENIORITIES.includes(parsedData.seniority)) {
    parsedData.seniority = 'Not Specified';
  }

  // Make sure arrays are actually arrays
  if (!Array.isArray(parsedData.requiredSkills))    parsedData.requiredSkills    = [];
  if (!Array.isArray(parsedData.niceToHaveSkills))  parsedData.niceToHaveSkills  = [];

  // ── Call 2: Generate resume bullet point suggestions ──
  const suggestionsResponse = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an expert resume writer.
Generate specific, quantifiable resume bullet points tailored to a job description.
Return ONLY valid JSON. Never include explanation or markdown outside the JSON.`
      },
      {
        role: 'user',
        content: `Generate 4 strong resume bullet points for this role.
Make them specific to the skills listed. Use action verbs and include metrics where possible.

Role: ${parsedData.role}
Required Skills: ${parsedData.requiredSkills.join(', ')}
Seniority: ${parsedData.seniority}

Return ONLY this JSON:
{
  "suggestions": ["bullet 1", "bullet 2", "bullet 3", "bullet 4"]
}`
      }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7
  });

  const suggestionsContent = suggestionsResponse.choices[0]?.message?.content;
  if (!suggestionsContent) {
    throw new Error('OpenAI returned empty response for suggestions');
  }

  let suggestionsData;
  try {
    suggestionsData = JSON.parse(suggestionsContent);
  } catch {
    throw new Error('OpenAI returned invalid JSON for suggestions');
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