import { Lesson } from './lessons';
import { StudentModel } from './student';
export interface Reminder {
    id: string;
    lessonId?: number;
    subLessonId?: number;
    note: string;
    type: ReminderType;
    remindTime: Date;
    isReport: boolean;
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

    studentFullName: string;
}

export interface LessonReminder extends Reminder {
    taskId: string;

    lesson?: Lesson;
}




export interface Note extends Reminder {
    images: string[];
    tags: string[];
}

export interface LessonNotes extends Note {
    taskId: string;

    book?: Lesson;
    lesson?: Lesson;
}

export interface StudentNotes extends Note {
    studentId: number;
    studentFullName: number;
    taskId: string;
}