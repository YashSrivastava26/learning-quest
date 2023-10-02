"use client";
import { cn } from "@/lib/utils";
import { Chapter, Question } from "@prisma/client";
import { FC, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";

interface QuizCardProps {
  chapter: Chapter & {
    questions: Question[];
  };
}

const QuizCard: FC<QuizCardProps> = ({ chapter }) => {
  const [answersChoosen, setAnswersChoosen] = useState<Record<string, string>>(
    {}
  );
  const [questionState, setQuestionState] = useState<
    Record<string, boolean | null>
  >({});
  const checkAnswer = () => {
    chapter.questions.forEach((question) => {
      const user_answer = answersChoosen[question.id];

      if (!user_answer) {
        setQuestionState((prev) => {
          return {
            ...prev,
            [question.id]: null,
          };
        });
      } else if (user_answer === question.answer) {
        setQuestionState((prev) => {
          return {
            ...prev,
            [question.id]: true,
          };
        });
      } else {
        setQuestionState((prev) => {
          return {
            ...prev,
            [question.id]: false,
          };
        });
      }
    });
  };
  return (
    <div className="flex-[1] mt-16 ml-8">
      <h1 className="text-2xl font-bold">Concept Check</h1>
      <div className="mt-2">
        {chapter.questions.map((question) => {
          const options = JSON.parse(question.options) as string[];
          return (
            <div
              key={question.id}
              className={cn("p-3 mt-3 border border-secondary rounded-lg", {
                "bg-green-700": questionState[question.id] === true,
                "bg-red-700": questionState[question.id] === false,
              })}
            >
              <h1 className="text-lg font-semibold">{question.question}</h1>
              <div className="mt-2">
                <RadioGroup
                  onValueChange={(e) => {
                    setAnswersChoosen((prev) => {
                      return {
                        ...prev,
                        [question.id]: e,
                      };
                    });
                  }}
                >
                  {options.map((option, index) => {
                    return (
                      <div className="flex items-center space-x-2" key={index}>
                        <RadioGroupItem
                          value={option}
                          id={question.id + index.toString()}
                        />
                        <Label htmlFor={question.id + index.toString()}>
                          {option}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            </div>
          );
        })}
      </div>
      <Button className="w-full mt-2" size="lg" onClick={() => checkAnswer()}>
        {" "}
        Check Answer
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
};

export default QuizCard;
