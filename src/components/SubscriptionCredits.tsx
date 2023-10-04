import { FC, useState } from "react";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Zap } from "lucide-react";
import axios from "axios";
import { useSession } from "next-auth/react";

interface SubscriptionCreditsProps {
  isSubscribed: boolean;
}

const SubscriptionCredits: FC<SubscriptionCreditsProps> = ({
  isSubscribed,
}) => {
  const { data } = useSession();
  let credits = data?.user?.credits;
  if (!credits) credits = 0;
  const [loading, setLoading] = useState<boolean>(false);
  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/payment");
      window.location.href = res.data.url;
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setLoading(false);
    }
  };
  console.log(isSubscribed);
  return (
    <div className="flex flex-col items-center w-1/2 p-4 mx-auto mt-4 rounded-md bg-secondary">
      {isSubscribed && <p>You are Subscribed</p>}
      {credits} / 10 Free Generations
      <Progress className="mt-2 bg-black/60" value={(credits / 10.0) * 100} />
      <Button
        onClick={() => handleSubscribe()}
        className="mt-3 font-bold text-white transition bg-gradient-to-tr from-green-400 to-blue-500 hover:from-green-400 hover:to-blue-600"
      >
        Upgrade <Zap className="fill-white ml-2" />
      </Button>
    </div>
  );
};

export default SubscriptionCredits;
