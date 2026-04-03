import { DetailedRoadmap, Course } from '../types';

export const fallbackRoadmap: DetailedRoadmap = {
  title: "Frontend Engineering Survival Guide",
  role: "Software Engineer",
  phases: [
    {
      phaseName: "Phase 1: The Foundations",
      topics: [
        {
          topicName: "HTML5 & Semantics",
          keywords: ["DOM", "Forms", "Accessibility", "SEO"],
          resources: [
            { type: "Article", name: "MDN Web Docs: HTML", url: "https://developer.mozilla.org" }
          ]
        },
        {
          topicName: "CSS3 & Layouts",
          keywords: ["Flexbox", "Grid", "Responsive Design", "Variables"],
          resources: [
            { type: "Course", name: "CSS for JavaScript Developers", url: "https://css-for-js.dev" }
          ]
        },
        {
          topicName: "JavaScript Essentials",
          keywords: ["Variables", "Functions", "ES6+", "DOM Manipulation"],
          resources: [
            { type: "Video", name: "JavaScript Crash Course", url: "https://youtube.com" }
          ]
        }
      ]
    },
    {
      phaseName: "Phase 2: Modern Frameworks",
      topics: [
        {
          topicName: "React JS Core",
          keywords: ["Components", "Hooks", "State", "Props"],
          resources: [
            { type: "Documentation", name: "React.dev", url: "https://react.dev" }
          ]
        },
        {
          topicName: "Advanced State Management",
          keywords: ["Context API", "Redux Toolkit", "Zustand"],
          resources: [
            { type: "Article", name: "State in React", url: "https://react.dev/learn" }
          ]
        },
        {
          topicName: "Routing & Data Fetching",
          keywords: ["React Router", "TanStack Query", "Axios"],
          resources: [
            { type: "Documentation", name: "React Query", url: "https://tanstack.com/query/latest" }
          ]
        }
      ]
    },
    {
      phaseName: "Phase 3: Deep Dive & Architecture",
      topics: [
        {
          topicName: "TypeScript",
          keywords: ["Types", "Interfaces", "Generics", "Strict Mode"],
          resources: [
            { type: "Course", name: "Total TypeScript", url: "https://totaltypescript.com" }
          ]
        },
        {
          topicName: "Performance Optimization",
          keywords: ["Memoization", "Code Splitting", "Web Vitals"],
          resources: [
            { type: "Article", name: "Web Dev Vitals", url: "https://web.dev" }
          ]
        }
      ]
    }
  ]
};

export const fallbackCourse: Course = {
  id: "mock-course-123",
  title: "Full Stack Mastery",
  description: "A comprehensive fallback course provided when AI generation is unavailable.",
  category: "Software Development",
  level: "Intermediate",
  duration: "4 Weeks",
  modules: [
    {
      title: "Module 1: The Setup",
      lessons: [
        { title: "Understanding the Stack", duration: "15 mins", content: "We will build a full-stack application using modern tools.", isCompleted: false },
        { title: "Environment Configuration", duration: "20 mins", content: "Setting up Node, NPM, and Git.", isCompleted: false }
      ]
    },
    {
      title: "Module 2: The Backend",
      lessons: [
        { title: "API Design", duration: "30 mins", content: "RESTful principles and GraphQL basics.", isCompleted: false },
        { title: "Database Schema", duration: "45 mins", content: "SQL concepts and data modeling.", isCompleted: false }
      ]
    }
  ],
  author: "Fallback System",
  rating: 4.8,
  enrolled_count: 0
};
