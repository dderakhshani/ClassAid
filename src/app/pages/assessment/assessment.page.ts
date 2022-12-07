import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonService } from 'src/app/api/lesson.service';
import { StudentsService } from 'src/app/api/students.service';
import { AssessParam } from 'src/app/models/asses-param';
import { Lesson } from 'src/app/models/lessons';
import { StudentModel } from 'src/app/models/student';
import { ChartService } from 'src/app/services/chart.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
    selector: 'app-assessment',
    templateUrl: './assessment.page.html',
    styleUrls: ['./assessment.page.scss'],
})
export class AssessmentPage implements OnInit {

    lesson: Lesson;
    book: Lesson;
    student: StudentModel;
    paramters: AssessParam[] = [
        { Title: 'با استفاده از کار افزار های مناسب به پرسشها پاسخ می دهد', LessonId: 1 },
        { Title: 'به طور و موثر در جمع سخن می گوید در خواندن متون نثر و شعر توانایی دارد', LessonId: 1 },
        { Title: 'در نقد و تحلیل متن توانایی دارد', LessonId: 1 },
        { Title: 'درباره یک موضوع متنی ساده می نویسد', LessonId: 1 },
        { Title: 'اصول درست نویسی و علائم نگارشی را رعایت میکند', LessonId: 1 }
    ];
    chartOptions: any;

    constructor(public lessonService: LessonService,
        private studentsService: StudentsService,
        public globalService: GlobalService,
        private chartService: ChartService,
        private route: ActivatedRoute,
        private router: Router) {

        const studentId = Number(this.route.snapshot.paramMap.get('studentId'));

        this.studentsService.getStudentsById(studentId).then(x => {
            this.student = x;
        });

        this.chartOptions = this.chartService.createSingleSerieChart(
            [{ name: '1', value: 4, itemStyle: { color: 'green' } },
            { name: '2', value: 2, itemStyle: { color: 'orange' } },
            { name: '3', value: 3, itemStyle: { color: 'blue' } },
            { name: '4', value: 1, itemStyle: { color: 'red' } },
            { name: '5', value: 2, itemStyle: { color: 'orange' } }
            ],
            { name: 'وضعیت هر پارامتر', type: 'bar' }
        )
    }

    ngOnInit() {
    }

}
