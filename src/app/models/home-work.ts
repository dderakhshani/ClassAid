export interface HomeWorkModel {
    title: string;
    description: string;
    points: number;
    dueTime: Date;
    tags: string[];
    files: string[];
}