import { Component, OnInit } from '@angular/core';
import {interval, Subscription} from "rxjs";

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
  isWelcomePage = true;
  isTestPage = false;
  isTestPreparation = true;
  isTimeUp = false;
  isTestFinished = false;
  titleFontSize = 20;
  questionFontSize = 15;
  fontSizeChangeNo = 0;
  currentQuestionIndex = 0;
  questions = [
    {question:'Czy przewodniczący ma włosy?', correctAnswer: false, answer: null},
    {question:'Czy Radek wrócił do picia?', correctAnswer: true, answer: null},
    {question:'Czy Jasina spada do drugiego koszyka?', correctAnswer: true, answer: null},
    {question:'Czy Agata przeczytała wszystkie maile na ks@slzkosz?', correctAnswer: true, answer: null},
    {question:'Czy Sims jest upośledzony?', correctAnswer: true, answer: null},
  ]

  constructor() { }

  ngOnInit(): void {
  }

  getQuestions() {
    //pobiera z API pytania - w API sprawdzam czy ten mail ma juz wygenerowane pytania, jak tak to pobieram je, jak nie - to generuje.
    this.isWelcomePage = false;
    this.isTestPreparation = true;
    this.isTestPage = true;
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

  finishTest() {
    this.questions.forEach(question => {
      if (question.answer == question.correctAnswer) {
        this.score++;
      }
    })
    this.isTestPage = false;
    this.isTestFinished = true;
  }

  startTimer(): void {
    const source = interval(1000);
    this.subscription = source.subscribe(() => {
      if (this.seconds === 0) {
        if (this.minutes === 0) {
          this.subscription.unsubscribe();
          if (!this.isTestFinished) {
            this.isTimeUp = true;
            this.finishTest();
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

  calculatePercent() {
    return Math.floor((this.score / this.questions.length) * 100)
  }

  isTestPassed() {
    return this.calculatePercent() >= 80;
  }
}
