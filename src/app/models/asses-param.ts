export class AssessmentModel {
    id: string;
    eduParameterId: number;
    eduParameterTitle: string;
    lessonId: number;
    subLessonId: number;
    level: number = 0;
    studentId: number;
    teacherId: number;
    time: Date | null;
    regTimePersian: string;
    taskId: string | null;
    homeWorkId: string;

    note: string;

    studentFullName: number;
    get accessLevel(): AssessMeasureLevel {
        return AssessmentLevels.find(x => x.value == this.level);
    }
}

export class ScoreAssessmentModel extends AssessmentModel {

    progerssStep?: number;
    progerssFlag?: number;
}

export class AssessParamterModel {
    id: number;
    title: string;
    level: number;
    lessonId?: number;
    rank: number;
    type: AssessmentParamType
}


export enum AssessmentParamType {
    Knowledge = 1,
    Skill,
    Attitude
}

export class StudentAssessParamModel extends AssessParamterModel {

    avgValue: number;
}


export interface AssessMeasureLevel {
    title: string;
    shortTitle: string;
    value: number;
    color: string;
    bdColor: string;
    ionColor: string;
    ionIcon: string;
}


export const AssessmentLevels: AssessMeasureLevel[] = [

]