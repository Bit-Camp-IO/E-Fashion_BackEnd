import { createStripeOrder } from '@/core/order';
import { getStripeEvent, stripeEventsHook } from '@/core/payment/stripe';
import express from 'express';

export function stripeWebhook(): express.RequestHandler[] {
  return [
    express.raw({ type: 'application/json' }),
    (req, res) => {
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
    },
  ];
}
