export const EnrollmentStatus = {
    Ongoing: 'Ongoing',
    Completed: 'Completed',
    Pending: 'Pending',
}
export type Enrollment = {
    enrollmentid: number;
    courseName:string;
    status: typeof EnrollmentStatus[keyof typeof EnrollmentStatus]
}