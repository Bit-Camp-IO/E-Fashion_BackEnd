import { getStripeEvent } from '@/core/payment/stripe';
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
      // console.log(req.body);
      const event = getStripeEvent(req.body, signature);
      if (!event) {
        res.sendStatus(400);
        return;
      }
      console.log(event?.data);
      console.log('#'.repeat(30), event.type, '#'.repeat(30));
      res.json({ received: true });
    },
  ];
}
