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
import { StatReportModel } from 'src/app/models/stats-serie';

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
    avg: number;
    currentLevel: AssessMeasureLevel;
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




    }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.globalService.ready$.subscribe(ready => {
            if (ready) {

                this.studentsService.getStudentsById(this.studentIdParam).then(x => {
                    this.student = x;
                });



                //Can read book and lesson from CurrentSession but there are some assessment without class session
                this.lessonService.getLessonById(this.lessonIdParam).then(l => {
                    this.lesson = l;
                    this.lessonService.getLessonById(l.parentId).then(b => {
                        this.book = b;
                        this.paramters = this.globalService.cloneArray(this.assessmentService.getLessonParametersSync(b.id));

                        this.assessmentService.getParamterAssessment(this.globalService.selectedClass.id, this.studentIdParam, this.book.id).then(data => {
                            this.initChart(data);
                            const sum = data.map(x => x.value).reduce((old, current) => old + current);
                            this.avg = sum / data.length;
                            this.currentLevel = this.globalService.findLevelByValue(this.avg);
                        });
                    });
                });
            }
        })
    }

    initChart(assesmentParams: StatReportModel[]) {
        const series = assesmentParams.map(x => ({
            name: x.title, value: x.value,
            itemStyle: {
                color: this.globalService.findLevelByValue(x.value).color
            }
        }))
        this.chartOptions = this.chartService.createSingleSerieChart(
            series,
            { name: 'وضعیت هر پارامتر', type: 'bar' }
        )
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
        let assessments: AssessmentModel[] = [];
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
            if (this.globalService.currentSession)
                this.globalService.currentSession.assessments.push(...assessments);
            this.student.hasAssessment = true;
            this.location.back();
        },
            err => {
                loading.dismiss();
            });

    }
}
