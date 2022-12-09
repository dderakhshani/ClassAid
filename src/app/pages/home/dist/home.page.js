"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HomePage = void 0;
var lessons_1 = require("src/app/models/lessons");
var student_1 = require("./../../models/student");
var core_1 = require("@angular/core");
var HomePage = /** @class */ (function () {
    function HomePage(router, studentsService, scheduleService, platform, chartService, globalService, reminderService, lessonService) {
        this.router = router;
        this.studentsService = studentsService;
        this.scheduleService = scheduleService;
        this.platform = platform;
        this.chartService = chartService;
        this.globalService = globalService;
        this.reminderService = reminderService;
        this.lessonService = lessonService;
        this.studentModel = student_1.StudentModel;
        this.lesson = lessons_1.Lesson;
        this.slideOpts = {
            initialSlide: 0,
            speed: 350,
            effect: 'flip',
            autoplay: true
        };
        this.viewMode = "dashboard";
        this.absentStudents = [];
        this.todayShedules = [];
        var d = new Date();
        var options = { dateStyle: 'full' };
        this.dateName = new Intl.DateTimeFormat('fa-IR', options).format(d);
        //alert(this.platform.is('mobileweb'));
    }
    HomePage.prototype.ngOnInit = function () {
        var _this = this;
        this.todayDay = this.globalService.todayDay;
        this.globalService.ready$.subscribe(function (ready) {
            if (ready) {
                _this.todayShedules = _this.globalService.todayShedules;
                _this.lessonService.getLessonById(1185).then(function (l) {
                    _this.nextLesson = l;
                    _this.lessonChartOptions = _this.chartService.createPieGaugeChart(10, 0, 100, "ساعت");
                });
            }
        });
        this.studentsService.students$.subscribe(function (students) {
            _this.absentStudents = students.filter(function (x) { return !x.present; });
        });
    };
    HomePage.prototype.attendance = function () {
        this.router.navigateByUrl("/tabs/home/attendance");
    };
    HomePage = __decorate([
        core_1.Component({
            selector: 'app-home',
            templateUrl: 'home.page.html',
            styleUrls: ['home.page.scss']
        })
    ], HomePage);
    return HomePage;
}());
exports.HomePage = HomePage;
