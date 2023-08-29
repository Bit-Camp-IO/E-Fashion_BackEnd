import { Router } from 'express';
import controler from './order.controller';
import { isAuth } from '@server/middleware/isAuth';

const router = Router();
/**
 * @openapi
 * paths:
 *   /api/order/cash-order:
 *     post:
 *       tags:
 *        - Order
 *       summary: Create a cash order
 *       description: Create a new order using cash payment method.
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderInput'
 *       responses:
 *         '200':
 *           description: The created OrderResult object
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/OrderResult'
 */
router.post('/cash-order', isAuth, controler.createCashOrder);
/**
 * @openapi
 * paths:
 *   /api/order:
 *     get:
 *       tags:
 *        - Order
 *       summary: Get all orders
 *       description: Retrieve a list of OrderResult objects representing all orders.
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: A list of OrderResult objects
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/OrderResult'
 */
router.get('/', isAuth, controler.getAll);
/**
 * @openapi
 * paths:
 *   /api/order/{order_id}:
 *     get:
 *       tags:
 *        - Order
 *       summary: Get an order by ID
 *       description: Retrieve an OrderResult object representing a specific order.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: order_id
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the order to retrieve
 *       responses:
 *         '200':
 *           description: The requested OrderResult object
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/OrderResult'
 */
router.get('/:id', isAuth, controler.getOne);
/**
 * @openapi
 * paths:
 *   /api/order/{order_id}:
 *     get:
 *       tags:
 *        - Order
 *       summary: Get items in an order by ID
 *       description: Retrieve an items in order.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: order_id
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the order to retrieve
 *       responses:
 *         '200':
 *           description: The requested items in order
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/ProductsList'
 */
router.get('/:id/items', isAuth, controler.getItems);
/**
 * @openapi
 * paths:
 *   /api/order/create-payment-intent:
 *     post:
 *       tags:
 *        - Order
 *       summary: Create a payment intent
 *       description: Create a payment intent for processing a payment.
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: Payment intent information
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/ProductsList'
 */
router.post('/create-payment-intent', isAuth, controler.paymentIntent);

export default router;

/**
 * @openapi
 * components:
 *   schemas:
 *     OrderInput:
 *       type: object
 *       properties:
 *         addressId:
 *           type: string
 *         phoneNumber:
 *           type: string
 *     OrderResult:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the order
 *         address:
 *           $ref: '#/components/schemas/Address'
 *         paymentMethod:
 *           type: string
 *           description: The payment method used for the order
 *         totalPrice:
 *           type: number
 *           description: The total price of the order
 *         totalQuantity:
 *           type: number
 *           description: The total quantity of items in the order
 *         price:
 *           type: number
 *           description: The base price of the order
 *         tax:
 *           type: number
 *           description: The tax applied to the order
 *     PaymentIntents:
 *       type: object
 *       properties:
 *         clientSecret:
 *           type: string
 *           description: The client secret for the payment intent
 */
