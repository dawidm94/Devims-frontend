import {ActivatedRoute, Router} from "@angular/router";

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

import {Component, HostListener, OnInit} from '@angular/core';
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
  public minutes: number = 0;
  public seconds: number = 0;
  public score: number = 0;
  baseUrl = environment.baseURL
  isMobile = window.screen.width < 900
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
  isTestExist = true;
  isTestActive = true;
  isLoadTestErr = false;
  availableTests: any;
  userTest: any;
  testId: any;
  myForm: FormGroup;
  displayedColumns: string[] = this.isMobile ? ['name'] : ['name', 'activateFrom', 'activateTo'];


  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
    ) {
    this.myForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.testId = routeParams.get('testId')

    if (this.testId) {
        this.getTest(this.testId);
    } else {
      this.getAvailableTests();
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    if (!this.isWelcomePage && !this.isTestFinished) {
      $event.returnValue = true;
    }
  }

  getUserTest() {
    if (this.myForm.valid) {
      this.isGettingQuestions = true
      this.http.post<any>(this.baseUrl + 'test/questions/' + this.testId, this.myForm.value).subscribe({
        next: test => {
          this.userTest = test;
          this.isWelcomePage = false;

          this.loadAnswersFromLocalStorage();

          if (this.userTest.finishedDateTime || this.isTimeExpired()) {
            this.finishAndSendTest();
            this.isGettingQuestions = false
          } else {
            this.isTestPage = true;
            this.isGettingQuestions = false

            if (this.userTest.startTestDateTime) {
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
    const createDate = new Date(this.userTest.startTestDateTime);
    const now = new Date();
    const diffInMilliseconds = now.getTime() - createDate.getTime();
    const diffInMinutes = diffInMilliseconds / (1000 * 60);
    const diffInSeconds = diffInMilliseconds / 1000;
    const minutesLeft = Math.floor(this.minutes - diffInMinutes);
    const secondsLeft = Math.floor((this.minutes * 60) - diffInSeconds) % 60;

    this.minutes = minutesLeft;
    this.seconds = secondsLeft;

    this.startTimer();
  }

  isTimeExpired() {
    if (!this.userTest.startTestDateTime) {
      return;
    }
    const createDate = new Date(this.userTest.startTestDateTime);
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
    if (!this.userTest.startTestDateTime) {
      this.startTimer();

      this.http.get<any>(this.baseUrl + 'test/start/' + this.testId + '?email=' + this.userTest.user.email).subscribe({
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
    this.http.post<any>(this.baseUrl + 'test/resolve', this.userTest).subscribe({
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
    return this.score >= this.test.questionsNoToPass
  }

  private finishTest() {
    this.userTest.answers.forEach((answer: Answer) => {
      if (answer.userAnswer == answer.question.correctAnswer) {
        this.score++;
      }
    })
    this.isTestPage = false;
    this.isTestFinished = true;

    localStorage.removeItem('testAnswers');
  }

  saveAnswersToLocalStorage() {
    const answers = this.userTest.answers.map((answer: Answer) => ({
      id: answer.id,
      userAnswer: answer.userAnswer
    }));
    localStorage.setItem('testAnswers', JSON.stringify(answers));
  }

  loadAnswersFromLocalStorage() {
    const savedAnswers = localStorage.getItem('testAnswers');
    if (savedAnswers) {
      const parsedAnswers = JSON.parse(savedAnswers);
      parsedAnswers.forEach((savedAnswer: { id: number, userAnswer: boolean }) => {
        const answer = this.userTest.answers.find((a: Answer) => a.id === savedAnswer.id);
        if (answer) {
          answer.userAnswer = savedAnswer.userAnswer;
        }
      });
    }
  }

  private getTest(testId: any) {
    this.http.get<any>(this.baseUrl + 'test/' + testId).subscribe({
      next: test => {
        console.log(test)
        this.test = test;
        if (test) {
          this.minutes = test.minutesToResolve;
        }
      },
      error: err => {
        this.isLoadTestErr = true;
        if (err.status == 404) {
          this.isTestExist = false;
        }
        if (err.status == 403) {
          this.isTestActive = false;
        }
        console.log(err)
      }
    })
  }

  private getAvailableTests() {
    this.http.get<any>(this.baseUrl + 'test/available').subscribe({
      next: tests => {
        this.availableTests = tests;
      },
      error: err => {
        console.log(err)
      }
    })
  }

  chooseTest(row: any) {
    this.router.navigate(['/test/' + row.id])
  }
}
