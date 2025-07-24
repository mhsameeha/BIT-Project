export interface TutorApplication {
  tutorId: string; // Guid in C# maps to string in TypeScript
  tutorName: string;
  status: string;
  approvalRequestDate?: string;
  email: string;
  specialities: string[]; // Nullable DateTime maps to optional ISO string
}

// Main dashboard DTO
export interface AdminDashboardData {
  totalStudents: number;
  totalTutors: number;
  totalIncome: number;
  pendingTutorApprovals: number | 0;
  newStudentsThisMonth: number;
  approvedTutors: number;
  totalRevenue: number;
  monthlyRevenue: number;
  tutorApplications: TutorApplication[]; // Nullable list
}
