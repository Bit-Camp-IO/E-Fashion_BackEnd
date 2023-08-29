import { Router } from 'express';
import controller from './category.controller';

const router = Router();

/**
 * @openapi
 * /api/category/list:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get a list of categories
 *     description: Retrieve a list of CategoryResult objects with their details.
 *     parameters:
 *      - in: query
 *        name: gender
 *        schema:
 *          type: integer
 *          minimum: 0
 *          maximum: 2
 *        description: Filter categories by gender (0 = male, 1 = female, 2 = other)
 *     responses:
 *       '200':
 *         description: A list of CategoryResult objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CategoryResult'
 */
router.get('/list', controller.getList);

/**
 * @openapi
 * /api/category/{category_id}:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get a list of categories
 *     description: Retrieve a list of CategoryResult objects with their details.
 *     parameters:
 *      - in: path
 *        name: category_id
 *        schema:
 *          type: string
 *        description: Category Id
 *     responses:
 *       '200':
 *         description: CategoryResult objects
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/CategoryResult'
 */
router.get('/:id', controller.getOne);

export default router;

/**
 * @openapi
 * components:
 *   schemas:
 *     CategoryResult:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the category
 *         name:
 *           type: string
 *           description: The name of the category
 *         description:
 *           type: string
 *           description: The description of the category
 *         imageURL:
 *           type: string
 *           description: The URL of the category's image
 *         gender:
 *           $ref: '#/components/schemas/Gender'
 *     Gender:
 *       type: number
 *       enum: [0, 1, 2]
 *       description: The gender associated with the category [0 = all, 1 = male, 2 = female]
 */
