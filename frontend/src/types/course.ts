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
  courses: TutorCourse[];
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
  createdDate: Date;
  updatedDate: Date;
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
  subContentOrder: number;
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
  contentSortOrder: number;
  subContent: SubContent[];
}

// Enhanced course interface for tutor course management
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

// Course details response from API
export interface CourseDetailsResponse {
  courseId: string;
  title: string;
  description: string;
  introduction: string;
  price: number;
  currency: string;
  isEnabled: boolean;
  courseImage: Uint8Array | null;
  tags: string[];
  createdDate: string;
  updatedDate: string;

  // Related entity data
  categoryName: string;
  courseDifficultyName: string;
  languageName: string;

  // Tutor information
  tutorFirstName: string;
  tutorLastName: string;
  tutorEmail: string;
  tutorProfPic: string | null;
  tutorDescription: string;
  tutorExperience: string;
  tutorEducation: string;
  tutorFk: string | null; 

  // Course statistics
  enrolledStudents: number;
  averageRating: number;
  reviewCount: number;

  // Course content
  courseContent: CourseDetailsContent[];

  // Course reviews
  reviews: CourseReview[];
}

export interface CourseDetailsContent {
  contentId: string;
  contentTitle: string;
  contentDescription: string;
  contentDuration: string;
  contentSortOrder: number;
  subContent: CourseDetailsSubContent[];
}

export interface CourseDetailsSubContent {
  subContentId: string;
  subContentTitle: string;
  subContentDescription: string;
  type: string;
  subContentOrder: number;
}

export interface CourseReview {
  courseReviewId: string;
  review: string;
  rating: number;
  reviewDate: string;
  learnerFirstName: string;
  learnerLastName: string;
  learnerEmail: string;
  learnerProfilePic: string | null;
}
