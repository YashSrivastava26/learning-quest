import { prisma } from "@/lib/db";
import { strict_output } from "@/lib/gpt";
import { getQuestionsFromTranscript } from "@/lib/question";
import { getTranscript, searchYoutube } from "@/lib/youtube";
import { QuestionType, questionsValiditor } from "@/validators/question";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  chapterId: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { chapterId } = bodySchema.parse(body);

    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
      },
    });

    if (!chapter) {
      return NextResponse.json(
        { sucess: false, error: "chapter not found" },
        { status: 404 }
      );
    }

    const videoID = await searchYoutube(chapter.youtubeQuery);
    let transcript = await getTranscript(videoID);

    const maxLength = 500;
    transcript = transcript.split(" ").slice(0, maxLength).join(" ");

    const { summary }: { summary: string } = await strict_output(
      "You are an AI capable of summarising a youtube transcript",
      "summarise in 250 words or less and do not talk of the sponsors or anything unrelated to the main topic, also do not introduce what the summary is about.\n" +
        transcript,
      { summary: "summary of the transcript" }
    );

    const questions = await getQuestionsFromTranscript(summary, chapter.name);

    const questionParsed: QuestionType = questionsValiditor.parse(questions);

    let options = [
      questionParsed.answer,
      questionParsed.option1,
      questionParsed.option2,
      questionParsed.option3,
    ];
    options.sort(() => Math.random() - 0.5);
    await prisma.question.create({
      data: {
        chapterId: chapterId,
        question: questionParsed.question,
        answer: questionParsed.answer,
        options: JSON.stringify(options),
      },
    });

    await prisma.chapter.update({
      where: {
        id: chapterId,
      },
      data: {
        videoId: videoID,
        summary: summary,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { sucess: false, error: "invlid body" },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { sucess: false, error: "internal error" },
      { status: 500 }
    );
  }
}
