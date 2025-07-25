import { CourseContent } from "./course";

export interface TutorCourse {
  courseId: string;
  title: string;
  description: string;
  introduction: string;
  courseDifficultyName: 'Beginner' | 'Intermediate' | 'Advanced';
  courseDifficultyFk: '';
  categoryFk: '';
  categoryName: string;
  tutorId: string;
  tutorName: string;
  courseImage: string;
  price: number;
  isEnabled: boolean;
  enrolledStudents: number;
  rating: number;
  reviewCount: number;
  createdDate: Date;
  updatedDate: Date;
  totalLessons: number;
  totalDuration: string; // e.g., "10h 30m"
  languages: string;
  languageFk: '';
  tags: string[];
  currency: string;
  courseContent: CourseContent[]; // Optional course content
 
}