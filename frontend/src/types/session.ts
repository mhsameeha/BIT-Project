export const SessionStatus = {
    Pending: 'Pending',
    Confirmed: 'Confirmed',
    Rejected: 'Rejected',
    Completed: 'Completed'
} as const;

export type SessionStatusType = typeof SessionStatus[keyof typeof SessionStatus];

export interface Session {
    sessionId: string;
    studentId: string;
    tutorId: string;
    learnerName: string;
    sessionName: string;
    sessionDate: string;
    sessionTime: string;
    duration: number; // in hours
    totalCost: number;
    currency: string;
    status: SessionStatusType;
    createdDate: Date;
    updatedDate: Date;
    timeSlots: string[];
    studentAvatar?: string;
    studentEmail?: string;
    notes?: string;
}

// For session request management
export interface SessionRequest extends Session {
    requestMessage?: string;
    rejectionReason?: string;
}
