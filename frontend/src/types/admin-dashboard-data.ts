export interface RecentTutorApplications {
  tutorId: string; // Guid in C# maps to string in TypeScript
  tutorName: string;
  status: string;
  approvalRequestDate?: string; // Nullable DateTime maps to optional ISO string
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
  recentTutorApplications?: RecentTutorApplications[]; // Nullable list
}
