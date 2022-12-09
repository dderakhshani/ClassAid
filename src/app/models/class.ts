import { Lesson } from 'src/app/models/lessons';

export interface ClassModel {
    id: number;
    courseId: number;
    classRoomId: number;
    teacherId: number;
    classRoomName: string;
    schoolId: number;
    gradeId: number;
}

export class ClassSessionModel {
    id: string;
    daySessionId: number;
    classId: number;
    lessonId: number;
    subLessonId: number;
    startTime: Date;
    endTime?: Date;


    book?: Lesson;
    lesson?: Lesson;
    class?: ClassModel;
    scheduleTimeId?: number;

}