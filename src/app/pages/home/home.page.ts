import { Lesson } from './../../models/lessons';
import { StudentModel } from './../../models/student';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentsService } from 'src/app/api/students.service';
import { LessonService } from 'src/app/api/lesson.service';
import { ChartService } from 'src/app/services/chart.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
    slideOpts = {
        initialSlide: 0,
        speed: 350,
        effect: 'flip',
        autoplay: true
    };

    absentStudents: StudentModel[] = [];
    nextLesson: Lesson;
    lessonChartOptions: any;
    dateName: string;
    constructor(private router: Router,
        private studentsService: StudentsService,
        private chartService: ChartService,
        public lessonService: LessonService,
    ) {
        const d = new Date();
        const options: Intl.DateTimeFormatOptions = <Intl.DateTimeFormatOptions>{ dateStyle: 'full' };
        this.dateName = new Intl.DateTimeFormat('fa-IR', options).format(d);
    }
    ngOnInit(): void {
        this.lessonService.allLessons$.subscribe(books => {
            if (this.lessonService.allLessons$.value.length > 0)
                this.lessonService.getLessonById(1185).then(l => {
                    this.nextLesson = l;
                    this.lessonChartOptions = this.chartService.createPieGaugeChart(10, 0, 100, "ساعت");
                });
        });


        this.studentsService.students$.subscribe(students => {
            if (students.length > 0) {
                this.absentStudents = students.filter(x => !x.present);
            }

        });

    }

    attendance() {
        this.router.navigateByUrl(`/tabs/home/attendance`)
    }

}
