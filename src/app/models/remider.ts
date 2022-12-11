export interface Reminder {
    id: string;
    lessonId?: number;
    subLessonId?: number;
    note: string;
    type: ReminderType;
}

export enum ReminderType {
    Score = 1,
    Reminder,
    StudentReminder,
    Notes,
    StudentNotes
}

export interface StudentReminder extends Reminder {
    studentId: number;
    taskId: string;
    remindTime: Date;
}

export interface LessonReminder extends Reminder {
    taskId: string;
    remindTime: Date;
}


export interface Score extends Reminder {

    studentId: number;
    taskId: string;
    subjectParameterId?: number;
    positiveNegetive: boolean;
}

export interface LessonNotes extends Reminder {
    taskId: string;
}

export interface StudentNotes extends Reminder {
    studentId: number;
    taskId: string;
}