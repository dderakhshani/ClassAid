import { ClassSessionModel } from './class';
export interface AttendanceModel {
    id: string;
    studentId: number;
    time: string;
    status: AttendanceStatus;
    daySessionId: string;
    taskId: string;

    studentFullName: string;
    session?: ClassSessionModel;
}

export enum AttendanceStatus {

    Present = 1,
    Absent = 2,
    Delayed = 3,
    Remote = 4
}