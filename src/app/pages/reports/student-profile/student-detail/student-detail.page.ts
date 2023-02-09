import { StatReportModel } from 'src/app/models/stats-serie';
import { AssessmentService } from 'src/app/api/assessment.service';
import { LessonService } from './../../../../api/lesson.service';
import { StatsSerie } from './../../../../models/stats-serie';
import { StudentProfileModel } from './../../../../models/student';
import { StudentModel } from 'src/app/models/student';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ChartService } from 'src/app/services/chart.service';
import { StudentsService } from 'src/app/api/students.service';
import { GlobalService } from 'src/app/services/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Note, Reminder } from 'src/app/models/remider';
import { Share } from '@capacitor/share';
import { ActionSheetController } from '@ionic/angular';

@Component({
    selector: 'app-student-detail',
    templateUrl: './student-detail.page.html',
    styleUrls: ['./student-detail.page.scss'],
})
export class StudentDetailPage implements OnInit {
    imageUrl = environment.imageUrl + '/';
    resourcesUrl = environment.apiUrl + '/resources/';
    studentModel = StudentModel;
    colors = ["primary", "danger", "success", "secondary", "warning", "tertiary", "medium"];

    student: StudentProfileModel;
    studentIdParam: number;

    assessDisplayMode = 'default';
    scoreDisplayMode = 'default';

    subParamterAssessments: StatReportModel[];
    assessChartOptions: any;
    scoreChartOptions: any;
    historyChartOptions: any;
    attendanceChartOptions: any;
    healthChartOptions: any;

    healthIssues: { title: string, icon: string }[] = [];

    scoreExpanded = false;
    notes_expanded = false;

    constructor(private chartService: ChartService,
        public studentsService: StudentsService,
        public globalService: GlobalService,
        private lessonService: LessonService,
        private assessmentService: AssessmentService,
        private route: ActivatedRoute,
        private actionSheetCtrl: ActionSheetController,
        private router: Router) {
        this.studentIdParam = Number(this.route.snapshot.paramMap.get('studentId'));

    }

    ngOnInit() {
        this.globalService.ready$.subscribe(ready => {
            if (ready) {
                this.studentsService.getStudentProfile(this.studentIdParam).then(x => {
                    this.student = x;
                    this.student.avgAssessmentLevel = this.globalService.findLevelByValue(this.student.avgAssessment);
                    this.student.accAssessments.forEach(item => {
                        item.color = this.globalService.findLevelByValue(this.student.avgAssessment).ionColor;
                    });
                    this.initAssesstChartOptions();
                    this.initScoreChartOptions();

                    this.healthChartOptions = this.chartService.createDoubleSeriesChart([
                        <StatsSerie>{ name: '1401/07/25', value: 140 },
                        <StatsSerie>{ name: '1401/09/20', value: 142 },
                        <StatsSerie>{ name: '1401/11/27', value: 143 }
                    ], [
                        <StatsSerie>{ name: '1401/07/25', value: 40 },
                        <StatsSerie>{ name: '1401/09/20', value: 42 },
                        <StatsSerie>{ name: '1401/11/27', value: 42 }
                    ], { name: 'قد', type: 'line' }, { name: 'وزن', type: 'line' },
                        {
                            data: [{ yAxis: 135, name: 'Avg' }]
                        },
                        {
                            data: [{ yAxis: 40, name: 'Avg' }]
                        })
                });
            }
        })
    }


    initAssesstChartOptions() {
        this.attendanceChartOptions = this.chartService.createPieGaugeChart(this.student.attendancePercent, 0, 100, "%");
        const series = this.student.accAssessments.map(x => ({
            name: x.title, value: x.value, valueLabel: this.globalService.findLevelByValue(x.value).shortTitle,
            itemStyle: {
                color: this.globalService.findLevelByValue(x.value).color
            }
        }));
        const colors = series.map(x => this.globalService.findLevelByValue(x.value).color);
        this.assessChartOptions = this.chartService.singleSeriesStackChart(
            series,
            { name: 'ارزشیابی درسی', type: 'bar' }, colors
        );

    }

