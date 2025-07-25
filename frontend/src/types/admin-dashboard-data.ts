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

export interface PaymentApprovals {
  paymentId: string; // Guid → string
  paymentType?: string;
  learnerName?: string;
  status?: string;
  paymentDate?: string; // Use string for date inputs (ISO format)
  referenceNo?: string;
  paymentProof?: File | null; // byte[] → File in browser
}

