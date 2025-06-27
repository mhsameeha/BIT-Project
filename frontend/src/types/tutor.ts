
// export const TutorStatus = {
//     pending: 'Pending',
//     approved: 'Approved',
//     Rejected: 'Rejected',
// }
export interface Tutors {
    tutorid: number
  approvalStatus:'Pending' | 'Approved' | 'Rejected';
  tutorName: string;
}