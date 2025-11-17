export class Survey {
  id: string | null = null;
  title: string | null = null;
  description: string | null = null;
  questions: Question[] | null = null;

  constructor() {
    this.id = '';
    this.title = '';
    this.description = '';
    this.questions = [];
  }
}

export class Question {
  questionId = 1;
  questionText: string | null = null;
  mandatoryInd = false;
  questionType = 1;
  options: string[] | null = null;
  randomizeOptionsInd: boolean | null = false;
  cards: string[] | null = null;
  programmerNotes: string | null = null;
  instructions: string | null = null;

  constructor() {
    this.questionId = 1;
    this.questionText = '';
    this.mandatoryInd = false;
    this.questionType = 1;
    this.options = [];
    this.randomizeOptionsInd = false
    this.cards = [];
    this.programmerNotes = '';
    this.instructions = '';
  }
}
