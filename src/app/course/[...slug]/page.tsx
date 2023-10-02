import CourseSideBar from "@/components/CourseSideBar";
import MainVideo from "@/components/MainVideo";
import QuizCard from "@/components/QuizCard";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/db";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FC } from "react";

interface pageProps {
  params: {
    slug: string[];
  };
}

const page: FC<pageProps> = async ({ params: { slug } }) => {
  const [courseId, unitIndexParam, chapterIndexParam] = slug;

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      units: {
        include: {
          chapters: {
            include: { questions: true },
          },
        },
      },
    },
  });

  if (!course) return redirect("/gallery");
  const unitIndex = parseInt(unitIndexParam);
  const chapterIndex = parseInt(chapterIndexParam);

  const unit = course.units[unitIndex];
  if (!unit) return redirect(`/gallery`);
  const chapter = unit.chapters[chapterIndex];

  const nextChapter = unit.chapters[chapterIndex + 1];
  const prevChapter = unit.chapters[chapterIndex - 1];
  return (
    <>
      <CourseSideBar course={course} currentChapterId={chapter.id} />
      <div className="ml-[400px] px-8">
        <div className="flex">
          <MainVideo
            chapter={chapter}
            unit={unit}
            chapterIndex={chapterIndex}
            unitIndex={unitIndex}
          />

          <QuizCard chapter={chapter} />
        </div>

        <Separator className="flex-[1] h-[1px] mt-4 text-gray-500 bg-gray-500" />
        <div className="flex pb-8">
          {prevChapter && (
            <Link
              href={`/course/${courseId}/${unitIndex}/${chapterIndex - 1}`}
              className="flex mt-4 mr-auto w-fit"
            >
              <div className="flex items-center">
                <ChevronLeft className="w-6 h-6 mr-1" />
                <div className="flex flex-col items-start">
                  <span className="text-sm text-secondary-foreground/60">
                    Previous
                  </span>
                  <span className="text-xl font-bold">{prevChapter.name}</span>
                </div>
              </div>
            </Link>
          )}
          {nextChapter && (
            <Link
              href={`/course/${courseId}/${unitIndex}/${chapterIndex + 1}`}
              className="flex mt-4 ml-auto w-fit"
            >
              <div className="flex items-center">
                <div className="flex flex-col items-end">
                  <span className="text-sm text-secondary-foreground/60 text-right">
                    Next
                  </span>
                  <span className="text-xl font-bold text-right">
                    {nextChapter.name}
                  </span>
                </div>
                <ChevronRight className="w-6 h-6 ml-1" />
              </div>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default page;
