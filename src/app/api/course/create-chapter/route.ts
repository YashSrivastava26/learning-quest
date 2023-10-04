import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { strict_output } from "@/lib/gpt";
import { checkSubscription } from "@/lib/subscription";
import { getImage } from "@/lib/unsplash";
import { createCourseSchema } from "@/validators/course";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

type OutputLesson = {
  youtube_query: string;
  chapter_title: string;
};
type OutputUnit = {
  title: string;
  chapters: OutputLesson[];
}[];

export async function POST(req: Request) {
  try {
    //checking credits
    const session = await getCurrentSession();
    if (!session?.user) {
      return new NextResponse("unauthorized", { status: 401 });
    }

    const isSubscribed = await checkSubscription();
    //on production
    // if (session.user.credits <= 0 && !isSubscribed) {
    //   return new NextResponse("no credits", { status: 402 });
    // }

    //but we only give 1 credit and payment is in test mode
    if (session.user.credits <= 0) {
      return new NextResponse("no credits", { status: 402 });
    }
    const body = await req.json();
    const { title, units } = createCourseSchema.parse(body);

    let outputUnits: OutputUnit = await strict_output(
      `You are an AI capable of curating course content, coming up with relevant chapter titles, and finding relevant youtube videos for each chapter and include these units ${units} also`,
      new Array(units.length).fill(
        `It is your job to create a course about ${title}. The user has requested to create chapters for each of the units. Then, for each chapter, provide a detailed youtube search query that can be used to find an informative educationalvideo for each chapter. Each query should give an educational informative course in youtube.`
      ),
      {
        title: "title of the unit",
        chapters:
          "an array of chapters, each chapter should have a youtube_query and a chapter_title key in the JSON object",
      }
    );

    const imageQuery = await strict_output(
      "you are an AI capable of finding the most relevant image for a course",
      `Please provide a good image search term for the title of a course about ${title}. This search term will be fed into the unsplash API, so make sure it is a good search term that will return good results`,
      {
        image_query: "a good search term for the title of the course",
      }
    );

    const image = await getImage(imageQuery.image_query);

    const course = await prisma.course.create({
      data: {
        name: title,
        image: image,
      },
    });

    for (const outputUnit of outputUnits) {
      const title = outputUnit.title;
      const prismaUnit = await prisma.unit.create({
        data: {
          name: title,
          courseId: course.id,
        },
      });
      await prisma.chapter.createMany({
        data: outputUnit.chapters.map((chapter) => {
          return {
            name: chapter.chapter_title,
            youtubeQuery: chapter.youtube_query,
            unitId: prismaUnit.id,
          };
        }),
      });
    }

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        credits: {
          decrement: 1,
        },
      },
    });
    return NextResponse.json({ course_id: course.id });
  } catch (error) {
    console.log(error);
    if (error instanceof ZodError) {
      return new NextResponse("invalid body", { status: 422 });
    }
    return new NextResponse("internal server error", { status: 500 });
  }
}
