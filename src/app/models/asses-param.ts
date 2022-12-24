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
    { title: "ارزشیابی نشده", shortTitle: 'بدون داده', value: 0, color: "#92949c", bdColor: "text-gray", ionColor: "medium", ionIcon: "" },
    { title: "نیاز به تلاش", shortTitle: 'ن.ب.ت', value: 1, color: "#eb445a", bdColor: "text-danger", ionColor: "danger", ionIcon: "alert-circle-outline" },
    { title: "قابل قبول", shortTitle: 'ق.ق', value: 2, color: "#ffc409", bdColor: "text-warning", ionColor: "warning", ionIcon: "caret-back-circle-outline" },
    { title: "خوب", shortTitle: 'خ', value: 3, color: "#4E7DF1", bdColor: "text-primary", ionColor: "secondary", ionIcon: "checkmark-circle-outline" },
    { title: "خیلی خوب", shortTitle: 'خ.خ', value: 4, color: "#2dd36f", bdColor: "text-success", ionColor: "success", ionIcon: "checkmark-done-circle-outline" }
]