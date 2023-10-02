import { getCurrentSession } from "./auth";
import { prisma } from "./db";

const MS_IN_DAY = 1000 * 60 * 60 * 24;

export const checkSubscription = async () => {
  const session = await getCurrentSession();

  if (!session?.user) {
    return false;
  }

  const subscription = await prisma.userSubscription.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  if (!subscription) {
    return false;
  }

  //checking if it is not expired
  const isSubscribed =
    subscription.stripeSubscriptionId &&
    subscription.stripePriceId &&
    subscription.stripeCurrentPeriodEnd?.getTime()! + MS_IN_DAY > Date.now();
  return !!isSubscribed;
};
