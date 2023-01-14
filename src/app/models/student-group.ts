import { StudentModel } from './student';

export class GroupModel {
    id: number;
    name: string;
    classId: number;
    lessonId: number | null;
    subLessonId: number | null;
    homeWorkId: string | null;
    isPublic: boolean;
    subGroups: SubGroupModel[]
}

export interface SubGroupModel {
    id: number;
    name: string;
    groupId: number;
    students: StudentModel[];
}

