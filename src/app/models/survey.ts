export class Survey {
  id: string | null = null;
  title: string | null = null;
  description: string | null = null;
  questions: Question[] | null = null;
}

export class Question {
  questionId: number = 0;
  questionText: string | null = null;
  mandatoryInd: boolean = false;
  questionType: number = 0;
  options: string[] | null = null;
  randomizeOptionsInd: boolean | null = false;
  cards: string[] | null = null;
  programmerNotes: string | null = null;
  instructions: string | null = null;
}
