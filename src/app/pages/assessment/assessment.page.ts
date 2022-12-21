import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentService } from 'src/app/api/assessment.service';
import { LessonService } from 'src/app/api/lesson.service';
import { StudentsService } from 'src/app/api/students.service';
import { AssessMeasureLevel, AssessmentLevels, AssessmentModel, AssessParamterModel } from 'src/app/models/asses-param';
import { Lesson } from 'src/app/models/lessons';
import { StudentModel } from 'src/app/models/student';
import { ChartService } from 'src/app/services/chart.service';
import { GlobalService } from 'src/app/services/global.service';
import { v4 as uuidv4 } from 'uuid';
import { LoadingController } from '@ionic/angular';

@Component({
    selector: 'app-assessment',
    templateUrl: './assessment.page.html',
    styleUrls: ['./assessment.page.scss'],
})
export class AssessmentPage implements OnInit {

    cardExpanded = false;

    sessionIdParam: string;
    lessonIdParam: number;
    studentIdParam: number;

    lesson: Lesson;
    book: Lesson;

    student: StudentModel;
    paramters: AssessParamterModel[] = [];
    currentLevel: AssessMeasureLevel = AssessmentLevels[2];
    assessLevels = [...AssessmentLevels.filter(x => x.value != 0)];
    chartOptions: any;

    constructor(public lessonService: LessonService,
        private studentsService: StudentsService,
        private assessmentService: AssessmentService,
        public globalService: GlobalService,
        private chartService: ChartService,
        private route: ActivatedRoute,
        private location: Location,
        private loadingCtrl: LoadingController,
        private router: Router) {

        this.sessionIdParam = this.route.snapshot.paramMap.get('sessionId');
        this.lessonIdParam = Number(this.route.snapshot.paramMap.get('lessonId'));
        this.studentIdParam = Number(this.route.snapshot.paramMap.get('studentId'));

        this.globalService.ready$.subscribe(ready => {
            if (ready) {

                this.studentsService.getStudentsById(this.studentIdParam).then(x => {
                    this.student = x;
                });

                //Can read book and lesson from CurrentSession but there are some assessment without class session
                lessonService.getLessonById(this.lessonIdParam).then(l => {
                    this.lesson = l;
                    this.lessonService.getLessonById(l.parentId).then(b => {
                        this.book = b;
                        this.paramters = [...this.assessmentService.getLessonParametersSync(b.id)];

                    });
                });
            }
        })

        this.chartOptions = this.chartService.createSingleSerieChart(
            [{ name: '1', value: 4, itemStyle: { color: '#2cae65' } },
            { name: '2', value: 2, itemStyle: { color: '#ffca22' } },
            { name: '3', value: 3, itemStyle: { color: '#1472fd' } },
            { name: '4', value: 1, itemStyle: { color: '#dd4150' } },
            { name: '5', value: 2, itemStyle: { color: '#ffca22' } }
            ],
            { name: 'وضعیت هر پارامتر', type: 'bar' }
        )
    }

    ngOnInit() {
    }

    selectMeasure(param: AssessParamterModel, value: AssessMeasureLevel) {
        if (param.level == value.value) {
            param.level = 0;
        }
        else
            param.level = value.value;
    }

    clear() {
        this.paramters.forEach(p => {
            p.level = 0;
        });
    }

    async save() {
        let assessments = [];
        this.paramters.forEach(p => {
            if (p.level > 0) {
                const assessModel = <AssessmentModel>{
                    id: uuidv4(),
                    eduParameterId: p.id,
                    level: p.level,
                    teacherId: this.globalService.teacherId,
                    taskId: this.sessionIdParam,
                    studentId: this.studentIdParam,
                    lessonId: this.book.id,
                    subLessonId: this.lesson.id,
                    note: "",
                    regTimePersian: ""
                };

                assessments.push(assessModel);
            }

        });

        const loading = await this.loadingCtrl.create();
        loading.present();

        this.assessmentService.add(assessments).then(result => {
            loading.dismiss();
            this.student.hasAssessment = true;
            this.location.back();
        },
            err => {
                loading.dismiss();
            });

    }
}
