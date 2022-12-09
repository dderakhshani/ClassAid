"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.ScheduleItemComponent = void 0;
var core_1 = require("@angular/core");
var ScheduleItemComponent = /** @class */ (function () {
    function ScheduleItemComponent(chartService, router, alertController, globalService) {
        this.chartService = chartService;
        this.router = router;
        this.alertController = alertController;
        this.globalService = globalService;
    }
    ScheduleItemComponent.prototype.ngOnInit = function () { };
    ScheduleItemComponent.prototype.lessonChartOptions = function (schedule) {
        var _a;
        return this.chartService.createPieGaugeChart((_a = schedule.lesson) === null || _a === void 0 ? void 0 : _a.sessionsCount, 0, 100, "جلسه");
    };
    ScheduleItemComponent.prototype.openClass = function (schedule) {
        var _a;
        if ((_a = schedule.session) === null || _a === void 0 ? void 0 : _a.endTime) {
            //TODO: Open Report class
        }
        else
            this.router.navigateByUrl("/tabs/class/0");
    };
    ScheduleItemComponent.prototype.start = function (schedule) {
        return __awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.globalService.currentClassTask) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.alertController.create({
                                header: 'هشدار',
                                subHeader: 'نمی توانید کلاس جدیدی را شروع کرد',
                                message: 'کلاس قبلی هنوز باز می باشد، می بایست وارد کلاس شده و کلاس را پایان دهید',
                                buttons: [
                                    {
                                        text: 'تایید',
                                        role: 'cancel',
                                        handler: function () {
                                        }
                                    },
                                    {
                                        text: 'رفتن به کلاس',
                                        role: 'confirm',
                                        handler: function () {
                                            _this.router.navigateByUrl("/tabs/class/0");
                                        }
                                    },
                                ]
                            })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                    case 3:
                        this.router.navigateByUrl("/lessons/details/" + schedule.lessonId + "/" + schedule.id);
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        core_1.Input()
    ], ScheduleItemComponent.prototype, "schedule");
    ScheduleItemComponent = __decorate([
        core_1.Component({
            selector: 'app-schedule-item',
            templateUrl: './schedule-item.component.html',
            styleUrls: ['./schedule-item.component.scss']
        })
    ], ScheduleItemComponent);
    return ScheduleItemComponent;
}());
exports.ScheduleItemComponent = ScheduleItemComponent;
