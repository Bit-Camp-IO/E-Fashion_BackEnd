import { Router } from 'express';
import controller from './brand.controller';

const router = Router();

/**
 * @openapi
 *   /api/brand/list:
 *     get:
 *       tags:
 *        - Brands
 *       summary: Get a list of brands
 *       description: Retrieve a list of BrandResult objects with their details.
 *       responses:
 *         '200':
 *           description: A list of BrandResult objects
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/BrandResult'
 */
router.get('/list', controller.getList);

export default router;

/**
 * @openapi
 * components:
 *   schemas:
 *     BrandResult:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the brand
 *         name:
 *           type: string
 *           description: The name of the brand
 *         description:
 *           type: string
 *           description: The description of the brand
 *         logo:
 *           type: string
 *           description: The URL of the brand's logo
 *         link:
 *           type: string
 *           description: The link associated with the brand
 */
