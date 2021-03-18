import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from "@angular/forms";
import { HomeComponent } from './home/home.component';
import {HttpClientModule} from "@angular/common/http";
import { OauthComponent } from './login/oauth/oauth.component';
import {MDBBootstrapModule} from "angular-bootstrap-md";
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {GoogleLoginProvider} from 'angularx-social-login';
import {AppConstants} from "./common/app.constants";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    OauthComponent
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
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
