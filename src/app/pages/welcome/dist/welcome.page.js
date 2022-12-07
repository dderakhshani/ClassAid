"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.WelcomePage = void 0;
var core_1 = require("@angular/core");
var WelcomePage = /** @class */ (function () {
    function WelcomePage(router) {
        this.router = router;
        this.slideOpts = {
            initialSlide: 2,
            speed: 400
        };
    }
    WelcomePage.prototype.ngOnInit = function () {
        localStorage.setItem('isFirstWatched', '1');
    };
    WelcomePage.prototype.openTabs = function () {
        this.router.navigate(["/tabs/home"]);
    };
    WelcomePage = __decorate([
        core_1.Component({
            selector: 'app-welcome',
            templateUrl: './welcome.page.html',
            styleUrls: ['./welcome.page.scss']
        })
    ], WelcomePage);
    return WelcomePage;
}());
exports.WelcomePage = WelcomePage;
