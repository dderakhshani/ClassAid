"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ComponentsModule = void 0;
var schedule_item_component_1 = require("./schedule-item/schedule-item.component");
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var angular_1 = require("@ionic/angular");
var timeline_component_1 = require("./timeline/timeline.component");
var ngx_echarts_1 = require("ngx-echarts");
var ComponentsModule = /** @class */ (function () {
    function ComponentsModule() {
    }
    ComponentsModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                angular_1.IonicModule,
                ngx_echarts_1.NgxEchartsModule.forRoot({
                    echarts: function () { return Promise.resolve().then(function () { return require('echarts'); }); }
                }),
            ],
            declarations: [timeline_component_1.TimelineComponent, schedule_item_component_1.ScheduleItemComponent],
            exports: [timeline_component_1.TimelineComponent, schedule_item_component_1.ScheduleItemComponent]
        })
    ], ComponentsModule);
    return ComponentsModule;
}());
exports.ComponentsModule = ComponentsModule;
