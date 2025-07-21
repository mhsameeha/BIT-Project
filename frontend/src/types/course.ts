// export interface Course {
//        courseid: number ;
//        courseName: string ;
//        courseIntro:string;
//        price: number;
//        categoryName : string;
//        PublishedDate: Date;
//        courseContentId: string;
//        courseDescription: string;
//        briefIntro: string;
//        resources: string | null;
//        courseLink: string;
//        level : string;
//        duration: string;
// }

export interface PaginatedCourse {
  courses: Course[];
  page: number;
  pageSize: number;
  totalItems: number;
}

export interface PaginatedCourses {
  courses: TutorCourse[];
  page: number;
  pageSize: number;
  totalItems: number;
}

export interface Course {
  courseId: string;
  title: string;
  description: string;
  introduction: string;
  courseDifficultyName: 'Beginner' | 'Intermediate' | 'Advanced';
  categoryName: string;
  tutorId: string;
  tutorName: string;
  courseImage: string;
  price: number;
  isEnabled: boolean;
  enrolledStudents: number;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
  totalLessons: number;
  totalDuration: string; // e.g., "10h 30m"
  languages: string[];
  tags: string[];
  contents?: CourseContent[];
  currency: string;
}

// Course content types for tutor course management
export interface SubContent {
  subContentId: string;
  subContentTitle: string;
  subContentDescription: string;
  type: 'video' | 'document' | 'both';
  videoFile?: File | null;
  documentFile?: File | null;
  videoUrl?: string; // For display purposes
  documentUrl?: string; // For display purposes
}

export interface CourseContent {
  contentId: string;
  contentTitle: string;
  contentDuration: string; // e.g., "45 min", "1.5 hours"
  contentDescription: string;
  subContents: SubContent[];
}

// Enhanced course interface for tutor course management
export interface TutorCourse {
  id: string;
  title: string;
  description: string;
  introduction: string;
  courseDifficultyFk: 'Beginner' | 'Intermediate' | 'Advanced';
  categoryFk: string;
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
  languageFk: string;
  tags: string[];
  currency: string;
  courseContents: CourseContent[]; // Optional course content
}
