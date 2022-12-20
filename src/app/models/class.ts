import { HomeWorkModel } from 'src/app/models/home-work';
import { Lesson } from 'src/app/models/lessons';
import { AssessmentModel, AssessParamModel, ScoreAssessmentModel } from './asses-param';
import { Reminder } from './remider';

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

    reminders: Reminder[] = [];
    notes: Reminder[];
    assessments: AssessmentModel[];
    scores: ScoreAssessmentModel[]
    homeWorks: HomeWorkModel[];
}