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
course: Course[];
page: number;
pageSize : number;
totalItems : number;

}



export interface Course {
  courseId: string;                    // GUID
  tutorName?: string;                  // optional
  courseDifficulty?: string;          // optional
  categoryName?: string;              // optional
  price?: number;                     // optional (decimal)
  title?: string;                     // optional
  introduction?: string;              // optional
  updatedDate?: string;               // optional (ISO 8601 datetime string)
  duration?: string;                  // optional (ISO 8601 or "hh:mm:ss" format)
  rating?: number;                    // optional (decimal)
  enrolledStudents: number;
  reviewCount: number;
  sections: number;
}


// Course content types for tutor course management
export interface SubContent {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'both';
  videoFile?: File | null;
  documentFile?: File | null;
  videoUrl?: string; // For display purposes
  documentUrl?: string; // For display purposes
}

export interface CourseContent {
  id: string;
  title: string;
  duration: string; // e.g., "45 min", "1.5 hours"
  description: string;
  subContents: SubContent[];
}

// Enhanced course interface for tutor course management
export interface TutorCourse {
  id: string;
  title: string;
  description: string;
  briefIntro: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  tutorId: string;
  tutorName: string;
  logo: string;
  fee: number;
  currency: string;
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
  contents?: CourseContent[]; // Optional course content
}

