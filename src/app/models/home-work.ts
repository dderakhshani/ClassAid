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

    static getExtension(url: string) {
        return url.split(".")[1].toUpperCase();
    }

    static isImageFile(url: string) {
        return ['PNG', 'JPG', 'JPEG'].includes(url.toUpperCase());
    }
}