import { Question } from "./survey";

/**
 * Ensures the QuestionsId are in the correct order. start at 1 and increment by 1
 * @param questions 
 * @returns question array with correct questionId
 */
export function correctQuestionIdOrder(questions: Question[]): Question[] | null {
    for (let i = 0; i < questions.length; i++) {
        if (questions[i].questionId !== i + 1) {
            questions[i].questionId = i + 1;
        }
    }
    return questions;
}