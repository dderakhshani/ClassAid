import { environment } from "src/environments/environment";

export class Lesson {
    id: number;
    name: string;
    gradeId: number;
    gradeName: string;
    schoolId: number;
    parentId: number;

    taskTime: string;

    getImageUrl() {
        return `${environment.imageUrl}/lessons_org/grade_${this.gradeId}/c_${this.id}.jpg`;
    }

    parent?: Lesson;
}