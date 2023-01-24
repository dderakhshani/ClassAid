import { ClassService } from './api/class.service';
import { GlobalService } from 'src/app/services/global.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentsService } from './api/students.service';
import { IonRouterOutlet, LoadingController, Platform } from '@ionic/angular';
import { AuthService } from './core/services/auth.service';
import { async, combineLatest } from 'rxjs';
import { Location } from '@angular/common'
@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
    @ViewChild(IonRouterOutlet, { static: true }) routerOutlet: IonRouterOutlet;

    constructor(private globalService: GlobalService,
        private loadingCtrl: LoadingController,
        private platform: Platform,
        private authService: AuthService,
        private location: Location,
        private classService: ClassService) {

    }

    async ngOnInit() {
        const loading = await this.loadingCtrl.create({ message: 'در حال بارگزاری داده', });
        loading.present();
        const user = this.authService.getProfile();

        combineLatest(this.globalService.classSessions$, this.globalService.ready$).subscribe(([sessions, ready]) => {
            if (ready)
                loading.dismiss();
        });
        this.authService.user$.subscribe(async u => {
            if (u) {

                this.globalService.teacherId = u.id;
                this.classService.getClassesByTeacherId(this.globalService.teacherId).then(data => {
                    this.globalService.selectedClass = data[0];//will load students and rings automatically
                });
            }
        })
        this.platform.backButton.subscribe(() => {
            if (window.history.length == 0)
                navigator['app'].exitApp();
        });
    }
}
