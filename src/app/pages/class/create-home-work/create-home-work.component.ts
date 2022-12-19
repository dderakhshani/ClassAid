import { ClassService } from 'src/app/api/class.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { ClassSessionModel } from 'src/app/models/class';
import { Days } from 'src/app/models/day';
import { HomeWorkModel } from 'src/app/models/home-work';
import { Lesson } from 'src/app/models/lessons';
import { IFormGroup, IFormBuilder } from '@rxweb/types';

@Component({
    selector: 'app-create-home-work',
    templateUrl: './create-home-work.component.html',
    styleUrls: ['./create-home-work.component.scss'],
})
export class CreateHomeWorkComponent implements OnInit {

    expanded = false;
    @Input()
    modal: any;

    @Input()
    prevReminders: HomeWorkModel[];

    @Input()
    classTask: ClassSessionModel;

    @Input()
    lesson: Lesson;

    @Input()
    book: Lesson;

    prevItems: HomeWorkModel[];

    form: IFormGroup<HomeWorkModel>;
    formBuilder: IFormBuilder;

    dateType: "next" | 'tommorow' | "exact-date" = "next";
    nextDays: { dayNo: number, dayName: string, date: Date }[] = [];
    selectedDay: any;
    tag = "";
    uploadFiles: string[];
    colors = ["primary", "success", "danger", "secondary", "warning", "tertiary", "medium"];

    constructor(formBuilder: FormBuilder,
        private classService: ClassService) {
        const d = new Date();
        for (let i = 1; i < 15; i++) {
            var date = new Date();
            date.setDate(date.getDate() + i);
            const dateDay = new Intl.DateTimeFormat('en-US-u-ca-persian', { day: 'numeric' }).format(date);

            const dayName = Days[(date.getDay() + 1) % 7].symbol;

            this.nextDays.push({ dayNo: parseInt(dateDay), dayName: dayName, date: date });
        }

        this.formBuilder = formBuilder;


    }

    ngOnInit() {
        this.form = this.formBuilder.group<HomeWorkModel>({
            title: ["", [Validators.required]],
            description: ["", [Validators.required]],
            dueTime: [new Date(), [Validators.required]],
            points: [0],
            tags: [[], [Validators.required]],
            files: [[]]
        });
    }

    getScale(index: number) {
        if (this.expanded)
            return 1;
        else
            return 1 - ((this.prevReminders.length - 1) - index) * 0.05;
    }


    addTag() {
        if (this.tag != '') {
            this.form.get("tags").value.push(this.tag);
            this.tag = "";
        }
    }

    removeTag(index: number) {
        this.form.get("tags").value.splice(index, 1);
    }

    save() {
        const homeWork = this.form.getRawValue();
        this.classService.addHomeWork(homeWork).then(x => {
            // this.classTask.reminders = this.classTask.reminders ?? [];
            // this.classTask.reminders.push(reminder);
            this.modal.dismiss();
        });

    }
}
