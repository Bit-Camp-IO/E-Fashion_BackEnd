import Config from '@/config';
import Stripe from 'stripe';

const stripe = new Stripe(Config.STRIPE_PRIVATE_KEY, {
  apiVersion: '2022-11-15',
});

export type StripeMetadata = {
  userId: string;
  totalPrice: number;
  collectionId?: string;
};

export async function createPaymentIntents(d: StripeMetadata): Promise<null | string> {
  try {
    const payment = await stripe.paymentIntents.create({
      amount: paymentAmount(d.totalPrice),
      currency: 'EGP',
      payment_method_types: ['card'],
      metadata: d,
    });
    if (!payment.client_secret) throw new Error();
    return payment.client_secret;
  } catch (error) {
    return null;
  }
}

type StripeCallback = (m: StripeMetadata) => Promise<any>;

export async function stripeEventsHook(event: Stripe.Event, successCB: StripeCallback) {
  switch (event.type) {
    case 'payment_intent.succeeded':
      // @ts-ignore
      await successCB(event.data.object.metadata);
      return;
    default:
      return;
  }
}

export function getStripeEvent(e: any, header: string) {
  try {
    return stripe.webhooks.constructEvent(e, header, Config.STRIPE_ENDPOINT_SECRET);
  } catch (err) {
    return null;
  }
}

function paymentAmount(a: number): number {
  return Math.ceil(a * 100 * 1.03);
}
