import { AssessMeasureLevel } from 'src/app/models/asses-param';
import { ScoreAssessmentModel } from './asses-param';
import { environment } from "src/environments/environment";
import { AttendanceStatus } from "./attendance-model";
import { Note, StudentNotes, StudentReminder } from "./remider";
import { StatReportModel } from './stats-serie';

export class StudentModel {

    id: number;
    name: string;
    family: string;
    birthDate: string | null;
    ssn: string;
    fatherName: string;
    birthPlace: string;

    fullName: string;
    studentCode: string;
    currentClassId: number;
    classRoomName: string;
    gradeId: number;
    gradeName: string;
    status: number;
    personId: number;

    attendanceStatus: AttendanceStatus;
    reminders: StudentReminder[] = [];
    notes: StudentNotes[] = [];
    scores: ScoreAssessmentModel[] = [];
    homeWorkIssue: boolean;
    hasAssessment: boolean;

    isSelected: boolean;

    getImageUrl() {
        return `${environment.imageUrl}/students/student_${this.id}.jpg`;
    }

    static getImageUrl(studentId: number) {
        return `${environment.imageUrl}/students/student_${studentId}.jpg`;
    }
}

export class StudentProfileModel extends StudentModel {
    attendancePercent: number;
    avgAssessment: number;
    positiveScore: number;
    negetiveScore: number;
    accScores: StatReportModel[];
    accAssessments: StatReportModel[];

    avgAssessmentLevel: AssessMeasureLevel;

}

export class StudentAttendanceReportModel extends StudentModel {
    present: number;
    absent: number;
    delay: number;
    remote: number;
}