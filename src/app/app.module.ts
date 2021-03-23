import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from "@angular/forms";
import { HomeComponent } from './home/home.component';
import {HttpClientModule} from "@angular/common/http";
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {SocialLoginModule, SocialAuthServiceConfig, FacebookLoginProvider} from 'angularx-social-login';
import {GoogleLoginProvider} from 'angularx-social-login';
import {AppConstants} from "./common/app.constants";
import { RegistrationCardComponent } from './login/registration-card/registration-card.component';
import { LoginCardComponent } from './login/login-card/login-card.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegistrationCardComponent,
    LoginCardComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    SocialLoginModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              AppConstants.GOOGLE_CLIENT_ID
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(AppConstants.FACEBOOK_CLIENT_ID)
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
