import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { stripePaymeny } from "@/lib/payment";
import { NextResponse } from "next/server";

const settingsUrl = process.env.NEXT_PUBLIC_URL + "/settings";

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session?.user) {
      return new NextResponse("unauthorised", { status: 401 });
    }
    let userSubscription = null;
    try {
      userSubscription = await prisma.userSubscription.findUnique({
        where: {
          userId: session.user.id,
        },
      });

      if (!userSubscription) {
        throw new Error("no subscription found");
      }
    } catch (error) {
      const stripeSession = await stripePaymeny.checkout.sessions.create({
        success_url: settingsUrl,
        cancel_url: settingsUrl,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: session.user.email ?? "",
        line_items: [
          {
            price_data: {
              currency: "USD",
              product_data: {
                name: "Learning Journey Pro",
                description: "unlimited course generation!",
              },
              unit_amount: 1999,
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          userId: session.user.id,
        },
      });
      return NextResponse.json({ url: stripeSession.url });
    }

    if (userSubscription && userSubscription.stripeCustomerId) {
      const stripeSession = await stripePaymeny.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });
      return NextResponse.json({ url: stripeSession.url });
    }
    // cancel at the billing portal

    // user's first time subscribing
  } catch (error) {
    console.log("[STRIPE ERROR]", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
