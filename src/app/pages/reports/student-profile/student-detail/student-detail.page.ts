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

@Component({
    selector: 'app-student-detail',
    templateUrl: './student-detail.page.html',
    styleUrls: ['./student-detail.page.scss'],
})
export class StudentDetailPage implements OnInit {
    imageUrl = environment.imageUrl + '/';
    studentModel = StudentModel;
    colors = ["primary", "danger", "success", "secondary", "warning", "tertiary", "medium"];

    student: StudentProfileModel;
    studentIdParam: number;

    assessDisplayMode = 'default';
    scoreDisplayMode = 'default';

    assessChartOptions: any;
    scoreChartOptions: any;
    attendanceChartOptions: any;

    notes_expanded = false;

    constructor(private chartService: ChartService,
        public studentsService: StudentsService,
        public globalService: GlobalService,
        private lessonService: LessonService,
        private route: ActivatedRoute,
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
                    this.initChartOptions();
                });
            }
        })
    }


    initChartOptions() {
        this.attendanceChartOptions = this.chartService.createPieGaugeChart(this.student.attendancePercent, 0, 100, "%");
        const series = this.student.accAssessments.map(x => ({
            name: x.title, value: x.value,
            itemStyle: {
                color: this.globalService.findLevelByValue(x.value).color
            }
        }))
        this.assessChartOptions = this.chartService.createSingleSerieChart(
            series,
            { name: 'ارزشیابی درسی', type: 'bar' }
        );

        const series2 = this.student.accScores.map(x => (<StatsSerie>{
            name: x.title, value: x.value
        }))
        this.scoreChartOptions = this.chartService.createSingleSerieChart(
            series2,
            { name: 'نمودار توانمندی ها', type: 'bar' },
            false
        )
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
