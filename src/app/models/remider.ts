// export interface Reminder {
//     id: string;
//     lessonId?: number;
//     subLessonId?: number;
//     notes:string;
// }

export interface StudentReminder {
    id: string;
    lessonId?: number;
    subLessonId?: number;
    studentId: number;
    taskId: string;
    remindTime: string;
    notes: string;
}

export interface LessonReminder {
    id: string;
    lessonId?: number;
    subLessonId?: number;
    taskId: string;
    remindTime: string;
    notes: string;
}


export interface Score {
    id: string;
    studentId: number;
    lessonId?: number;
    subLessonId?: number;
    taskId: string;
    subjectParameterId?: number;
    positiveNegetive: boolean;
    notes: string;
}


export interface LessonNotes {
    id: string;
    taskId: string;
    lessonId?: number;
    subLessonId?: number;
    notes: string;
}

export interface StudentNotes {
    id: string;
    studentId: number;
    taskId: string;
    lessonId?: number;
    subLessonId?: number;
    notes: string;
}