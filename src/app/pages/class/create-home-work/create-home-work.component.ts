import { environment } from './../../../../environments/environment';
import { ClassService } from 'src/app/api/class.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { ClassSessionModel } from 'src/app/models/class';
import { Days } from 'src/app/models/day';
import { HomeWorkModel, IHomeWorkModel } from 'src/app/models/home-work';
import { Lesson } from 'src/app/models/lessons';
import { IFormGroup, IFormBuilder } from '@rxweb/types';
import { v4 as uuidv4 } from 'uuid';
import { ToastController } from '@ionic/angular';

@Component({
    selector: 'app-create-home-work',
    templateUrl: './create-home-work.component.html',
    styleUrls: ['./create-home-work.component.scss'],
})
export class CreateHomeWorkComponent implements OnInit {
    homeWork = HomeWorkModel;
    imageUrl = environment.imageUrl;

    expanded = false;
    @Input()
    modal: any;

    @Input()
    prevItems: HomeWorkModel[];

    @Input()
    classTask: ClassSessionModel;

    @Input()
    lesson: Lesson;

    @Input()
    book: Lesson;


    form: IFormGroup<IHomeWorkModel>;
    formBuilder: IFormBuilder;

    dateType: "next" | 'tommorow' | "exact-date" = "next";
    nextDays: { dayNo: number, dayName: string, date: Date }[] = [];
    selectedDay: any;
    tag = "";
    uploadFiles: string[];
    colors = ["primary", "success", "danger", "secondary", "warning", "tertiary", "medium"];
    fileFilters = "*.*";

    constructor(formBuilder: FormBuilder,
        private classService: ClassService,
        public toastController: ToastController) {

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
        this.form = this.formBuilder.group<IHomeWorkModel>({
            id: [uuidv4()],
            title: ["", [Validators.required]],
            description: ["", [Validators.required]],
            dueTime: [new Date(), [Validators.required]],
            points: [0],
            tags: [[], [Validators.required]],
            files: [[]],
            creatorTaskId: [this.classTask.id],
            lessonId: [this.book.id],
            subLessonId: [this.lesson.id]
        });
    }

    getScale(index: number) {
        if (this.expanded)
            return 1;
        else
            return 1 - ((this.prevItems.length - 1) - index) * 0.05;
    }


    addTag() {
        if (this.tag != '') {
            this.form.get("tags").value.push(this.tag);
            this.tag = "";
        }
    }

    remove(item: HomeWorkModel) {

    }

    removeTag(index: number) {
        this.form.get("tags").value.splice(index, 1);
    }

    async save() {
        if (!this.form.valid) {
            const toast = await this.toastController.create({
                message: 'لطفا تمام فیلد ها را پر نمایید',
                duration: 3000,

            });
            toast.present();
            return;
        }
        const homeWork = this.form.getRawValue() as HomeWorkModel;
        homeWork.files = this.uploadFiles;
        homeWork.dueTime = this.getReminderTime();
        this.classService.addHomeWork(homeWork).then(x => {
            this.classTask.homeWorks = this.classTask.homeWorks ?? [];
            this.classTask.homeWorks.push(homeWork);
            this.modal.dismiss();
        });

    }

    getReminderTime(): Date {
        if (this.dateType == 'exact-date')
            return this.selectedDay.date
        else if (this.dateType == 'tommorow') {
            let d = new Date();
            d.setDate(d.getDate() + 1);
            return d;
        }
        else
            //TODO: Find next lesson time
            return new Date()

    }
}
