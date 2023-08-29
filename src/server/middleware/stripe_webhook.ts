import { createStripeOrder } from '@/core/order';
import { getStripeEvent, stripeEventsHook } from '@/core/payment/stripe';
import express from 'express';

function stripeMiddleware(req: express.Request, res: express.Response) {
  const signature = req.get('stripe-signature');
  if (!signature) {
    res.sendStatus(400);
    return;
  }

  const event = getStripeEvent(req.body, signature);
  if (!event) {
    res.sendStatus(400);
    return;
  }
  stripeEventsHook(event, createStripeOrder);
  res.json({ received: true });
}

export function stripeWebhook(app: express.Express) {
  app.use('/stripe-webhook', express.raw({ type: 'application/json' }), stripeMiddleware);
}
