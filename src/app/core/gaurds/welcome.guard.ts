import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WelcomeGuard implements CanLoad {

    constructor(private router: Router) { }

    canLoad(route: Route) {
        const isFirstWatched = localStorage.getItem('isFirstWatched')

        if (isFirstWatched) {
            this.router.navigateByUrl('/tabs/home');
            return false;
        }
        else {
            //   this.router.navigateByUrl('/tabs/home');
            return true;
        }
    }


}
