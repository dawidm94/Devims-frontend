export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Question {
  id: number;
  question: string;
  correctAnswer: boolean;
}

export interface Test {
  question: Question;
  user: User;
  userAnswer: boolean;
}

import { Component, OnInit } from '@angular/core';
import {interval, Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  public minutes: number = 2;
  public seconds: number = 0;
  public score: number = 0;
  baseUrl = environment.baseURL
  isWelcomePage = true;
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
  questionsNo = 5 //25
  correctAnswersToPass = 4; //17
  myForm: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
    ) {
    this.myForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
  }

  getTest() {
    if (this.myForm.valid) {
      this.http.post<any>(this.baseUrl + 'test/questions', this.myForm.value).subscribe({
        next: test => {
          this.test = test;
          this.isWelcomePage = false;

          if (this.testHasAnsweredQuestions()) {
            this.finishAndSendTest();
          } else {
            this.isTestPreparation = true;
            this.isTestPage = true;
          }
        },
        error: err => {
          this.sentWithError = true
        }
      })
    }
  }

  testHasAnsweredQuestions() {
    return this.test.some((question: { userAnswer: null; }) => question.userAnswer !== null);
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
    this.startTimer();
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
    this.test.forEach((question: Test) => {
      if (question.userAnswer == question.question.correctAnswer) {
        this.score++;
      }
    })
    this.isTestPage = false;
    this.isTestFinished = true;
  }
}
