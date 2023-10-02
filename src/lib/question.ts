import { QuestionType } from "@/validators/question";
import { strict_output } from "./gpt";

export async function getQuestionsFromTranscript(
  transcript: string,
  course_title: string
) {
  //   type Question = {
  //     question: string;
  //     answer: string;
  //     option1: string;
  //     option2: string;
  //     option3: string;
  //   };
  const questions: QuestionType[] = await strict_output(
    "You are a helpful AI that is able to generate mcq questions and answers, the length of each answer should not be more than 15 words",

    `You are to generate a random hard mcq question about ${course_title} with context of the following transcript: ${transcript}`,
    {
      question: "question",
      answer: "answer with max length of 15 words",
      option1: "option1 with max length of 15 words",
      option2: "option2 with max length of 15 words",
      option3: "option3 with max length of 15 words",
    }
  );
  return questions;
}
