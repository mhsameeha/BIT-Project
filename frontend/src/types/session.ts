import { DateTimeFieldProps, TimePickerProps } from "@mui/x-date-pickers";


export const SessionStatus = {
    Pending: 'Pending',
    Confirmed: 'Confirmed',
    Rejected: 'Rejected',
    Completed: 'Completed'
}

export type Session  = {
    sessionId: number;
    studentId: string;
    learnerName: string;
    sessionName: string
    sessionTime: string;
    duration:string;
    status:typeof SessionStatus[keyof typeof SessionStatus];
    createdDate: Date;
    updatedDate: Date;

}
