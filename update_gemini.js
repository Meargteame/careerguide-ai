const fs = require('fs');
const file = 'frontend/services/geminiService.ts';
let code = fs.readFileSync(file, 'utf8');

const newFunctions = `
export const generateInterviewQuestions = async (role: string, difficulty: 'Beginner' | 'Intermediate' | 'Advanced'): Promise<string[]> => {
  const prompt = \`You are an expert technical interviewer hiring for a \${role} role. 
  Generate 3 strict, technical interview questions appropriate for a \${difficulty} level candidate.
  Return ONLY a raw JSON array of strings containing the questions.
  Example: ["question 1", "question 2", "question 3"]\`;

  try {
    const model = getGenAI().getGenerativeModel({ model: "gemini-1.5-flash-8b" });
    const result = await model.generateContent(prompt);
    const jsonStr = extractJsonFromResponse(result);
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Error generating interview questions:', error);
    return ["What are your key strengths?", "Can you describe a challenging project?", "Where do you see yourself in 5 years?"];
  }
};

export const evaluateInterviewAnswer = async (
  role: string, 
  question: string, 
  answer: string
): Promise<{ score: number; feedback: string; modelAnswer: string }> => {
  const prompt = \`You are a strict technical interviewer evaluating a candidate for a \${role} role.
  Question asked: "\${question}"
  Candidate's answer: "\${answer}"
  
  Evaluate the answer out of 10. Give critical feedback on what they missed or got right, and provide a short, ideal model answer.
  
  Return ONLY a JSON object with this exact structure:
  {
    "score": <number between 0 and 10>,
    "feedback": "<string: concise feedback>",
    "modelAnswer": "<string: the ideal answer to the question>"
  }\`;

  try {
    const model = getGenAI().getGenerativeModel({ model: "gemini-1.5-flash-8b" });
    const result = await model.generateContent(prompt);
    const jsonStr = extractJsonFromResponse(result);
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Error evaluating interview answer:', error);
    return {
      score: 5,
      feedback: "Failed to evaluate answer properly due to AI error.",
      modelAnswer: "No ideal answer could be generated right now."
    };
  }
};
\`;

if (!code.includes('generateInterviewQuestions')) {
  fs.writeFileSync(file, code + '\\n' + newFunctions);
  console.log('Added interview functions to geminiService.ts');
} else {
  console.log('Already updated');
}
