import { environment } from "src/environments/environment";
import { AssessMeasure } from "./asses-param";

export class Lesson {
    id: number;
    name: string;
    gradeId: number;
    gradeName: string;
    schoolId: number;
    parentId: number;

    // taskTime: string;

    getImageUrl() {
        return `${environment.imageUrl}/lessons_org/grade_${this.gradeId}/c_${this.id}.jpg`;
    }

    static getImageUrl(id: number) {
        return `${environment.imageUrl}/lessons_org/flat/c_${id}.jpg`;
    }

    parent?: Lesson;

    subLessonCount: number;
    sessionsCount: number;
    lastSessionLesson: Lesson;
    avgAssessValue: number;
    avgAssess: AssessMeasure;
}