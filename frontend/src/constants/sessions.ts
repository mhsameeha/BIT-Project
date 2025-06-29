import dayjs from 'dayjs';
import { type SessionRequest, SessionStatus } from '../types/session';

// Mock session requests data
export const SESSION_REQUESTS: SessionRequest[] = [
  {
    sessionId: 'SESSION-001',
    studentId: 'STUDENT-001',
    tutorId: 'TUTOR-001',
    learnerName: 'Amara Silva',
    sessionName: 'Python Basics - Data Structures',
    sessionDate: dayjs().add(3, 'day').format('YYYY-MM-DD'),
    sessionTime: '09:00 AM - 11:00 AM',
    duration: 2,
    totalCost: 7000,
    currency: 'LKR',
    status: SessionStatus.Pending,
    createdDate: dayjs().subtract(2, 'hour').toDate(),
    updatedDate: dayjs().subtract(2, 'hour').toDate(),
    timeSlots: ['09:00 AM', '10:00 AM'],
    studentAvatar: '/assets/avatar-7.png',
    studentEmail: 'amara.silva@email.com',
    requestMessage: 'Hi Dr. Nimali! I would like to learn about Python data structures. I have basic programming knowledge but need help with lists, dictionaries, and their practical applications.',
    notes: 'Beginner level student'
  },
  {
    sessionId: 'SESSION-002',
    studentId: 'STUDENT-002',
    tutorId: 'TUTOR-001',
    learnerName: 'Rashan Perera',
    sessionName: 'Advanced Python - Algorithms',
    sessionDate: dayjs().add(5, 'day').format('YYYY-MM-DD'),
    sessionTime: '02:00 PM - 04:00 PM',
    duration: 2,
    totalCost: 7000,
    currency: 'LKR',
    status: SessionStatus.Pending,
    createdDate: dayjs().subtract(1, 'day').toDate(),
    updatedDate: dayjs().subtract(1, 'day').toDate(),
    timeSlots: ['02:00 PM', '03:00 PM'],
    studentAvatar: '/assets/avatar-8.png',
    studentEmail: 'rashan.perera@email.com',
    requestMessage: 'Looking to improve my algorithm skills in Python. Need help with sorting algorithms and time complexity analysis.',
    notes: 'Intermediate level student'
  },
  {
    sessionId: 'SESSION-003',
    studentId: 'STUDENT-003',
    tutorId: 'TUTOR-001',
    learnerName: 'Sanjana Fernando',
    sessionName: 'Python for Web Development',
    sessionDate: dayjs().add(1, 'week').format('YYYY-MM-DD'),
    sessionTime: '10:00 AM - 11:00 AM',
    duration: 1,
    totalCost: 3500,
    currency: 'LKR',
    status: SessionStatus.Confirmed,
    createdDate: dayjs().subtract(3, 'day').toDate(),
    updatedDate: dayjs().subtract(1, 'day').toDate(),
    timeSlots: ['10:00 AM'],
    studentAvatar: '/assets/avatar-9.png',
    studentEmail: 'sanjana.fernando@email.com',
    requestMessage: 'Want to learn how to use Python for web development with Flask framework.',
    notes: 'Has some Python experience'
  },
  {
    sessionId: 'SESSION-004',
    studentId: 'STUDENT-004',
    tutorId: 'TUTOR-002',
    learnerName: 'Kavinda Rajapaksa',
    sessionName: 'Software Testing Fundamentals',
    sessionDate: dayjs().add(4, 'day').format('YYYY-MM-DD'),
    sessionTime: '09:00 AM - 11:00 AM',
    duration: 2,
    totalCost: 8000,
    currency: 'LKR',
    status: SessionStatus.Pending,
    createdDate: dayjs().subtract(4, 'hour').toDate(),
    updatedDate: dayjs().subtract(4, 'hour').toDate(),
    timeSlots: ['09:00 AM', '10:00 AM'],
    studentAvatar: '/assets/avatar-10.png',
    studentEmail: 'kavinda.rajapaksa@email.com',
    requestMessage: 'New to QA field and want to learn testing fundamentals and best practices.',
    notes: 'Complete beginner in testing'
  },
  {
    sessionId: 'SESSION-005',
    studentId: 'STUDENT-005',
    tutorId: 'TUTOR-001',
    learnerName: 'Nimal Jayasinghe',
    sessionName: 'Python Project Review',
    sessionDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    sessionTime: '03:00 PM - 04:00 PM',
    duration: 1,
    totalCost: 3500,
    currency: 'LKR',
    status: SessionStatus.Rejected,
    createdDate: dayjs().subtract(2, 'day').toDate(),
    updatedDate: dayjs().subtract(1, 'day').toDate(),
    timeSlots: ['03:00 PM'],
    studentAvatar: '/assets/avatar-11.png',
    studentEmail: 'nimal.jayasinghe@email.com',
    requestMessage: 'Need help reviewing my Python project and getting feedback.',
    rejectionReason: 'Sorry, I was not available during the requested time slot. Please reschedule for next week.',
    notes: 'Advanced student'
  },
  {
    sessionId: 'SESSION-006',
    studentId: 'STUDENT-006',
    tutorId: 'TUTOR-003',
    learnerName: 'Thilini Wickramasinghe',
    sessionName: 'React.js Advanced Concepts',
    sessionDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
    sessionTime: '02:00 PM - 05:00 PM',
    duration: 3,
    totalCost: 13500,
    currency: 'LKR',
    status: SessionStatus.Pending,
    createdDate: dayjs().subtract(6, 'hour').toDate(),
    updatedDate: dayjs().subtract(6, 'hour').toDate(),
    timeSlots: ['02:00 PM', '03:00 PM', '04:00 PM'],
    studentAvatar: '/assets/avatar-2.png',
    studentEmail: 'thilini.wickramasinghe@email.com',
    requestMessage: 'I want to learn advanced React concepts like Context API, Redux, and performance optimization.',
    notes: 'Has basic React knowledge'
  }
];

