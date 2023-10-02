import { Chapter, Course, Unit } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface GalleryCourseCardProps {
  course: Course & {
    units: (Unit & {
      chapters: Chapter[];
    })[];
  };
}

const GalleryCourseCard: FC<GalleryCourseCardProps> = ({ course }) => {
  return (
    <>
      <div className="border rounded-lg border-secondary">
        <div className="relative">
          <Link
            href={`/course/${course.id}/0/0`}
            className="relative block w-fit"
          >
            <Image
              src={course.image}
              alt="Course Image"
              className="object-cover w-full max-h-[300px] rounded-t-lg "
              width={300}
              height={300}
            />
            <span className="absolute px-2 py-1 text-white rounded-md bg-black/60 w-fit bottom-2 left-2 right-2">
              {course.name}
            </span>
          </Link>
        </div>

        <div className="p-4">
          <h4 className="text-sm text-secondary-foreground/60 ">Units</h4>
          <div className="space-y-1">
            {course.units.map((unit, unitIndex) => {
              return (
                <Link
                  href={`/course/${course.id}/${unitIndex}/0`}
                  key={unit.id}
                  className="block underline w-fit hover:text-secondary-foreground/80"
                >
                  {unit.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default GalleryCourseCard;
