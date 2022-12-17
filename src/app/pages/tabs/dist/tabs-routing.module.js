"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TabsPageRoutingModule = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var tabs_page_1 = require("./tabs.page");
var routes = [
    {
        path: '',
        component: tabs_page_1.TabsPage,
        children: [
            {
                path: 'home',
                loadChildren: function () { return Promise.resolve().then(function () { return require('../home/home.module'); }).then(function (m) { return m.HomeModule; }); }
            },
            {
                path: 'profile',
                loadChildren: function () { return Promise.resolve().then(function () { return require('../profile/profile.module'); }).then(function (m) { return m.ProfilePageModule; }); }
            },
            {
                path: 'schedule',
                loadChildren: function () { return Promise.resolve().then(function () { return require('../schedule/schedule.module'); }).then(function (m) { return m.SchedulePageModule; }); }
            },
            {
                path: 'reports',
                loadChildren: function () { return Promise.resolve().then(function () { return require('../reports/reports.module'); }).then(function (m) { return m.ReportsPageModule; }); }
            },
            {
                path: 'class',
                loadChildren: function () { return Promise.resolve().then(function () { return require('../class/class.module'); }).then(function (m) { return m.ClassPageModule; }); }
            },
            {
                path: 'lessons',
                loadChildren: function () { return Promise.resolve().then(function () { return require('../lessons/lessons.module'); }).then(function (m) { return m.LessonsPageModule; }); }
            },
            {
                path: 'assessment',
                loadChildren: function () { return Promise.resolve().then(function () { return require('../assessment/assessment.module'); }).then(function (m) { return m.AssessmentPageModule; }); }
            },
            {
                path: 'home-work/:sessionId',
                loadChildren: function () { return Promise.resolve().then(function () { return require('../home-work/home-work.module'); }).then(function (m) { return m.HomeWorkPageModule; }); }
            },
            {
                path: '',
                redirectTo: '/tabs/home',
                pathMatch: 'full'
            }
        ]
    }
];
var TabsPageRoutingModule = /** @class */ (function () {
    function TabsPageRoutingModule() {
    }
    TabsPageRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forChild(routes)]
        })
    ], TabsPageRoutingModule);
    return TabsPageRoutingModule;
}());
exports.TabsPageRoutingModule = TabsPageRoutingModule;
