export interface AttendanceModel {
    id: string;
    studentId: number;
    time: string;
    status: AttendanceStatus;
    daySessionId: string;
}

export enum AttendanceStatus {
    Present = 1,
    Absent = 0,
    Delayed = 2
}