// Helper functions
export const getSessionRequestsByTutor = (tutorId: string): SessionRequest[] => {
  return SESSION_REQUESTS.filter(session => session.tutorId === tutorId);
};

export const getSessionRequestsByStatus = (tutorId: string, status: string): SessionRequest[] => {
  return SESSION_REQUESTS.filter(session => 
    session.tutorId === tutorId && session.status === status
  );
};

export const getPendingSessionRequests = (tutorId: string): SessionRequest[] => {
  return getSessionRequestsByStatus(tutorId, SessionStatus.Pending);
};

export const getConfirmedSessions = (tutorId: string): SessionRequest[] => {
  return getSessionRequestsByStatus(tutorId, SessionStatus.Confirmed);
};

export const getRejectedSessions = (tutorId: string): SessionRequest[] => {
  return getSessionRequestsByStatus(tutorId, SessionStatus.Rejected);
};

export const getCompletedSessions = (tutorId: string): SessionRequest[] => {
  return getSessionRequestsByStatus(tutorId, SessionStatus.Completed);
};

// Mock function to update session status
export const updateSessionStatus = (sessionId: string, status: string, rejectionReason?: string): boolean => {
  const sessionIndex = SESSION_REQUESTS.findIndex(session => session.sessionId === sessionId);
  
  if (sessionIndex !== -1) {
    // Type guard to ensure status is valid
    const validStatuses = Object.values(SessionStatus) as string[];
    if (validStatuses.includes(status)) {
      SESSION_REQUESTS[sessionIndex].status = status as (typeof SessionStatus)[keyof typeof SessionStatus];
      SESSION_REQUESTS[sessionIndex].updatedDate = new Date();
      
      if (rejectionReason) {
        SESSION_REQUESTS[sessionIndex].rejectionReason = rejectionReason;
      }
      
      return true;
    }
  }
  
  return false;
};
