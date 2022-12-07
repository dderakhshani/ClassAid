import { Component, Input, OnInit } from '@angular/core';
import { DateDay } from 'src/app/models/day';

@Component({
    selector: 'app-reminder',
    templateUrl: './reminder.component.html',
    styleUrls: ['./reminder.component.scss'],
})
export class ReminderComponent implements OnInit {

    dateType: string = "next";

    @Input()
    modal: any;


    days: DateDay[] = [
        <DateDay>{ no: 1, dayName: 'شنبه', symbol: 'شنبه', date: new Date() },
        <DateDay>{ no: 2, dayName: 'یکشنبه', symbol: 'یک', date: new Date() },
        <DateDay>{ no: 3, dayName: 'دوشنبه', symbol: 'دو', date: new Date() },
        <DateDay>{ no: 4, dayName: 'سه شنبه', symbol: 'سه', date: new Date() },
        <DateDay>{ no: 5, dayName: 'چهارشنبه', symbol: 'چهار', date: new Date() },
        <DateDay>{ no: 6, dayName: 'پنجشنبه', symbol: 'پنج', date: new Date() },
    ];

    selectedDay: DateDay;

    constructor() { }

    ngOnInit() { }

    save() {
        this.modal.dismiss();
    }

}
