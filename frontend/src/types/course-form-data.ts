export interface SubContent {
subContentOrder: number;
  subContentId: string;
  subContentTitle: string;
  subContentDescription: string;
  type: 'video' | 'document' | 'both';
  videoFile?: File | null;
  documentFile?: File | null;
  filePath?: string; // For display purposes
  documentUrl?: string; // For display purposes
}

export interface CourseContent {
contentSortOrder: number;
  contentId: string;
  contentTitle: string;
  contentDuration: string; // e.g., "45 min", "1.5 hours"
  contentDescription: string;
  subContent: SubContent[];
}

export interface CourseFormData {
  courseId: string;
  title: string;
  description: string;
  introduction: string;
  categoryFk: string;
  courseDifficultyFk: string;
  price: number;
  currency: string;
  isEnabled: boolean;
  tags: string[];
  languageFk: string;
  courseContent: CourseContent[];
  courseImage: string;
  updatedDate: Date;
}
