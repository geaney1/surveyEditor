export class Survey {
  id: string | null;
  title: string | null;
  description: string | null;
  questions: Question[] | null;

  constructor() {
    this.id = null;
    this.title = '';
    this.description = '';
    this.questions = [];
  }
}

export class Question {
  questionId: number;
  questionText: string | null;
  mandatoryInd?: boolean;
  questionType: number;
  options: string[] | null;
  randomizeOptionsInd: boolean;
  cards: { card: string }[] | null;
  programmerNotes: string | null;
  instructions: string | null;

  constructor() {
    this.questionId = 1;
    this.questionText = '';
    this.mandatoryInd = false;
    this.questionType = 1;
    this.options = [];
    this.randomizeOptionsInd = false;
    this.cards = [];
    this.programmerNotes = '';
    this.instructions = '';
  }
}
