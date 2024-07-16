import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {HttpService} from "../http.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {FileService} from "../file.service";

@Component({
  selector: 'app-pre-season-survey',
  templateUrl: './pre-season-survey.component.html',
  styleUrls: ['./pre-season-survey.component.css']
})
export class PreSeasonSurveyComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    let esorToken = sessionStorage.getItem('esorToken')

    if (esorToken) {
      this.isLoggedIn = true
      this.getPreSeasonSurveyData();
    } else {
      this.prepareBlankSurveyData();
    }
  }

  baseUrl = environment.baseURL
  mobile = window.screen.width < 900;

  isLoggedIn = false;
  isLoading = true;
  isError = false;
  surveyData: any;
  errorMessage = '';
  isSending = false;
  sentSuccessfully = false;
  sentWithError = false;
  gotSurveyByPassword = false;
  mailIsUsed = false;
  surveyByPwNotFound = false;
  surveyByPwForbidden = false;
  isGettingSurveyData = false;

  monday: any;
  tuesday: any;
  wednesday: any;
  thursday: any;
  friday: any;
  saturday: any;
  sunday: any;

  hasCar: any = true;
  extraComment: any;
  feedback: any;

  firstName = new FormControl('', [Validators.required]);
  lastName = new FormControl('', [Validators.required]);
  registrationAddress = new FormControl('', [Validators.required]);
  residenceAddress = new FormControl('', [Validators.required]);
  birthDate = new FormControl('', [Validators.required]);
  refereeCourseYear = new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"),
    Validators.min(new Date().getFullYear() - 100), Validators.max(new Date().getFullYear())]);
  phoneNumber = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  shirtSize: any;
  distancePreference: any;

  topSecretCounter = 0;
  surveyPassword = '';
  topSecretPassword: any;

  getPreSeasonSurveyData(): void {
    this.http.get<any>(this.baseUrl + 'esor/pre-season-survey?seasonId=' + environment.currentSeasonId, this.httpService.getOptionWithEsorToken()).subscribe({
      next: (response) => {
        this.surveyData = response;
        this.fillFields(response);

        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        this.isError = true;
        console.log(err)
      }
    })
  }

  getSurveyByPw() {
    this.isGettingSurveyData = true;
    this.surveyByPwNotFound = false;
    this.surveyByPwForbidden = false;
    this.http.get<any>(this.baseUrl + 'esor/pre-season-survey/' + this.surveyPassword + '?seasonId=' + environment.currentSeasonId).subscribe({
      next: (response) => {
        this.gotSurveyByPassword = true;
        this.surveyData = response;
        this.fillFields(response);

        this.isGettingSurveyData = false;
      },
      error: err => {
        this.isGettingSurveyData = false;
        if (err.status == 404) {
          this.surveyByPwNotFound = true;
        } else if (err.status == 403) {
          this.surveyByPwForbidden = true
        }
      }
    })
  }

  send() {
    this.isSending = true;
    this.surveyByPwNotFound = false;
    this.surveyByPwForbidden = false;
    this.errorMessage = ''
    if (this.isAllValid()) {
      this.sendSurvey()
    } else {
      this.isSending = false;
    }
  }

  checkMail() {
    if (!this.isLoggedIn && !this.email.invalid) {
      this.http.get<any>(this.baseUrl + 'esor/pre-season-survey/mail-check/' + this.email.value + '?seasonId=' + environment.currentSeasonId).subscribe({
        next: () => {
          this.mailIsUsed = true;
        },
        error: () => {
          this.mailIsUsed = false;
        }
      })
    }
  }

  private sendSurvey() {
    let request = this.surveyData;
    request.firstName = this.firstName.value;
    request.lastName = this.lastName.value;
    request.birthDate = this.birthDate.value;
    request.refereeCourseYear = this.refereeCourseYear.value;
    request.registrationAddress = this.registrationAddress.value;
    request.residenceAddress = this.residenceAddress.value;
    request.phoneNumber = this.phoneNumber.value;
    request.email = this.email.value;
    request.shirtSize = this.shirtSize;

    request.distancePreference = this.distancePreference;
    request.hasCar = this.hasCar;

    request.extraComment = this.extraComment;
    request.feedback = this.feedback;

    request.seasonId = environment.currentSeasonId;

    this.http.put<any>(this.baseUrl + 'esor/pre-season-survey', request, this.isLoggedIn ? this.httpService.getOptionWithEsorToken() : {}).subscribe({
      next: () => {
        this.sentSuccessfully = true;
        this.isSending = false;
      },
      error: err => {
        console.log(err)
        this.isSending = false;
        this.sentWithError = true
      }
    })
  }

  private isAllValid() {
    if (!this.shirtSize) {
      this.addErrorMessage(" Proszę wybrać rozmiar koszulki.")
    }

    if (!this.distancePreference) {
      this.addErrorMessage(" Proszę wybrać preferencje dotyczące odległości sędziowania.")
    }

    if (this.hasCar == null) {
      this.addErrorMessage(" Proszę wybrać czy posiadasz samochód.")
    }

    this.firstName.markAllAsTouched();
    this.lastName.markAllAsTouched();
    this.registrationAddress.markAllAsTouched();
    this.residenceAddress.markAllAsTouched();
    this.birthDate.markAllAsTouched();
    this.refereeCourseYear.markAllAsTouched();
    this.phoneNumber.markAllAsTouched();
    this.email.markAllAsTouched();

    if (this.firstName.invalid
      || this.lastName.invalid
      || this.registrationAddress.invalid
      || this.residenceAddress.invalid
      || this.birthDate.invalid
      || this.refereeCourseYear.invalid
      || this.phoneNumber.invalid
      || this.email.invalid) {
      this.addErrorMessage('Błąd w sekcji "Dane sędziego"');
    }
    return this.errorMessage == ''
  }

  addErrorMessage(newErrorMessage: string) {
    if (this.errorMessage == undefined || this.errorMessage == '') {
      this.errorMessage = newErrorMessage;
    } else {
      this.errorMessage+= '\n' + newErrorMessage;
    }
  }

  getErrorMessage(label: string) {
    switch (label) {
      case 'email': {
        if (this.email.value) {
          return 'Niepoprawny e-mail';
        } else {
          return 'Pole obowiązkowe'
        }
      }
      case 'refereeCourseYear': {
        if (this.refereeCourseYear.value) {
          return 'Niepoprawny rok sędziowania';
        } else {
          return 'Pole obowiązkowe'
        }
      }
    }
    return 'Pole obowiązkowe';
  }

  increaseTopSecretCounter() {
    this.topSecretCounter++;
  }

  downloadAllSurveys() {
    this.fileService.downloadAllSurveys(btoa(this.topSecretPassword));
  }

  private prepareBlankSurveyData() {
    this.surveyData = {"id": null}
    this.hasCar = null;
    this.isLoading = false;
  }

  private fillFields(response: any) {
    this.firstName.setValue(response.firstName);
    this.lastName.setValue(response.lastName);
    this.birthDate.setValue(response.birthDate);
    this.refereeCourseYear.setValue(response.refereeCourseYear);
    this.registrationAddress.setValue(response.registrationAddress);
    this.residenceAddress.setValue(response.residenceAddress);
    this.phoneNumber.setValue(response.phoneNumber);
    this.email.setValue(response.email);
    this.shirtSize = response.shirtSize;

    this.distancePreference = response.distancePreference;
    this.hasCar = response.hasCar;

    this.extraComment = response.extraComment;
    this.feedback = response.feedback;
  }
}
