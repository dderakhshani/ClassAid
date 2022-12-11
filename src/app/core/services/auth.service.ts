import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserModel } from '../models/user';
import { HttpService } from './http.service';

const STORAGE_PROFILE = 'CLASSAID_PROFILE';
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private httpService: HttpService) { }
    user!: UserModel;

    isAutenticated(): boolean {
        this.user = this.getProfile();
        return this.user != null || this.user != undefined;
    }


    getProfile(): UserModel {
        if(this.user)
        return this.user;
        this.user = JSON.parse(localStorage.getItem(STORAGE_PROFILE));
        return this.user;
    }

    saveProfile(user: UserModel) {
        localStorage.setItem(STORAGE_PROFILE, JSON.stringify(user))
    }

    signIn(user: UserModel): Promise<UserModel> {
        return new Promise(resolve => {
            this.httpService.http.postJsonData<UserModel>(user, `auth/Login`).then(data => {
                this.user = data;
                this.saveProfile(data);
                return resolve(data);
            });
        });

    }

    signOut() {
        this.user = null;
        localStorage.removeItem(STORAGE_PROFILE);
    }


}
