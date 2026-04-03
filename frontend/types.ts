
export interface RoadmapResource {
  title: string;
  url: string;
  type: 'video' | 'article' | 'course' | 'documentation';
}

export interface RoadmapTopic {
  title: string;
  concepts: string[]; // Specific concepts to learn (e.g., "Event Loop", "Closures")
  resources: RoadmapResource[];
}

export interface RoadmapPhase {
  id: string;
  title: string;
  description: string;
  duration: string;
  topics: RoadmapTopic[];
}

export interface DetailedRoadmap {
  title: string;
  description: string;
  role: string;
  phases: RoadmapPhase[];
}

export interface Lesson {
  title: string;
  content: string; // Markdown content for the lesson
  duration: string;
  isCompleted?: boolean;
}

export interface CourseModule {
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  modules: CourseModule[];
  author: 'AI Architect' | string;
  duration: string;
  enrolled: number;
  rating: number;
}

export interface CareerSuggestion {
  career: string;
  reason: string;
  topSkills: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  academicYear?: string;
  enrolledPaths: string[];
  xp: number;
  streak: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
}
