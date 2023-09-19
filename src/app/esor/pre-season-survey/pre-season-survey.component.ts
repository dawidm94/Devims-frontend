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
  isGettingSurveyData = false;

  monday: any;
  tuesday: any;
  wednesday: any;
  thursday: any;
  friday: any;
  saturday: any;
  sunday: any;

  extraComment: any;

  firstName = new FormControl('', [Validators.required]);
  lastName = new FormControl('', [Validators.required]);
  registrationAddress = new FormControl('', [Validators.required]);
  residenceAddress = new FormControl('', [Validators.required]);
  birthDate = new FormControl('', [Validators.required]);
  refereeCourseYear = new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"),
    Validators.min(new Date().getFullYear() - 100), Validators.max(new Date().getFullYear())]);
  phoneNumber = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  distancePreference: any;

  topSecretCounter = 0;
  surveyPassword = '';
  topSecretPassword: any;

  getPreSeasonSurveyData(): void {
    this.http.get<any>(this.baseUrl + 'esor/pre-season-survey', this.httpService.getOptionWithEsorToken()).subscribe({
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
    this.http.get<any>(this.baseUrl + 'esor/pre-season-survey/' + this.surveyPassword).subscribe({
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
        }
      }
    })
  }

  send() {
    this.isSending = true;
    this.surveyByPwNotFound = false;
    this.errorMessage = ''
    if (this.isAllValid()) {
      this.sendSurvey()
    } else {
      this.isSending = false;
    }
  }

  checkMail() {
    if (!this.isLoggedIn && !this.email.invalid) {
      this.http.get<any>(this.baseUrl + 'esor/pre-season-survey/mail-check/' + this.email.value).subscribe({
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

    request.distancePreference = this.distancePreference;

    request.daysPossibility.monday = this.monday;
    request.daysPossibility.tuesday = this.tuesday;
    request.daysPossibility.wednesday = this.wednesday;
    request.daysPossibility.thursday = this.thursday;
    request.daysPossibility.friday = this.friday;
    request.daysPossibility.saturday = this.saturday;
    request.daysPossibility.sunday = this.sunday;

    request.extraComment = this.extraComment;

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
    let errorDays = [];
    if (this.monday.isChecked && !this.monday.wholeDay) {
      if (!this.monday.fromTime && !this.monday.toTime) {
        errorDays.push('poniedziałek')
      }
    }

    if (this.tuesday.isChecked && !this.tuesday.wholeDay) {
      if (!this.tuesday.fromTime && !this.tuesday.toTime) {
        errorDays.push('wtorek')
      }
    }

    if (this.wednesday.isChecked && !this.wednesday.wholeDay) {
      if (!this.wednesday.fromTime && !this.wednesday.toTime) {
        errorDays.push('środa')
      }
    }

    if (this.thursday.isChecked && !this.thursday.wholeDay) {
      if (!this.thursday.fromTime && !this.thursday.toTime) {
        errorDays.push('czwartek')
      }
    }

    if (this.friday.isChecked && !this.friday.wholeDay) {
      if (!this.friday.fromTime && !this.friday.toTime) {
        errorDays.push('piątek')
      }
    }

    if (this.saturday.isChecked && !this.saturday.wholeDay) {
      if (!this.saturday.fromTime && !this.saturday.toTime) {
        errorDays.push('sobota')
      }
    }

    if (this.sunday.isChecked && !this.sunday.wholeDay) {
      if (!this.sunday.fromTime && !this.sunday.toTime) {
        errorDays.push('niedziela')
      }
    }

    if (errorDays.length != 0) {
      this.addErrorMessage("Jeżeli jest odznaczone pole 'cały dzień', musisz uzupełnić przynajmniej jedno pole z godziną dla tego dnia. Błędne dni to: [" + errorDays.join(', ') + "]")
    }

    if (!this.distancePreference) {
      this.addErrorMessage(" Proszę wybrać preferencje dotyczące odległości sędziowania.")
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
   this.surveyData = {
     "id": null,
     "firstName": "",
     "lastName": "",
     "birthDate": "",
     "refereeCourseYear": null,
     "registrationAddress": "",
     "residenceAddress": "",
     "phoneNumber": "",
     "email": "",
     "distancePreference": null,
     "daysPossibility": {
       "sunday": {
         "isChecked": null,
         "wholeDay": true,
         "fromTime": null,
         "toTime": null
       },
       "saturday": {
         "isChecked": null,
         "wholeDay": true,
         "fromTime": null,
         "toTime": null
       },
       "tuesday": {
         "isChecked": null,
         "wholeDay": true,
         "fromTime": null,
         "toTime": null
       },
       "wednesday": {
         "isChecked": null,
         "wholeDay": true,
         "fromTime": null,
         "toTime": null
       },
       "thursday": {
         "isChecked": null,
         "wholeDay": true,
         "fromTime": null,
         "toTime": null
       },
       "friday": {
         "isChecked": null,
         "wholeDay": true,
         "fromTime": null,
         "toTime": null
       },
       "monday": {
         "isChecked": null,
         "wholeDay": true,
         "fromTime": null,
         "toTime": null
       }
     },
     "extraComment": null,
     "lastModifiedDate": null
   }

   this.fillFields(this.surveyData)

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

    this.distancePreference = response.distancePreference;

    this.monday = response.daysPossibility.monday
    this.tuesday = response.daysPossibility.tuesday
    this.wednesday = response.daysPossibility.wednesday
    this.thursday = response.daysPossibility.thursday
    this.friday = response.daysPossibility.friday
    this.saturday = response.daysPossibility.saturday
    this.sunday = response.daysPossibility.sunday

    this.extraComment = response.extraComment;
  }
}
