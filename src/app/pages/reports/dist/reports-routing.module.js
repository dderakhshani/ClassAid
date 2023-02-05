"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ReportsPageRoutingModule = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var reports_page_1 = require("./reports.page");
var routes = [
    {
        path: '',
        component: reports_page_1.ReportsPage
    },
    {
        path: 'attendance-report',
        loadChildren: function () { return Promise.resolve().then(function () { return require('./attendance-report/attendance-report.module'); }).then(function (m) { return m.AttendanceReportPageModule; }); }
    },
    {
        path: 'student-profile',
        loadChildren: function () { return Promise.resolve().then(function () { return require('./student-profile/student-profile.module'); }).then(function (m) { return m.StudentProfilePageModule; }); }
    },
    {
        path: 'assessments',
        loadChildren: function () { return Promise.resolve().then(function () { return require('./assessment-report/assessment-report.module'); }).then(function (m) { return m.AssessmentReportPageModule; }); }
    },
    {
        path: 'sessions',
        loadChildren: function () { return Promise.resolve().then(function () { return require('./sessions-report/sessions-report.module'); }).then(function (m) { return m.SessionsReportPageModule; }); }
    },
    {
        path: 'reminders-report',
        loadChildren: function () { return Promise.resolve().then(function () { return require('./reminders-report/reminders-report.module'); }).then(function (m) { return m.RemindersReportPageModule; }); }
    },
    {
        path: 'homeworks-report',
        loadChildren: function () { return Promise.resolve().then(function () { return require('./homeworks-report/homeworks-report.module'); }).then(function (m) { return m.HomeworksReportPageModule; }); }
    },
    {
        path: 'class-report',
        loadChildren: function () { return Promise.resolve().then(function () { return require('./class-report/class-report.module'); }).then(function (m) { return m.ClassReportPageModule; }); }
    },
    {
        path: 'today-stories',
        loadChildren: function () { return Promise.resolve().then(function () { return require('./today-stories/today-stories.module'); }).then(function (m) { return m.TodayStoriesPageModule; }); }
    }
];
var ReportsPageRoutingModule = /** @class */ (function () {
    function ReportsPageRoutingModule() {
    }
    ReportsPageRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forChild(routes)],
            exports: [router_1.RouterModule]
        })
    ], ReportsPageRoutingModule);
    return ReportsPageRoutingModule;
}());
exports.ReportsPageRoutingModule = ReportsPageRoutingModule;
