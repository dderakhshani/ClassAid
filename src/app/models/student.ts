import { environment } from "src/environments/environment";
import { Score, StudentNotes, StudentReminder } from "./remider";

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

    present: boolean;
    reminders: StudentReminder[] = [];
    notes: StudentNotes[] = [];
    scores: Score[] = [];
    homeWorkIssue: boolean;
    hasAssessment: boolean;


    getImageUrl() {
        return `${environment.imageUrl}/students/student_${this.id}.jpg`;
    }

    static getImageUrl(studentId: number) {
        return `${environment.imageUrl}/students/student_${studentId}.jpg`;
    }
}