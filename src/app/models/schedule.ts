import { ClassModel } from './class';
import { Lesson } from './lessons';
import { DateDay } from 'src/app/models/day';
import { Ring } from './day';
export class ScheduleModel {
    id: number;
    classId: number;
    scheduleTimes: ScheduleTimeModel[];

    class?: ClassModel;
}

export class ScheduleTimeModel {

    dayNo: number;
    ringId: number;
    lessonId: number

    lesson?: Lesson;
    ring: Ring;
}