    initScoreChartOptions() {

        const series2 = this.student.accScores.map(x => (<StatsSerie>{
            name: x.title, value: x.value
        }))
        this.scoreChartOptions = this.chartService.singleSeriesStackChart(
            series2,
            { name: 'نمودار توانمندی ها', type: 'bar' }
        )
    }

    onAssessClick(item: StatReportModel) {
        this.loadSubParamterAssessment(item.id);
    }
    onBarCLick(params: any) {
        const ass = this.student.accAssessments[params.dataIndex];
        this.loadSubParamterAssessment(ass.id);

    }

    backAssessment() {
        this.subParamterAssessments = undefined;
        this.initAssesstChartOptions();
    }

    loadSubParamterAssessment(bookId: number) {
        if (this.subParamterAssessments)
            return;

        this.assessmentService.getAssessmentHistory(this.globalService.selectedClass.id, this.studentIdParam, bookId).then(data => {

            const series = data.map(x => ({
                name: x.title, value: x.value,
                itemStyle: {
                    color: this.globalService.findLevelByValue(x.value).color
                }
            }));

            const newOptions = this.chartService.createSingleSerieChart(
                series,
                { name: '  ', type: 'line' }
            );
            this.historyChartOptions = newOptions;
        });

        this.assessmentService.getParamterAssessment(this.globalService.selectedClass.id, this.studentIdParam, bookId).then(data => {
            this.subParamterAssessments = data;

            const series = data.map(x => ({
                name: x.title, value: x.value,
                itemStyle: {
                    color: this.globalService.findLevelByValue(x.value).color
                }
            }));

            const newOptions = this.chartService.singleSeriesStackChart(
                series,
                { name: 'وضعیت هر پارامتر', type: 'bar' }
            );
            this.assessChartOptions = newOptions;
        });
    }

    getAccessLevel(value: number) {
        return this.globalService.findLevelByValue(value);
    }

    getProgressClass(value: number) {
        if (value > 3)
            return 'green';
        else if (value > 3)
            return 'blue';
        else if (value > 3)
            return 'yellow';
        else
            return 'red';
    }

    async selectHealthIssue() {
        const actionSheet = await this.actionSheetCtrl.create({
            header: 'انتخاب ',
            buttons: [
                {
                    text: 'مشکل بینایی',
                    role: 'destructive',
                    icon: 'eye-outline',
                    data: {
                        title: 'مشکل بینایی',
                        icon: 'eye-outline',
                    },
                },
                {
                    text: 'مشکل شنوایی',
                    icon: 'ear-outline',
                    data: {
                        title: 'مشکل شنوایی',
                        icon: 'eye-outline',
                    },
                },
                {
                    text: 'مشکل حرکتی دست راست',
                    icon: 'hand-left-outline',
                    data: {
                        title: 'مشکل حرکتی دست راست',
                        icon: 'hand-left-outline',
                    },
                },
                {
                    text: 'مشکل حرکتی دست چپ',
                    icon: 'hand-right-outline',
                    data: {
                        title: 'مشکل حرکتی دست چپ',
                        icon: 'hand-right-outline',
                    },
                },
                {
                    text: 'لغو',
                    role: 'cancel',
                },
            ],
        });

        await actionSheet.present();

        const result = await actionSheet.onDidDismiss();
        if (result.data) {
            this.healthIssues.push(result.data);
        }


    }


    remove_notes(reminder: Reminder) {

    }

    async share_notes(note: Note) {
        let title = note.isReport ? 'گزارش ' : 'یادداشت ';

        title += this.student.fullName + ' ';
        title += this.lessonService.getLessonByIdSynce(note.lessonId).name;


        await Share.share({
            title: title,
            text: note.note,
            url: environment.imageUrl + '/' + note.images[0],
            dialogTitle: 'اشتراک گزارش',
        });



    }


    getScale(index: number, data: any[], expanded: boolean) {
        if (expanded)
            return 1;
        else
            return 1 - ((data.length - 1) - index) * 0.05;
    }


}
