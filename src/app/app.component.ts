import { ClassService } from './api/class.service';
import { GlobalService } from 'src/app/services/global.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentsService } from './api/students.service';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { AuthService } from './core/services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
    @ViewChild(IonRouterOutlet, { static: true }) routerOutlet: IonRouterOutlet;

    constructor(private globalService: GlobalService,
        private platform: Platform,
        private authService: AuthService,
        private classService: ClassService) {

    }

    ngOnInit() {
        const user = this.authService.getProfile();
        this.authService.user$.subscribe(u => {
            if (u) {
                this.globalService.teacherId = u.id;
                this.classService.getClassesByTeacherId(this.globalService.teacherId).then(data => {
                    this.globalService.selectedClass = data[0];//will load students and rings automatically

                });
            }
        })



        this.platform.backButton.subscribe(() => {
            if (!this.routerOutlet.canGoBack())
                navigator['app'].exitApp();
        });
    }
}
