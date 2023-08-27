import { Router } from 'express';
import controller from './product.controller';
import { isAuth } from '@server/middleware/isAuth';

const router = Router();

/**
 * @openapi
 * /api/product/list:
 *  get:
 *    tags:
 *      - Products
 *    summary: Products List
 *    description: Endpoint for get back list with products with filter, sort or search.
 *    parameters:
 *      - in: query
 *        name: page
 *        schema:
 *          type: number
 *        default: 1
 *        description: Number of page
 *      - in: query
 *        name: limit
 *        schema:
 *          type: number
 *        default: 20
 *        description: Number of returned products
 *      - in: query
 *        name: max-price
 *        schema:
 *          type: number
 *        description: Set max price limit
 *      - in: query
 *        name: min-price
 *        schema:
 *          type: number
 *        description: Set min price limit
 *      - in: query
 *        name: gender
 *        schema:
 *          type: number
 *        description: Filter with gender (0 = all | 1 = male | 2 = female)
 *      - in: query
 *        name: categories
 *        schema:
 *          type: string
 *        description: Filter with Categories Ids e.x. categories=1,2,3
 *      - in: query
 *        name: brands
 *        schema:
 *          type: string
 *        description: Filter with Brands Ids e.x. brands=1,2,3
 *      - in: query
 *        name: discount
 *        schema:
 *          type: boolean
 *        description: Return products with discount
 *      - in: query
 *        name: search
 *        schema:
 *          type: string
 *        description: Search with name of products
 *      - in: query
 *        name: sort-price
 *        schema:
 *          type: string
 *        description: Sort with price (1, -1, asc, desc)
 *      - in: query
 *        name: sort-new
 *        schema:
 *          type: string
 *        description: Sort with the most recent product (1, -1, asc, desc)
 *      - in: query
 *        name: sort-popularity
 *        schema:
 *          type: string
 *        description: Sort with rate (1, -1, asc, desc)
 *    responses:
 *      200:
 *        description: successful operation
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ProductsList'
 */
router.get('/list', controller.getList);

/**
 * @openapi
 * /api/product/{product_id}:
 *  get:
 *    tags:
 *      - Products
 *    summary: Product Dat
 *    description: Get all product data
 *    parameters:
 *      - name: product_id
 *        in: path
 *        description: ID of the product in url
 *        required: true
 *        type: string
 *    responses:
 *      200:
 *        description: successful operation
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 */
router.get('/:id', controller.getOne);

/**
 * @openapi
 * /api/product/list/info:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get information about products
 *     description: Retrieves product information available in the database, such as minimum price, maximum price, colors, and sizes.
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 minPrice:
 *                   type: number
 *                   example: 10
 *                 maxPrice:
 *                   type: number
 *                   example: 1000
 *                 colors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: red
 *                       hex:
 *                         type: string
 *                         example: "#ff0000"
 *                 sizes:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example:
 *                      - s
 *                      - m
 *                      - l
 */
router.get('/list/info', controller.listInfo);

router.get('/:id/rate', controller.listReviews);
router.post('/:id/rate', isAuth, controller.addReview);
router.delete('/rate', isAuth, controller.removeReview);

export default router;

/**
 * @openapi
 * components:
 *   schemas:
 *     ProductsList:
 *       type: array
 *       items:
 *        type: object
 *        properties:
 *         id:
 *           type: string
 *           example: 64bc9cea76944a21267274a9
 *         title:
 *           type: string
 *           example: Men's Slim-Fit Jeans
 *         imageUrl:
 *           type: string
 *           example: /Men's_Slim-Fit_Jeans.png
 *         price:
 *           type: number
 *           example: 18.99
 *         oldPrice:
 *           type: number
 *           example: 20.99
 *         discount:
 *           type: number
 *           example: 2
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 64bc9cea76944a21267274a9
 *         title:
 *           type: string
 *           example: Men's Slim-Fit Jeans
 *         imagesUrl:
 *           type: array
 *           items:
 *             type: string
 *             example:
 *              - /Men's_Slim-Fit_Jeans.png
 *              - /Men's_Slim-Fit_Jeans2.png
 *              - /Men's_Slim-Fit_Jeans3.png
 *         price:
 *           type: number
 *           example: 18.99
 *         oldPrice:
 *           type: number
 *           example: 20.99
 *         discount:
 *           type: number
 *           example: 2
 *         colors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: red
 *               hex:
 *                 type: string
 *                 example: "#ff0000"
 *         sizes:
 *           type: array
 *           items:
 *             type: string
 *             example:
 *               - s
 *               - m
 *               - l
 *         isNew:
 *           type: boolean
 *           example: true
 *         available:
 *           type: boolean
 *           example: true
 *         rate:
 *           type: number
 *           example: 4
 *         brand:
 *           type: string
 *           example: Zara
 *         description:
 *           type: string
 *           example: These slim-fit jeans are perfect for a casual day out. They feature a classic five-pocket design and are made from stretch denim for added comfort. Available in multiple washes
 *         gender:
 *           type: number
 *           example: 1
 *           description: Gender is number from 0 to 2 => man = 1 | women = 2 | all = 0
 */
