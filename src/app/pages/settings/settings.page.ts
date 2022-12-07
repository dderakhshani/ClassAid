import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { BaseClass } from '../../core/bases/base';
import { UserModel } from '../../core/models/user';
import { AuthService } from '../../core/services/auth.service';
import { MessageService } from '../../core/services/message.service';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})

export class SettingsPage extends BaseClass implements OnInit {



  constructor() {
    super();
  }

  ngOnInit(): void {

  }

}
