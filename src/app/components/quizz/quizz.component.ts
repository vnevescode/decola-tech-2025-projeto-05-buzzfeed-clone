import { Component, OnInit } from '@angular/core';
import quizz_questions from '../../../assets/data/quizz_questions.json';

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.css'],
})
export class QuizzComponent implements OnInit {
  title: string = '';

  questions: any;
  questionSelected: any;

  answers: string[] = [];
  answerSelected: string = '';

  questionIndex: number = 0;
  questionMaxIndex: number = 0;

  finished: boolean = false;
  isLoading: boolean = true;
  isCalculatingResult: boolean = false;

  quizResults: any;

  constructor() {}

  async ngOnInit(): Promise<void> {
    this.isLoading = true;

    const quizPaths = [
      'assets/data/quizz_celebrities.json',
      'assets/data/quizz_comidas.json',
      'assets/data/quizz_estilos.json',
      'assets/data/quizz_pets.json',
      'assets/data/quizz_questions.json',
      'assets/data/quizz_signos.json',
      'assets/data/quizz_tecnologia.json',
    ];

    const randomPath = quizPaths[Math.floor(Math.random() * quizPaths.length)];

    /* if (quizz_questions) {
      this.finished = false;
      this.title = quizz_questions.title;

      this.questions = quizz_questions.questions;
      this.questionSelected = this.questions[this.questionIndex];

      this.questionIndex = 0;
      this.questionMaxIndex = this.questions.length;

      console.log(this.questionIndex);
      console.log(this.questionMaxIndex);
    } */

    try {
      const response = await fetch(randomPath);
      const quiz = await response.json();

      this.finished = false;

      this.title = quiz.title;
      this.questions = quiz.questions;
      this.questionSelected = this.questions[this.questionIndex];

      this.questionIndex = 0;
      this.questionMaxIndex = this.questions.length;

      this.quizResults = quiz.results;

      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    } catch (error) {
      console.error('Erro ao carregar o quiz:', error);
    }

    // Simula um delay
    /* setTimeout(() => {
      this.isLoading = false;
    }, 1000); */
  }

  playerChoose(value: string) {
    this.answers.push(value);
    this.nextStep();
  }

  async nextStep() {
    this.questionIndex += 1;

    if (this.questionMaxIndex > this.questionIndex) {
      this.questionSelected = this.questions[this.questionIndex];
    } else {
      // Novo loading para cálculo do resultado
      this.isCalculatingResult = true;
      setTimeout(async () => {
        const finalAnswer: string = await this.checkResult(this.answers);

        this.answerSelected =
          this.quizResults[finalAnswer as keyof typeof this.quizResults];

        this.finished = true;
        this.isCalculatingResult = false;
      }, 1500);
    }
  }

  async checkResult(anwsers: string[]) {
    const result = anwsers.reduce((previous, current, i, arr) => {
      if (
        arr.filter((item) => item === previous).length >
        arr.filter((item) => item === current).length
      ) {
        return previous;
      } else {
        return current;
      }
    });

    return result;
  }

  resetQuiz(): void {
    window.location.reload();
  }
}
