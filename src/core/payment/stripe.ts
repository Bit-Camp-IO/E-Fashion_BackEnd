import Config from '@/config';
import { AsyncSafeResult } from '@type/common';
import Stripe from 'stripe';

const stripe = new Stripe(Config.STRIPE_PRIVATE_KEY, {
  apiVersion: '2022-11-15',
});

type StripeMetadata = {
  orderId: string;
  userId: string;
  addressId: string;
};

export async function createCheckoutSessionURL(d: StripeMetadata): AsyncSafeResult<string> {
  try {
    const payment = await stripe.paymentIntents.create({
      amount: paymentAmount(1000),
      currency: 'EGP',
      payment_method_types: ['card'],
      metadata: {
        order_id: d.orderId,
        user_id: d.userId,
        address_id: d.addressId,
      },
    });
    if (!payment.client_secret) throw new Error();
    return { error: null, result: payment.client_secret };
  } catch (error) {
    return { error, result: null };
  }
}

export function getStripeEvent(e: any, header: string) {
  try {
    return stripe.webhooks.constructEvent(e, header, Config.STRIPE_ENDPOINT_SECRET);
  } catch (err) {
    console.log(err);
    return null;
  }
}

function paymentAmount(a: number): number {
  return a * 100 * 1.03;
}
