import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IFormGroup, IFormBuilder } from "@rxweb/types";
import { Router } from '@angular/router';
import { SignUpModel, UserModel } from '../../core/models/user';
import { AuthService } from '../../core/services/auth.service';
import { ToastController } from '@ionic/angular';

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
    public toastController: ToastController,
    formBuilder: FormBuilder
  ) {
    this.formBuilder = formBuilder;
  }

  ngOnInit() {
    this.form = this.formBuilder.group<SignUpModel>({
      username: [""],
      mobile: ["", [Validators.required, Validators.pattern("^09[0|1|2|3][0-9]{8}$")]],
      fullName: ["", [Validators.required]],
      email: [""],
      agreement: [false, [Validators.required]],
    });
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
    this.authService.user = this.user;
    this.router.navigateByUrl("/verification");
  }
}
