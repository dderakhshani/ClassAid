import { GlobalService } from './../../services/global.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IFormGroup, IFormBuilder } from "@rxweb/types";
import { Router } from '@angular/router';
import { UserModel } from '../../core/models/user';
import { AuthService } from '../../core/services/auth.service';
import { ToastController } from '@ionic/angular';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.page.html',
    styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

    user: UserModel = <UserModel>{};
    form: IFormGroup<UserModel>;
    formBuilder: IFormBuilder;

    constructor(private router: Router,
        private authService: AuthService,
        private globalService: GlobalService,
        public toastController: ToastController,
        formBuilder: FormBuilder
    ) {
        this.formBuilder = formBuilder;
    }

    ngOnInit() {
        this.form = this.formBuilder.group<UserModel>({
            username: ["", [Validators.required]],
            password: ["", [Validators.required]],
            fullName: [""],
            id: [0],
        });

        // Keyboard.setResizeMode({ mode: KeyboardResize.Ionic });
    }

    hideKey() {

    }

    async signup() {
        if (!this.form.valid) {
            const toast = await this.toastController.create({
                message: 'لطفا تمام فیلد ها رو پر نموده و شرایط را قبول نمایید',
                duration: 3000
            });
            toast.present();
            return;
        }

        this.user = this.form.getRawValue();

        this.authService.signIn(this.user).then(result => {

            this.router.navigateByUrl("/tabs/home", { replaceUrl: true });
        });


    }
}
