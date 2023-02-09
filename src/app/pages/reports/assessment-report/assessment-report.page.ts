import { StudentReminder } from './../../../models/remider';
import { Component, OnInit } from '@angular/core';
import { AssessmentService } from 'src/app/api/assessment.service';
import { LessonService } from 'src/app/api/lesson.service';
import { StatReportModel } from 'src/app/models/stats-serie';
import { ChartService } from 'src/app/services/chart.service';
import { GlobalService } from 'src/app/services/global.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-assessment-report',
    templateUrl: './assessment-report.page.html',
    styleUrls: ['./assessment-report.page.scss'],
})
export class AssessmentReportPage implements OnInit {
    imageUrl = environment.imageUrl + '/';

    assessDisplayMode = 'default';
    segment = 0;

    assessments: StatReportModel[] = [];
    subParamterAssessments: StatReportModel[];
    assessChartOptions: any;
    gauesChartOptions: any[] = [];
    historyChartOptions: any;
    bookName = "";

    constructor(private chartService: ChartService,
        public globalService: GlobalService,
        private lessonService: LessonService,
        private assessmentService: AssessmentService,) { }

    ngOnInit() {
        this.globalService.ready$.subscribe(ready => {
            if (ready) {
                this.assessmentService.assessmentReport(this.globalService.selectedClass.id, 0).then(data => {

                    data.forEach(item => {
                        item.color = this.globalService.findLevelByValue(item.value).ionColor;
                        this.gauesChartOptions.push(this.chartService.createGaugeChart(item.value, 1, 4, ""));
                    });
                    this.assessments = data;

                    this.initAssesstChartOptions();

                });
            }
        })
    }

    initAssesstChartOptions() {

        const series = this.assessments.map(x => ({
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

    onAssessClick(item: StatReportModel) {
        this.bookName = item.title;
        this.loadSubParamterAssessment(item.id);
    }
    onBarCLick(params: any) {
        const ass = this.assessments[params.dataIndex];
        this.loadSubParamterAssessment(ass.id);

    }

    backAssessment() {
        this.subParamterAssessments = undefined;
        this.initAssesstChartOptions();
    }

    loadSubParamterAssessment(bookId: number) {
        if (this.subParamterAssessments)
            return;

        this.assessmentService.getAssessmentHistory(this.globalService.selectedClass.id, 0, bookId).then(data => {

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

        this.assessmentService.getParamterAssessment(this.globalService.selectedClass.id, 0, bookId).then(data => {
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

    gaugeOptions(assess: StatReportModel) {
        return this.gauesChartOptions[this.assessments.indexOf(assess)];
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


    segmentChanged(value: Event) {

    }

}
