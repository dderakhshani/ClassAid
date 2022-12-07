import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MultiInputComponent } from './core/components/multi-input/multi-input.component';
import { HomeModule } from './pages/home/home.module';
import { SignupPageModule } from './pages/signup/signup.module';
import { WelcomePageModule } from './pages/welcome/welcome.module';
import { HttpClientModule } from '@angular/common/http';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        WelcomePageModule,
        FormsModule,
        SignupPageModule,
        HomeModule,
        HttpClientModule,
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts')
        }),
    ],
    providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        HTTP],
    bootstrap: [AppComponent],
    exports: [WelcomePageModule, SignupPageModule, FormsModule, HomeModule]
})
export class AppModule { }
