import { Component, Input, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";

import { interval, Observable, Subject } from "rxjs";
import { map, takeUntil, takeWhile } from "rxjs/operators";
import { UserModel } from "src/app/core/models/user";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: "app-verification-code",
  templateUrl: "./verification-code.component.html",
  styleUrls: ["./verification-code.component.scss"],
})
export class VerificationCodeComponent implements OnInit {
  countDown = 90;
  code = "";
  codeInvalide = false;
  constructor(private authService: AuthService, private router: Router) {
    interval(1000).pipe(
      map((x) => { if (this.countDown > 0) this.countDown -= 1; })
    ).subscribe();
  }
  user!: UserModel;
  ngOnInit() {
    this.user = this.authService.user;

  }

  resendCode() {
    this.countDown = 120;
  }

  register() {
    console.log(this.code);
    if (this.code == "12345" || this.code == "1234") {
      this.authService.signIn(this.authService.user);
      this.router.navigateByUrl("/main/home");
    }
    else {
      this.codeInvalide = true;
    }
  }

  toHHMMSS = (secs): string => {
    var sec_num = parseInt(secs, 10)
    var hours = Math.floor(sec_num / 3600)
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60

    return [hours, minutes, seconds]
      .map(v => v < 10 ? "0" + v : v)
      .filter((v, i) => v !== "00" || i > 0)
      .join(":")
  }
}
