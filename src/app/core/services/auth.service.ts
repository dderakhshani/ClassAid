import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserModel } from '../models/user';

const STORAGE_PROFILE = 'profile';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  user!: UserModel;

  isAutenticated(): boolean {
    this.user = this.getProfile();
    return this.user != null || this.user != undefined;
  }


  getProfile(): UserModel {
    this.user = JSON.parse(localStorage.getItem(STORAGE_PROFILE));
    return this.user;
  }

  saveProfile(user: UserModel): Boolean {
    return this.signIn(user);
  }

  signIn(user: UserModel): Boolean {
    localStorage.setItem(STORAGE_PROFILE, JSON.stringify(user))
    return true;
  }

  signOut() {
    localStorage.removeItem(STORAGE_PROFILE);
  }


}
