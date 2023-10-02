"use client";
import { FC, useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";

interface SubscriptionButtonProps {
  isSubscribed: boolean;
}

const SubscriptionButton: FC<SubscriptionButtonProps> = ({ isSubscribed }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const handleSubscription = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/payment");
      window.location.href = res.data.url;
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button onClick={handleSubscription} className="mt-4" disabled={loading}>
      {isSubscribed ? "Manage Subscription" : "Upgrade"}
    </Button>
  );
};

export default SubscriptionButton;
