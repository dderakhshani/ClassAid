import { StudentsService } from 'src/app/api/students.service';
import { AssessmentService } from 'src/app/api/assessment.service';
import { LessonService } from 'src/app/api/lesson.service';
import { GlobalService } from 'src/app/services/global.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserModel } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { ClassService } from 'src/app/api/class.service';
import { ReminderService } from 'src/app/api/reminder.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

    user!: UserModel;

    constructor(private router: Router,
        private authService: AuthService,
        private globalService: GlobalService,
        public alertController: AlertController) {
    }

    ngOnInit(): void {
        this.user = this.authService.getProfile();
    }

    onSingOut() {
        this.authService.signOut();
        this.globalService.resetData();
        this.router.navigateByUrl("/signin");
    }

    async contactAdmin() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'عدم دسترسی',
            message: 'این گزینه توسط مدیر سیستم کنترل می گردد. برای اصلاح اطلاعات مربوطه با مدیر سیستم تماس حاصل فرمایید',
            buttons: ['تایید']
        });

        await alert.present();

        const { role } = await alert.onDidDismiss();
    }

    async reportBug() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'گزارش خطا ',
            message: 'فعلا تا آماده سازی این صفحه با مدیر سیستم تماس حاصل فرمایید',
            buttons: ['تایید']
        });

        await alert.present();

        const { role } = await alert.onDidDismiss();
    }

    async help() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'راهنمای سیستم ',
            message: 'فعلا تا آماده سازی این صفحه با پشتیبان نرم افزار تماس حاصل فرمایید',
            buttons: ['تایید']
        });

        await alert.present();

        const { role } = await alert.onDidDismiss();
    }

    async support() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: ' پشتیبانی ',
            message: 'فعلا تا آماده سازی این صفحه با پشتیبان نرم افزار تماس حاصل فرمایید',
            buttons: ['تایید']
        });

        await alert.present();

        const { role } = await alert.onDidDismiss();
    }

}
