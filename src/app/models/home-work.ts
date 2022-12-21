import { ScoreAssessmentModel } from './asses-param';
import { StudentModel } from './student';
export interface IHomeWorkModel {
    id: string;
    title: string;
    description: string;
    points: number;
    dueTime: Date;
    tags: string[];
    files: string[];

    lessonId: number;
    subLessonId: number;
    creatorTaskId: string;

}

export class HomeWorkModel implements IHomeWorkModel {
    id: string;
    title: string;
    description: string;
    points: number;
    dueTime: Date;
    tags: string[];
    files: string[];

    lessonId: number;
    subLessonId: number;
    creatorTaskId: string;
    assessments: ScoreAssessmentModel[];

    static getExtension(url: string) {
        return url.split(".")[1].toUpperCase();
    }

    static isImageFile(url: string) {
        return ['PNG', 'JPG', 'JPEG'].includes(url.toUpperCase());
    }
}

export class HomeWorkAssessmentModel extends ScoreAssessmentModel {

    student: StudentModel;

}