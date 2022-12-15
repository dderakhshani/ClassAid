import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { LessonService } from 'src/app/api/lesson.service';
import { ClassSessionModel } from 'src/app/models/class';
import { Lesson } from 'src/app/models/lessons';
import { GlobalService } from 'src/app/services/global.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
    selector: 'app-details',
    templateUrl: './details.page.html',
    styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

    lessons: Lesson[];
    book: Lesson;
    scheduleId?: number;

    constructor(public lessonService: LessonService,
        public globalService: GlobalService,
        private route: ActivatedRoute,
        private alertController: AlertController,
        private router: Router) {
        const bookId = Number(this.route.snapshot.paramMap.get('lessonId'));

        if (this.route.snapshot.paramMap.has('scheduleId'))
            this.scheduleId = Number(this.route.snapshot.paramMap.get('scheduleId'))
        this.globalService.ready$.subscribe(ready => {
            if (ready)
                lessonService.getLessonById(bookId).then(b => {
                    this.book = b;
                    this.lessonService.getLessonsByParentId(this.book.id).then(r => {
                        this.lessons = [...r];
                        this.lessons.forEach(l => {
                            l.sessionsCount = this.globalService.sessions.filter(x => x.subLessonId == l.id).length;
                        })
                    });
                });
        });

    }

    ngOnInit() {

    }

    startClass(lesson: Lesson) {
        const session = <ClassSessionModel>{
            id: uuidv4(),
            lesson: lesson,
            book: this.book,
            lessonId: this.book.id,
            subLessonId: lesson.id,
            startTime: new Date(),
            scheduleTimeId: this.scheduleId
        };
        //TODO: Promise base then navigate
        this.globalService.startClass(session).then((r) => {
            if (this.scheduleId)
                this.router.navigateByUrl(`/tabs/class/${lesson.id}/${this.scheduleId}`);
            else
                this.router.navigateByUrl(`/tabs/class/${lesson.id}`);
        }).catch(async () => {
            const alert = await this.alertController.create({
                header: 'هشدار',
                subHeader: 'نمی توانید کلاس جدیدی را شروع کرد',
                message: 'کلاس قبلی هنوز باز می باشد، می بایست وارد کلاس شده و کلاس را پایان دهید',
                buttons: [
                    {
                        text: 'تایید',
                        role: 'confirm',
                        handler: () => {
                            this.router.navigateByUrl(`/tabs/home`, { replaceUrl: true });
                        },
                    },
                    {
                        text: 'رفتن به کلاس',
                        role: 'confirm',
                        handler: () => {
                            this.router.navigateByUrl(`/tabs/class/0`);
                        },
                    },
                ],
            });

            await alert.present();

        });;


    }

    viewClass(lesson: Lesson) {
        //TODO:
        //Load sessions
        //if there is one redirect instantly
        //if more than one, show select dialog then redirect to selected session
        // this.router.navigateByUrl(`/tabs/reports/class-report/${schedule.session.id}`);
    }

}
