import { AssessMeasureLevel } from './../../models/asses-param';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentService } from 'src/app/api/assessment.service';
import { LessonService } from 'src/app/api/lesson.service';
import { StudentsService } from 'src/app/api/students.service';
import { AssessMeasures, AssessParamModel } from 'src/app/models/asses-param';
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
    paramters: AssessParamModel[] = [];
    assessMeasures = [...AssessMeasures.filter(x => x.value != 0)];
    chartOptions: any;

    constructor(public lessonService: LessonService,
        private studentsService: StudentsService,
        private assessmentService: AssessmentService,
        public globalService: GlobalService,
        private chartService: ChartService,
        private route: ActivatedRoute,
        private router: Router) {

        const lessonId = Number(this.route.snapshot.paramMap.get('lessonId'));
        const studentId = Number(this.route.snapshot.paramMap.get('studentId'));

        this.globalService.ready$.subscribe(ready => {
            if (ready) {
                this.paramters = [...this.assessmentService.getLessonParametersSync(lessonId)];

                this.studentsService.getStudentsById(studentId).then(x => {
                    this.student = x;
                });
            }
        })

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

    selectMeasure(param: AssessParamModel, value: AssessMeasureLevel) {
        if (param.level == value.value) {
            param.level = 0;
        }
        else
            param.level = value.value;
    }

    clear() {

    }

    save() {

    }
}
