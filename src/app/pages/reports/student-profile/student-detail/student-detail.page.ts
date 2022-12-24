import { StudentProfileModel } from './../../../../models/student';
import { StudentModel } from 'src/app/models/student';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ChartService } from 'src/app/services/chart.service';
import { StudentsService } from 'src/app/api/students.service';
import { GlobalService } from 'src/app/services/global.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-student-detail',
    templateUrl: './student-detail.page.html',
    styleUrls: ['./student-detail.page.scss'],
})
export class StudentDetailPage implements OnInit {
    imageUrl = environment.imageUrl;
    student: StudentProfileModel;
    studentIdParam: number;

    constructor(private chartService: ChartService,
        public studentsService: StudentsService,
        public globalService: GlobalService,
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
                        item.color = this.globalService.findLevelByValue(this.student.avgAssessment).color;
                    })
                });
            }
        })
    }

    attendanceChartOptions(): any {
        return this.chartService.createPieGaugeChart(this.student.attendancePercent, 0, 100, "%");
    }

}
