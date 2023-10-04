import CreateCourseForm from "@/components/CreateCourseForm";
import { getCurrentSession } from "@/lib/auth";
import { checkSubscription } from "@/lib/subscription";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const session = await getCurrentSession();
  const isSubscribed = await checkSubscription();

  if (!session?.user) {
    return redirect("/gallery");
  }
  return (
    <div className="flex flex-col items-center max-w-xl px-8 mx-auto">
      <h1 className="self-center text-3xl font-bold text-center sm:text-8xl">
        Learning Quest
      </h1>
      <div className="flex items-center p-4 mt-5 border-none bg-secondary">
        <InfoIcon className="w-12 h-12 mr-3 text-blue-500" />
        <div>
          {" "}
          Enter in a course title or what you want to learn about. Then enter a
          list of units, which are the specifics you want to learn about. and
          our AI will generate a course for you!!{" "}
        </div>
      </div>
      <CreateCourseForm isSubscribed={isSubscribed} />
    </div>
  );
};

export default page;
