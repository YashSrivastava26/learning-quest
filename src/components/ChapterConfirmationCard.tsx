"use client";
import { cn } from "@/lib/utils";
import { Chapter } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { FC, useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";
import { Loader, Loader2 } from "lucide-react";

interface ChapterConfirmationCardProps {
  chapter: Chapter;
  index: number;
  completedChapter: Set<String>;
  setCompletedChapter: React.Dispatch<React.SetStateAction<Set<String>>>;
}

export type ChapterConfirmationCardHandler = {
  triggerLoad: () => void;
};

const ChapterConfirmationCard = React.forwardRef<
  ChapterConfirmationCardHandler,
  ChapterConfirmationCardProps
>(
  (
    {
      chapter,
      index,
      setCompletedChapter,
      completedChapter,
    }: ChapterConfirmationCardProps,
    ref
  ) => {
    const { toast } = useToast();
    const [success, setSuccess] = useState<boolean | null>(null);
    const { mutate: getVideo, isLoading } = useMutation({
      mutationFn: async () => {
        const res = await axios.post("/api/chapter/get-video", {
          chapterId: chapter.id,
        });
        return res.data;
      },
    });

    const addChapterIdToSet = React.useCallback(() => {
      setCompletedChapter((prev) => {
        const newSet = new Set(prev);
        newSet.add(chapter.id);
        return newSet;
      });
    }, [chapter.id, setCompletedChapter]);

    React.useEffect(() => {
      if (chapter.videoId) {
        setSuccess(true);
        addChapterIdToSet;
      }
    }, [chapter, addChapterIdToSet]);

    React.useImperativeHandle(ref, () => ({
      async triggerLoad() {
        if (chapter.videoId) {
          addChapterIdToSet();
          return;
        }
        getVideo(undefined, {
          onSuccess: () => {
            setSuccess(true);
            addChapterIdToSet();
          },
          onError: (error) => {
            console.error(error);
            setSuccess(false);
            toast({
              title: "Error",
              description: "There was an error loading your chapter",
              variant: "destructive",
            });
            addChapterIdToSet();
          },
        });
      },
    }));

    return (
      <div
        key={chapter.id}
        className={cn("px-4 py-2 mt-2 rounded-md flex justify-between", {
          " bg-secondary": success === null,
          "bg-green-500": success === true,
          "bg-red-500": success === false,
        })}
      >
        <h5>{chapter.name}</h5>
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      </div>
    );
  }
);

ChapterConfirmationCard.displayName = "ChapterConfirmationCard";

export default ChapterConfirmationCard;
