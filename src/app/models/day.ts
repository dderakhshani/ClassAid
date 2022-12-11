export class DateDay {
    no: number;
    dayName: string;
    symbol: string;
    date: Date;
}

export class Ring {
    id: number;
    ringId: number;
    title: string;
    startTime: string;
    endTime: string;
}

export const Days = [
    <DateDay>{ no: 0, dayName: 'شنبه', symbol: 'شنبه' },
    <DateDay>{ no: 1, dayName: 'یکشنبه', symbol: 'یک' },
    <DateDay>{ no: 2, dayName: 'دوشنبه', symbol: 'دو' },
    <DateDay>{ no: 3, dayName: 'سه شنبه', symbol: 'سه' },
    <DateDay>{ no: 4, dayName: 'چهارشنبه', symbol: 'چهار' },
    <DateDay>{ no: 5, dayName: 'پنجشنبه', symbol: 'پنج' },
    <DateDay>{ no: 6, dayName: 'جمعه', symbol: 'جمعه' },
];