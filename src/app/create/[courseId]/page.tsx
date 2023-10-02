import ChapterConfirmation from "@/components/ChapterConfirmation";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Info } from "lucide-react";
import { redirect } from "next/navigation";
import { FC } from "react";

interface pageProps {
  params: {
    courseId: string;
  };
}

const page: FC<pageProps> = async ({ params: { courseId } }) => {
  const session = await getCurrentSession();
  if (!session?.user) {
    return redirect("/gallery");
  }

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      units: {
        include: {
          chapters: true,
        },
      },
    },
  });

  if (!course) {
    return redirect("/create");
  }
  return (
    <div className="flex flex-col items-start max-w-xl mx-auto my-16">
      <h5 className="text-sm text-secondary-foreground/60 uppercase">
        Course Name
      </h5>
      <h1 className="text-5xl font-bold">{course.name}</h1>
      <div className="flex p-4 mt-5 border-none bg-secondary">
        <Info className="w-12 h-12 mr-3 text-blue-400" />
        <div>
          We generated chapters for each of your units. Look over them and then
          click the Button to confirm and continue
        </div>
      </div>
      <ChapterConfirmation course={course} />
    </div>
  );
};

export default page;
