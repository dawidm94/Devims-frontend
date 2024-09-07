import {NavigationStart, Router} from "@angular/router";
import { HostListener } from '@angular/core';
import { Location } from '@angular/common';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Answer {
  id: number;
  question: Question;
  userAnswer: boolean;
}

export interface Question {
  id: number;
  question: string;
  correctAnswer: boolean;
}

export interface Test {
  question: Question;
  user: User;
  answers: Answer[]
}

import { Component, OnInit } from '@angular/core';
import {filter, interval, Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {TestBackDialogComponent} from "../test-back-dialog/test-back-dialog.component";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  private isNavigatingBack: boolean = false;
  public minutes: number = 30;
  public seconds: number = 0;
  public score: number = 0;
  baseUrl = environment.baseURL
  isWelcomePage = true;
  isGettingQuestions = false
  isTestPage = false;
  isTestPreparation = true;
  isTimeUp = false;
  isTestFinished = false;
  sentWithError = false;
  titleFontSize = 20;
  questionFontSize = 15;
  fontSizeChangeNo = 0;
  currentQuestionIndex = 0;
  test: any;
  questionsNo = 25
  correctAnswersToPass = 17;
  myForm: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private location: Location,
    private router: Router,
    public dialog: MatDialog
    ) {
    this.myForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    // Subskrybuj zmiany w nawigacji, zwłaszcza zdarzenie "NavigationStart"
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationStart) // Filtrowanie tylko NavigationStart
      )
      .subscribe((event: any) => {
        // Sprawdź, czy to jest nawigacja wstecz
        if (event.navigationTrigger === 'popstate' && !this.isNavigatingBack) {
          // Zatrzymaj nawigację poprzez ponowne nawigowanie na obecną stronę
          this.router.navigateByUrl(this.router.url);

          // Otwórz modal z potwierdzeniem
          this.openConfirmationDialog();
        }
      });
  }

  // Sprawdzamy, czy zdarzenie to próba cofnięcia się
  isBackNavigation(event: any): boolean {
    return event.restoredState && event.navigationTrigger === 'popstate';
  }

  // Otwórz modal z potwierdzeniem
  openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(TestBackDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.location.back();
      }
    });
  }


  getTest() {
    if (this.myForm.valid) {
      this.isGettingQuestions = true
      this.http.post<any>(this.baseUrl + 'test/questions', this.myForm.value).subscribe({
        next: test => {
          this.test = test;
          this.isWelcomePage = false;

          if (this.test.finishedDateTime || this.isTimeExpired()) {
            this.finishAndSendTest();
            this.isGettingQuestions = false
          } else {
            this.isTestPage = true;
            this.isGettingQuestions = false

            if (this.test.startTestDateTime) {
              this.runLeftTimeInTimer();
              this.isTestPreparation = false;
            } else {
              this.isTestPreparation = true;
            }
          }
        },
        error: err => {
          this.sentWithError = true
        }
      })
    }
  }

  runLeftTimeInTimer() {
    const createDate = new Date(this.test.startTestDateTime);
    const now = new Date();
    const diffInMilliseconds = now.getTime() - createDate.getTime();
    const diffInMinutes = diffInMilliseconds / (1000 * 60);
    const diffInSeconds = diffInMilliseconds / 1000;
    const minutesLeft = Math.floor(30 - diffInMinutes);
    const secondsLeft = Math.floor((30 * 60) - diffInSeconds) % 60;

    this.minutes = minutesLeft;
    this.seconds = secondsLeft;

    this.startTimer();
  }

  isTimeExpired() {
    if (!this.test.startTestDateTime) {
      return;
    }
    const createDate = new Date(this.test.startTestDateTime);
    const now = new Date();
    const diffInMilliseconds = now.getTime() - createDate.getTime();
    const diffInMinutes = diffInMilliseconds / (1000 * 60);
    return diffInMinutes > this.minutes;
  }

  fontIncrease() {
    if (this.fontSizeChangeNo < 12) {
      this.fontSizeChangeNo += 2;
    }
  }

  fontDecrease() {
    if (this.fontSizeChangeNo > -6) {
      this.fontSizeChangeNo -= 2;
    }
  }

  startTest() {
    this.isTestPreparation = false;
    if (!this.test.startTestDateTime) {
      this.startTimer();

      this.http.get<any>(this.baseUrl + 'test/start?email=' + this.test.user.email).subscribe({
        next: () => {
        },
        error: err => {
          console.log(err)
          this.sentWithError = true
        }
      })
    }
  }

  previousQuestion() {
    this.currentQuestionIndex -= 1;
  }

  nextQuestion() {
    this.currentQuestionIndex += 1;
  }

  finishAndSendTest() {
    this.http.post<any>(this.baseUrl + 'test/resolve', this.test).subscribe({
      next: () => {
        this.finishTest();
      },
      error: err => {
        console.log(err)
        this.sentWithError = true
      }
    })

  }

  startTimer(): void {
    const source = interval(1000);
    this.subscription = source.subscribe(() => {
      if (this.seconds === 0) {
        if (this.minutes === 0) {
          this.subscription.unsubscribe();
          if (!this.isTestFinished) {
            this.isTimeUp = true;
            this.finishAndSendTest();
          }
        } else {
          this.minutes--;
          this.seconds = 59;
        }
      } else {
        this.seconds--;
      }
    });
  }

  isTestPassed() {
    return this.score >= this.correctAnswersToPass
  }

  private finishTest() {
    this.test.answers.forEach((answer: Answer) => {
      if (answer.userAnswer == answer.question.correctAnswer) {
        this.score++;
      }
    })
    this.isTestPage = false;
    this.isTestFinished = true;
  }
}
