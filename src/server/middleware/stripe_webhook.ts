import orderServicers from '@/core/order';
import { StripeMetadata, stripeEventsHook } from '@/core/payment/stripe';
import { HttpStatus } from '@server/utils/status';
import express from 'express';

function stripeMiddleware(req: express.Request, res: express.Response) {
  const signature = req.get('stripe-signature');
  if (!signature) {
    res.JSON(HttpStatus.BadRequest);
    return;
  }

  // TODO: Validate stripe request in production
  // const event = getStripeEvent(req.body, signature);
  const event = req.body;
  if (!event) {
    res.JSON(HttpStatus.BadRequest);
    return;
  }
  stripeEventsHook(event, createStripeOrder);
  res.json({ received: true });
}

async function createStripeOrder(m: StripeMetadata) {
  const order = orderServicers.orderPayment(m.collectionId ? 'collection' : 'cart', {
    userId: m.userId,
    collectionId: m.collectionId,
  });
  await order.stripe();
}

export function stripeWebhook(app: express.Express) {
  // TODO: Use express.raw middleware
  app.use('/stripe-webhook', express.json(), stripeMiddleware);
  // app.use('/stripe-webhook', express.raw({ type: 'application/json' }), stripeMiddleware);
}
