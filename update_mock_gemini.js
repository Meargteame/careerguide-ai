const fs = require('fs');
const path = 'frontend/services/geminiService.ts';

let code = fs.readFileSync(path, 'utf8');

// Replace evaluateInterviewAnswer
const oldEvalStart = "export const evaluateInterviewAnswer = async (";
const evalStrRegex = /export const evaluateInterviewAnswer = async \([\s\S]*?^};/m;

const newEvalCode = `export interface EvaluationMatrix {
  score: number;
  clarity: number;
  technicalAccuracy: number;
  completeness: number;
  feedback: string;
  modelAnswer: string;
  keyMissedPoints: string[];
}

export const evaluateInterviewAnswer = async (
  role: string, 
  question: string, 
  answer: string
): Promise<EvaluationMatrix> => {
  const prompt = \`You are a strict technical interviewer evaluating a candidate for a \${role} role.
  Question asked: "\${question}"
  Candidate's answer: "\${answer}"
  
  Evaluate the answer out of 10. Give critical feedback. Assess 3 core metrics out of 10: Clarity, Technical Accuracy, and Completeness.
  
  Return ONLY a JSON object with this exact structure:
  {
    "score": <number 0-10, overall>,
    "clarity": <number 0-10>,
    "technicalAccuracy": <number 0-10>,
    "completeness": <number 0-10>,
    "feedback": "<string: concise critical feedback>",
    "modelAnswer": "<string: the ideal short answer>",
    "keyMissedPoints": ["point 1", "point 2"]
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
      clarity: 5,
      technicalAccuracy: 5,
      completeness: 5,
      feedback: "Failed to evaluate answer properly due to AI error.",
      modelAnswer: "No ideal answer could be generated right now.",
      keyMissedPoints: []
    };
  }
};`;

code = code.replace(evalStrRegex, newEvalCode);
fs.writeFileSync(path, code);
console.log('Done replacement');
