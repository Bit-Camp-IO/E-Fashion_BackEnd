import { Router } from 'express';
import controller from './user.controller';
import cartController from './cart.controller';
import { isAuth } from '@server/middleware/isAuth';
import { UplaodProfilePic } from '@server/middleware/upload';
import userController from './user.controller';

const router = Router();

/**
 * @openapi
 * /api/user/me:
 *   get:
 *     tags:
 *       - User
 *     summary: User Data
 *     description: Returns user data if they are logged in.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get('/me', isAuth, controller.getMe);

/**
 * @openapi
 * /api/user/me/edit:
 *   patch:
 *     tags:
 *       - User
 *     summary: Update User
 *     description: Update user data
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:
 *           $ref: '#/components/schemas/EditUserData'
 *     responses:
 *       200:
 *         description: Successful operation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.patch('/me/edit', isAuth, controller.editMe);

/**
 * @openapi
 * /api/user/profile-image:
 *   post:
 *     tags:
 *       - User
 *     summary: Upload Profile Image
 *     description: Uploads a profile image for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile image uploaded successfully.
 */
router.post('/profile-image', isAuth, UplaodProfilePic(), controller.updateProfile);

/**
 * @swagger
 * /api/user/favorites:
 *   post:
 *     tags:
 *       - Favorites
 *     summary: Add to Favorites
 *     description: Adds a product to the user's favorites list.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: Product Id
 *             required:
 *               - id
 *     responses:
 *       '200':
 *         description: Product added to favorites successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FavItem'
 *   delete:
 *     tags:
 *       - Favorites
 *     summary: Delete From Favorites
 *     description: Delete a product from the user's favorites list.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: Product Id
 *             required:
 *               - id
 *     responses:
 *       '204':
 *         description: Product deleted from favorites successfully.
 *   get:
 *     tags:
 *       - Favorites
 *     summary: Get Favorites List
 *     description: Get all products in user's favorites list.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Products in favorites list.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FavItem'
 */
router.post('/favorites', isAuth, controller.addToFav);
router.delete('/favorites', isAuth, controller.removeFav);
router.get('/favorites', isAuth, controller.getMyFav);

/**
 * @openapi
 * /api/user/cart:
 *   post:
 *     tags:
 *       - Cart
 *     summary: Add to Cart
 *     description: Adds a product to the user's cart.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartItemData'
 *     responses:
 *       '200':
 *         description: Product added to cart successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResult'
 *   delete:
 *     tags:
 *       - Cart
 *     summary: Remove from Cart
 *     description: Removes a product from the user's cart.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: string
 *            required:
 *              - id
 *     responses:
 *       '204':
 *         description: Product removed from cart successfully.
 *   patch:
 *     tags:
 *       - Cart
 *     summary: Edit product quantity in Cart
 *     description: Edit product quantity in the user's cart.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               quantity:
 *                 type: number
 *             required:
 *              - id
 *              - quantity
 *     responses:
 *       '200':
 *         description: Product quantity edited in cart successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResult'
 *   get:
 *     tags:
 *       - Cart
 *     summary: Get products in Cart
 *     description: Get all Products in the user's cart.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Products List in cart successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResult'
 */
router.post('/cart', isAuth, cartController.addToCart);
router.delete('/cart', isAuth, cartController.removeItem);
router.get('/cart', isAuth, cartController.getMyCart);
router.patch('/cart', isAuth, cartController.editItemQ);

/**
 * @openapi
 * /api/user/address:
 *   get:
 *     tags:
 *       - User
 *     summary: Get Users Addresses
 *     description: Returns list of user's addresses if they are logged in.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation.
 *         content:
 *           application/json:
 *             schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Address'
 *   post:
 *     tags:
 *       - User
 *     summary: Add new Address
 *     description: Add new address for user addresses list.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               city:
 *                 type: string
 *                 example: cairo
 *               state:
 *                 type: string
 *                 example: cairo
 *               postalCode:
 *                 type: number
 *                 example: 15412
 *     responses:
 *       201:
 *         description: Successful operation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 */
router.get('/address', isAuth, userController.getAddresses);
router.post('/address', isAuth, userController.addAddress);

/**
 * @openapi
 * /api/user/address/{address_id}:
 *  delete:
 *    tags:
 *       - User
 *    summary: Remove Address
 *    description: Remove address for user addresses list.
 *    parameters:
 *      - name: address_id
 *        in: path
 *        description: ID of the address in url
 *        required: true
 *        type: string
 *    responses:
 *      204:
 *        description: Successful operation.
 */
router.delete('/address/:id', isAuth, controller.removeAddress);

export default router;

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 64bc9cea76944a21267274a9
 *         fullName:
 *           type: string
 *           example: Mahmoud Khaled
 *         profile:
 *           type: string
 *           example: /profile_imge.png
 *         provider:
 *           type: string
 *           example: LOCAL
 *         isVerified:
 *           type: boolean
 *           example: false
 *         settings:
 *           type: object
 *           properties:
 *            darkmode:
 *               type: string
 *               exmple: dark
 *            language:
 *               type: string
 *               exmple: en
 *            addresses:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Address'
 *     Address:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 64cc5f196c2d6e86439c8c67
 *         city:
 *           type: string
 *           example: cairo
 *         state:
 *           type: string
 *           example: cairo
 *         postalCode:
 *           type: number
 *           example: 12154
 *         isPrimary:
 *           type: boolean
 *           example: false
 *     FavItem:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         price:
 *           type: number
 *         id:
 *           type: string
 *     CartItemData:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         size:
 *           type: string
 *         color:
 *           type: string
 *         quantity:
 *           type: number
 *       required:
 *         - id
 *         - quantity
 *         - size
 *         - color
 *     CartResult:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItemData'
 *         subtotal:
 *           type: number
 *         tax:
 *           type: number
 *         total:
 *           type: number
 *         totalQuantity:
 *           type: number
 */
