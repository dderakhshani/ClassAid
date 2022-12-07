import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

  user!: UserModel;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.user = this.authService.getProfile();
  }

  saveProfile() {
    this.authService.saveProfile(this.user);

  }
}
