
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CareerSuggestion, DetailedRoadmap, Course } from "../types";
import { fallbackRoadmap, fallbackCourse } from "./mockData";

// Access environment variables using Vite's syntax
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Debug: Check if key is loaded (remove in production)
console.log("Gemini API Key Loaded:", API_KEY ? "Yes (Ends with " + API_KEY.slice(-4) + ")" : "No");

if (!API_KEY) {
  console.error("Missing VITE_GEMINI_API_KEY in environment variables");
}

const genAI = new GoogleGenerativeAI(API_KEY || 'dummy_key_to_prevent_crash_on_init');
// Model for structured data (JSON)
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
  generationConfig: { responseMimeType: "application/json" }
}); 
// Model for free-text content (Markdown)
const textModel = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash"
}); 

// Quick retry helper for 429 errors
const generateWithRetry = async (modelInstance: any, prompt: string, retries = 3, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await modelInstance.generateContent(prompt);
    } catch (error: any) {
      const isQuota = error.status === 429 || error.message?.includes('429') || error.message?.includes('quota');
      if (isQuota && i < retries - 1) {
        console.warn(`Gemini Quota 429. Retrying in ${delay/1000}s... (Attempt ${i + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
        continue;
      }
      throw error;
    }
  }
};

export const getMultipleCareerSuggestions = async (interests: string): Promise<CareerSuggestion[]> => {
  try {
    const prompt = `Suggest exactly 3 different tech career paths for a student with these interests: "${interests}". Provide specific roles, reasoning tailored to their interests, top 3 essential skills, and difficulty level as a JSON array.
    Format example:
    [
      {
        "career": "Frontend Developer",
        "reason": "You like visual design and coding.",
        "topSkills": ["React", "CSS", "TypeScript"],
        "difficulty": "Intermediate"
      }
    ]`;
    
    const result = await generateWithRetry(model, prompt);
    const response = await result.response;
    const text = response.text();
    
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanText) as CareerSuggestion[];
  } catch (error) {
    console.error("Gemini API Error (getMultipleCareerSuggestions):", error);
    return [
      {
        career: "Service Unavailable (Quota Limit)",
        reason: "The AI service is currently experiencing high load. Please try again in a minute.",
        topSkills: ["Patience", "Retry Logic", "API Management"],
        difficulty: "Beginner"
      }
    ];
  }
};

export const getCareerSuggestion = async (interests: string): Promise<CareerSuggestion> => {
  try {
    const prompt = `Suggest a tech career path for a student with these interests: "${interests}". Provide a specific role, reasoning, top 3 essential skills, and difficulty level as JSON.
    Format example:
    {
      "career": "Frontend Developer",
      "reason": "You like visual design and coding.",
      "topSkills": ["React", "CSS", "TypeScript"],
      "difficulty": "Intermediate"
    }`;
    
    // Use retry wrapper
    const result = await generateWithRetry(model, prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up markdown code blocks if present
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanText) as CareerSuggestion;
  } catch (error) {
    console.error("Gemini API Error (getCareerSuggestion):", error);
    // Return explicit error or fallback
    return {
      career: "Service Unavailable (Quota Limit)",
      reason: "The AI service is currently experiencing high load. Please try again in a minute.",
      topSkills: ["Patience", "Retry Logic", "API Management"],
      difficulty: "Temporary Issue"
    };
  }
};

export const generateRoadmap = async (role: string): Promise<DetailedRoadmap | null> => {
  try {
    // Smaller, faster prompt — just structure + title/description, fewer topics
    const prompt = `Create a technical learning roadmap for: "${role}". 
    Return ONLY raw JSON, no markdown:
    {
      "title": "Short Roadmap Title",
      "description": "One sentence overview",
      "role": "${role}",
      "phases": [
        {
          "id": "phase-1",
          "title": "Phase Name",
          "description": "What this phase covers",
          "duration": "e.g. 4 weeks",
          "topics": [
            {
              "title": "Topic Name",
              "concepts": ["concept1", "concept2", "concept3"],
              "resources": [
                { "title": "Resource Name", "url": "https://example.com", "type": "course" }
              ]
            }
          ]
        }
      ]
    }
    Rules:
    - Exactly 4 phases.
    - Each phase has exactly 3 topics (not more).
    - Each topic has exactly 3 concepts.
    - Each topic has exactly 1 resource.
    - Output strictly raw JSON only.`;

    const result = await generateWithRetry(model, prompt);
    const response = await result.response;
    const text = response.text();
    
    let jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
    if (jsonMatch) jsonString = jsonMatch[0];

    try {
      return JSON.parse(jsonString) as DetailedRoadmap;
    } catch (parseError) {
      console.error("Failed to parse JSON from Gemini response:", text);
      return null;
    }
  } catch (error) {
    console.error("Gemini Roadmap Generation Error:", error);
    return null;
  }
}

// Stream roadmap phase by phase — call onPhase as each arrives
export const generateRoadmapStreaming = async (
  role: string,
  onMeta: (title: string, description: string) => void,
  onPhase: (phase: any) => void
): Promise<void> => {
  // Step 1: get title + description fast
  const metaPrompt = `For a "${role}" learning roadmap, return ONLY this raw JSON (no markdown):
  {"title": "${role} Roadmap", "description": "One sentence describing what this roadmap covers"}`;
  
  try {
    const metaResult = await generateWithRetry(textModel, metaPrompt);
    const metaText = metaResult.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const metaMatch = metaText.match(/\{[\s\S]*?\}/);
    if (metaMatch) {
      const meta = JSON.parse(metaMatch[0]);
      onMeta(meta.title, meta.description);
    }
  } catch (e) {
    onMeta(`${role} Roadmap`, 'AI-generated learning path');
  }

  // Step 2: generate each phase in parallel (all 4 at once, each is small)
  const phaseNames = ['Foundations', 'Core Skills', 'Advanced Topics', 'Mastery & Projects'];
  
  await Promise.all(phaseNames.map(async (phaseName, idx) => {
    const phasePrompt = `Create phase ${idx + 1} of 4 ("${phaseName}") for a "${role}" learning roadmap.
    Return ONLY raw JSON (no markdown):
    {
      "id": "phase-${idx + 1}",
      "title": "${phaseName}",
      "description": "What this phase covers in one sentence",
      "duration": "X weeks",
      "topics": [
        {
          "title": "Topic Name",
          "concepts": ["concept1", "concept2", "concept3"],
          "resources": [{"title": "Resource", "url": "https://example.com", "type": "course"}]
        }
      ]
    }
    Rules: exactly 3 topics, 3 concepts each, 1 resource each. Raw JSON only.`;

    try {
      const result = await generateWithRetry(textModel, phasePrompt);
      const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        const phase = JSON.parse(match[0]);
        onPhase({ ...phase, _index: idx });
      }
    } catch (e) {
      console.error(`Phase ${idx + 1} generation error:`, e);
    }
  }));
};;

export const generateQuiz = async (topic: string): Promise<any[]> => {
  try {
    const prompt = `Create a 5-question multiple choice quiz about "${topic}". The quiz should be challenging for a software engineer.
    Return ONLY a raw JSON array. Do not wrap in markdown or code blocks.
    Structure:
    [
      {
        "question": "Question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "Exact string of correct option",
        "explanation": "Why this answer is correct."
      }
    ]`;

    const result = await generateWithRetry(model, prompt);
    const response = await result.response;
    const text = response.text();
    
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const arrayStart = cleanText.indexOf('[');
    const arrayEnd = cleanText.lastIndexOf(']');
    
    if (arrayStart === -1 || arrayEnd === -1) return [];
    
    const jsonStr = cleanText.substring(arrayStart, arrayEnd + 1);
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Quiz Generation Error:", error);
    return [];
  }
};

export const getMoreJobs = async (excludeJobs: string[]): Promise<any[]> => {
  try {
    const excludeList = excludeJobs.join(", ");
    const prompt = `You are a career advisor API. Generate exactly 6 modern, digitally-learnable tech or creative careers that are NOT in this list: ${excludeList}.
    
    Return a raw JSON array containing exactly 6 objects with this exact structure for rendering on our frontend. 
    Category MUST be one of: 'Web/App', 'Cyber/Data', 'Systems/Cloud', 'Design/Creative', 'Marketing/Business'.
    
    Format:
    [
      {
        "title": "Cloud Operations Engineer",
        "desc": "Ensure the reliability of cloud infrastructure and pipelines.",
        "icon": "Cloud", 
        "color": "text-amber-500",
        "bg": "bg-amber-50 dark:bg-amber-500/10",
        "category": "Systems/Cloud",
        "salary": "$100K - $150K",
        "growth": "+12%",
        "companies": ["AWS", "Startups", "Enterprise"]
      }
    ]
    
    IMPORTANT MUST-FOLLOW RULES:
    1. Output strictly bare JSON array [ ... ] with no markdown code blocks, no backticks, no markdown formatting.
    2. The "icon" property MUST be a string specifying one of these Lucide React icon names: "Code2", "Smartphone", "Database", "Cpu", "ShieldAlert", "Cloud", "TrendingUp", "MonitorPlay", "Terminal", "PenTool", "Globe", "Briefcase", "Server", "Layers".
    3. Ensure variety in categories and colors (use text-blue-500, text-emerald-500, text-rose-500, text-indigo-500, etc. and corresponding bg-50).`;

    const result = await generateWithRetry(model, prompt);
    const response = await result.response;
    const text = response.text();
    
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const arrayStart = cleanText.indexOf('[');
    const arrayEnd = cleanText.lastIndexOf(']');
    
    if (arrayStart === -1 || arrayEnd === -1) return [];
    
    const jsonStr = cleanText.substring(arrayStart, arrayEnd + 1);
    const jobs = JSON.parse(jsonStr);
    return Array.isArray(jobs) ? jobs : [];
  } catch (error) {
    console.error("Gemini Job Generation Error:", error);
    return [];
  }
};

// Fetch a single quiz question — used for instant-load streaming UX
export const generateSingleQuestion = async (topic: string, index: number, total: number): Promise<any | null> => {
  try {
    const prompt = `Create question ${index + 1} of ${total} for a multiple choice quiz about "${topic}".
    Return ONLY a single raw JSON object. No markdown, no code blocks, no array wrapper.
    Format:
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Exact string of correct option",
      "explanation": "Why this answer is correct."
    }`;

    const result = await generateWithRetry(textModel, prompt);
    const response = await result.response;
    const text = response.text();
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const start = cleanText.indexOf('{');
    const end = cleanText.lastIndexOf('}');
    if (start === -1 || end === -1) return null;
    return JSON.parse(cleanText.substring(start, end + 1));
  } catch (error) {
    console.error(`Question ${index + 1} generation error:`, error);
    return null;
  }
};

export const evaluateCareerQuiz = async (answers: string): Promise<CareerSuggestion[]> => {
  try {
    const prompt = `Based on these quiz responses from a student: "${answers}", recommend 3 specific tech career paths. 
    Return a JSON array where each object has:
    - "career": Role name
    - "reason": Brief rationale (1 sentence)
    - "topSkills": Array of 3 key skills
    - "difficulty": "Beginner", "Intermediate", or "Advanced"
    
    Example format:
    [
      { "career": "DevOps Engineer", "reason": "...", "topSkills": ["Linux", "Docker", "AWS"], "difficulty": "Advanced" }
    ]`;

    const result = await generateWithRetry(model, prompt);
    const response = await result.response;
    const text = response.text();
    
    // Improved JSON extraction
    let jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonMatch = jsonString.match(/\[[\s\S]*\]/);
    if (jsonMatch) jsonString = jsonMatch[0];
    
    return JSON.parse(jsonString) as CareerSuggestion[];
  } catch (error) {
    console.error("Gemini Quiz Evaluation Error:", error);
    return [];
  }
};

export const generateCourseDetails = async (role: string): Promise<Course | null> => {
  try {
    const prompt = `Create a comprehensive technical course structure for "${role}".
    It must be ready for a student to learn from immediately strictly in JSON format.
    
    Structure:
    {
      "title": "Mastering [Role] Engineering",
      "description": "A complete 0-to-Hero guide...",
      "category": "Software Engineering",
      "level": "Intermediate",
      "duration": "40 Hours",
      "modules": [
        {
          "title": "Module 1: Deep Dive into [Topic]",
          "lessons": [
            { 
              "title": "Understanding the core of [Concept]", 
              "content": "[CONTENT_PENDING]", 
              "duration": "45 min" 
            }
          ]
        }
      ]
    }

    CRITICAL INSTRUCTIONS:
    1. The 'content' field MUST be exact string "[CONTENT_PENDING]" for ALL lessons. We will generate deep content lazily.
    2. Create 5-8 comprehensive modules.
    3. Each module must have 3-5 detailed lesson titles.
    4. Focus on high-quality curriculum structure.`;

    const result = await generateWithRetry(model, prompt);
    const response = await result.response;
    const text = response.text();
    
    let jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
    if (jsonMatch) jsonString = jsonMatch[0];

    try {
      const courseData = JSON.parse(jsonString);
      // Add mock ID and metrics
      return {
        ...courseData,
        id: crypto.randomUUID(),
        author: 'AI Architect', 
        enrolled: 0,
        rating: 4.8
      } as Course;
    } catch (parseError) {
      console.error("Failed to parse JSON for course:", text);
      return null;
    }
  } catch (error) {
    console.error("Gemini Course Generation Error:", error);
    return null;
  }
};

export const generateLessonContent = async (lessonTitle: string, moduleTitle: string, courseTitle: string): Promise<string> => {
  try {
    const prompt = `Write a concise educational lesson for a student taking the course "${courseTitle}".
    
    Module: ${moduleTitle}
    Lesson: ${lessonTitle}
    
    Requirements:
    1. Output STRICT Markdown.
    2. Start with a brief introduction.
    3. Include "Key Concepts" as bullet points.
    4. Provide clear, well-commented Code Examples (if technical).
    5. Include a "Practical Exercise" or "Challenge" at the end.
    6. Tone: Professional, encouraging, and technically accurate.
    7. Length: Concise (~300-400 words). Focus on clarity and core concepts rather than exhaustive detail.
    8. Do NOT wrap in JSON. Return raw Markdown text.Start directly with the # Title.`;

    const result = await generateWithRetry(textModel, prompt);
    return result.response.text();
  } catch (error) {
     console.error("Lesson generation failed", error);
     return "## Error Loading Content\nWe couldn't generate this lesson right now. Please try again later (API Quota might be exceeded).";
  }
};

export const generateInterviewQuestions = async (role: string, difficulty: 'Beginner' | 'Intermediate' | 'Advanced'): Promise<string[]> => {
  const prompt = `You are an expert technical interviewer hiring for a ${role} role. 
  Generate 3 strict, technical interview questions appropriate for a ${difficulty} level candidate.
  Return ONLY a raw JSON array of strings containing the questions.
  Example: ["question 1", "question 2", "question 3"]`;

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

export interface EvaluationMatrix {
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
  const prompt = `You are a strict technical interviewer evaluating a candidate for a ${role} role.
  Question asked: "${question}"
  Candidate's answer: "${answer}"
  
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
  }`;

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
};
