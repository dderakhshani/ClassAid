
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

const BOOKMARK_STORAGE = "k2_bookmarks";
const CART_STORAGE = "k2_cart";
@Injectable({
    providedIn: 'root'
})
export class StorageService {


    constructor(public platform: Platform,) { }

    saveStorage(storage: string, value: string) {
        localStorage.setItem(storage, value);
    }

    loadStorage(storage: string) {

        return localStorage.getItem(storage);
    }


}
