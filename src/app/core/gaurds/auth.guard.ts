import { Injectable } from "@angular/core";
import { CanLoad, Route, Router, UrlSegment, UrlTree } from "@angular/router";
import { AuthService } from "../services/auth.service";


@Injectable({
    providedIn: "root",
})
export class AuthGuard implements CanLoad {
    constructor(private authService: AuthService,
        private router: Router) { }
    canLoad(route: Route) {

        if (this.authService.isAutenticated()) {
            //    this.router.navigateByUrl('');
            return true;
        } else {
            this.router.navigateByUrl("/signin");
            return false;
        }
    }

}
