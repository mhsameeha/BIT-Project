export const SessionStatus = {
  Pending: 'Pending',
  Confirmed: 'Confirmed',
  Rejected: 'Rejected',
  Completed: 'Completed',
} as const;

export type SessionStatusType = (typeof SessionStatus)[keyof typeof SessionStatus];

export interface Session {
  sessionId: string;
  studentId: string;
  tutorId: string;
  learnerName: string;
  sessionName: string;
  endTime: string;
  startTime: string;
  duration: number; // in hours
  tutorRate: number;
  currency: string;
  sessionStatus: SessionStatusType;
  createdDate: Date;
  updatedDate: Date;
  timeSlots: string[];
  learnerProfPic?: string;
  learnerEmail?: string;
  notes?: string;
  cost: number;
}

// For session request management
export interface SessionRequest extends Session {
  requestMessage?: string;
  rejectionReason?: string;
}
