export class AssessmentModel {
    id: string;
    eduParameterId: number;
    eduParameterTitle: string;
    lessonId: number;
    subLessonId: number;
    level: number;
    studentId: number;
    teacherId: number;
    time: Date | null;
    regTimePersian: string;
    taskId: string | null;
    homeWorkId: number;

    note: string;
}

export interface ScoreAssessmentModel extends AssessmentModel {

    progerssStep?: number;
    progerssFlag?: number;
}

export class AssessParamModel {
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

export class StudentAssessParamModel extends AssessParamModel {

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
    { title: "ارزشیابی ثبت نشده", shortTitle: 'بدون داده', value: 0, color: "", bdColor: "", ionColor: "", ionIcon: "" },
    { title: "نیاز به تلاش", shortTitle: 'ن.ب.ت', value: 1, color: "", bdColor: "text-danger", ionColor: "danger", ionIcon: "alert-circle-outline" },
    { title: "قابل قبول", shortTitle: 'ق.ق', value: 2, color: "", bdColor: "text-warning", ionColor: "warning", ionIcon: "caret-back-circle-outline" },
    { title: "خوب", shortTitle: 'خ', value: 3, color: "", bdColor: "text-primary", ionColor: "secondary", ionIcon: "checkmark-circle-outline" },
    { title: "خیلی خوب", shortTitle: 'خ.خ', value: 4, color: "", bdColor: "text-success", ionColor: "success", ionIcon: "checkmark-done-circle-outline" }
]