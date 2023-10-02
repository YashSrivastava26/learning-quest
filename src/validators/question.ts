import { z } from "zod";

export const questionsValiditor = z.object({
  question: z.string(),
  answer: z.string(),
  option1: z.string(),
  option2: z.string(),
  option3: z.string(),
});

export const questionsArrayValidator = z.array(questionsValiditor);

export type QuestionType = z.infer<typeof questionsValiditor>;
