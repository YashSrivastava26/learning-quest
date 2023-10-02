"use client";
import { Chapter, Course, Unit } from "@prisma/client";
import React, { FC, useMemo, useState } from "react";
import ChapterConfirmationCard, {
  ChapterConfirmationCardHandler,
} from "./ChapterConfirmationCard";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { Button, buttonVariants } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ChapterConfirmationProps {
  course: Course & {
    units: (Unit & {
      chapters: Chapter[];
    })[];
  };
}

const ChapterConfirmation: FC<ChapterConfirmationProps> = ({ course }) => {
  const [loading, setLoading] = React.useState(false);
  const chapterRefs: Record<
    string,
    React.RefObject<ChapterConfirmationCardHandler>
  > = {};
  course.units.forEach((unit) => {
    unit.chapters.forEach((chapter) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      chapterRefs[chapter.id] = React.useRef(null);
    });
  });
  const [completedChapter, setCompletedChapter] = React.useState<Set<String>>(
    new Set()
  );
  const totalChaptersCount = React.useMemo(() => {
    return course.units.reduce((acc, unit) => {
      return acc + unit.chapters.length;
    }, 0);
  }, [course.units]);
  return (
    <div className="w-full mt-4">
      {course.units.map((unit, index) => {
        return (
          <div key={unit.id} className="mt-5">
            <h2 className="text-sm uppercase text-secondary-foreground/60">
              Unit {index + 1}
            </h2>
            <h3 className="text-2xl font-bold">{unit.name}</h3>
            <div className="mt-3">
              {unit.chapters.map((chapter, index) => {
                return (
                  <ChapterConfirmationCard
                    ref={chapterRefs[chapter.id]}
                    key={chapter.id}
                    chapter={chapter}
                    index={index}
                    completedChapter={completedChapter}
                    setCompletedChapter={setCompletedChapter}
                  />
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="flex items-center justify-center mt-4">
        <Separator className="flex-[1]" />
        <div className="flex items-center mx-4">
          <Link
            href="/create"
            className={buttonVariants({
              variant: "secondary",
            })}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Link>

          {totalChaptersCount === completedChapter.size ? (
            <Link
              className={buttonVariants({
                className: "ml-4 font-semibold",
              })}
              href={`/course/${course.id}/0/0`}
            >
              Save & Continue
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          ) : (
            <Button
              disabled={loading}
              className="ml-4 font-semibold"
              type="button"
              onClick={() => {
                setLoading(true);
                Object.values(chapterRefs).forEach((ref) => {
                  ref.current?.triggerLoad();
                });
              }}
            >
              Generate
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
        <Separator className="flex-[1]" />
      </div>
    </div>
  );
};

export default ChapterConfirmation;
