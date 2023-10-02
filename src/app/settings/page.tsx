import SubscriptionButton from "@/components/SubscriptionButton";
import { checkSubscription } from "@/lib/subscription";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const isSubscribed = await checkSubscription();
  return (
    <div className="py-8 mx-auto max-w-7xl">
      <h1 className="text-3xl font-bold"> Settings</h1>
      {isSubscribed ? (
        <p className="text-xl text-secondary-foreground/60">
          {" "}
          You are Subscribed to Learning Quest!!
        </p>
      ) : (
        <p className="text-xl text-secondary-foreground/60">
          {" "}
          You are using free trial
        </p>
      )}
      <SubscriptionButton isSubscribed={isSubscribed} />
    </div>
  );
};

export default page;
