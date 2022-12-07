import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserModel } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

    user!: UserModel;

    constructor(private router: Router,
        private authService: AuthService,
        public alertController: AlertController) {
    }

    ngOnInit(): void {
        this.user = this.authService.getProfile();
    }

    onSingOut() {
        this.authService.signOut();
        this.router.navigateByUrl("/signup");
    }

    async reportBug() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'گزارش خطا ',
            message: 'به صفحه گزارش خطا بعد از تکمیل پروژه منتقل خواهی شد',
            buttons: ['تایید']
        });

        await alert.present();

        const { role } = await alert.onDidDismiss();
    }

    async help() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'راهنمای سیستم ',
            message: 'به صفحه راهنمای سیستم بعد از تکمیل پروژه منتقل خواهی شد',
            buttons: ['تایید']
        });

        await alert.present();

        const { role } = await alert.onDidDismiss();
    }

    async support() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: ' پشتیبانی ',
            message: 'به صفحه پشتیبانی سیستم بعد از تکمیل پروژه منتقل خواهی شد',
            buttons: ['تایید']
        });

        await alert.present();

        const { role } = await alert.onDidDismiss();
    }

}
