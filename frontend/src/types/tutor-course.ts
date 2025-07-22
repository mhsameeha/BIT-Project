
export interface Lesson {
  id: number;
  title: string;
  duration: string;
}

export interface CurriculumSection {
  id: number;
  title: string;
  duration: string;
  lessons: Lesson[];
}

export interface Review {
  id: number;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: Date;
}

export interface CourseData {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  tutorName: string;
  tutorAvatar: string;
  logo: string;
  enrolledStudents: number;
  rating: number;
  reviewCount: number;
  fee: number;
  currency: string;
  updatedAt: Date;
  curriculum: CurriculumSection[];
  reviews: Review[];
}
