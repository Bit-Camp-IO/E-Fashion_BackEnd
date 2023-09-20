import { Router } from 'express';
import controller from './auth.controller';
import { isAuth } from '@server/middleware/isAuth';
const router = Router();

/**
 * @openapi
 * '/api/auth/login':
 *  post:
 *    tags:
 *      - Auth
 *    summary: Login user
 *    description: Create new access and refresh token
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/LoginSchema'
 *    responses:
 *      200:
 *        description: successful operation
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AuthResponse'
 *      400:
 *        description: Bad Request or invalid data
 *
 */
router.post('/login', controller.login);

/**
 * @openapi
 * '/api/auth/register':
 *  post:
 *    tags:
 *      - Auth
 *    summary: Signup user
 *    description: Create new user and return new access and refresh token
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/RegisterSchema'
 *    responses:
 *      201:
 *        description: successful operation
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AuthResponse'
 *      400:
 *        description: Bad Request or invalid data
 */
router.post('/register', controller.register);

/**
 * @openapi
 * '/api/auth/change-password':
 *  patch:
 *    tags:
 *      - Auth
 *    summary: Change user password
 *    description: Create new password
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ChangePasswordSchema'
 *    responses:
 *      204:
 *        description: successful operation
 *      400:
 *        description: Bad Request or invalid data
 *      401:
 *        description: Old password is wrong
 */
router.patch('/change-password', isAuth, controller.changePassword);

/**
 * @openapi
 * /api/auth/refresh:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Refresh access token
 *     description: Creates a new access token using a refresh token provided in the request header.
 *     parameters:
 *       - name: X-Refresh-Token
 *         in: header
 *         description: User refresh token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Successful operation
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                accessToken:
 *                  type: string
 *                  example: yJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZWI0ZGE1NmJiNDkzNTE0OGY4MGFlOSIsImlhdCI6MTY5MzE0MjQzNywiZXhwIjoxNjkzMTQzMDM3fQ.ISUfwVEIMdJeR02qtBeS8w6TKABMDNgxZoSE6myji0I1P3cS3jRTxhUr66LbIpe09cN2Z46esh2dBajss-pAPmBiYy7HTEYUuONxh_FwA2vC7VkCjPBOvMEjR3u8-JhZBgKMnRo2j6ZPODbzBolgW4NLFdwEW2Jk9U6xEVirzetNWVaCs9CeS3cEiQKhoyH9HRKDQgYADD0EABeUmKij-fLCWAIdEN966hdS8QePcWQ38FCFEPAjYLaqpGF4Q0wN62uqGrpYCeLGxmebhfJcd-AF4uOkovWLnaSsPkre5QpSr85R_I-8hTEO9EEkb2dKrY0BGWYjJw1ShDcyya3X5A
 */
router.get('/refresh', controller.refresh);

/**
 * @openapi
 * /api/auth/google:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Log in or register with a Google account
 *     description: Log in or register using a Google account.
 *     responses:
 *       200:
 *         description: Successful operation
 */
router.get('/google', controller.google);
router.get('/google/redirect', controller.googleRedirect);

/**
 * @openapi
 * '/api/auth/verify-email':
 *   get:
 *     tags:
 *       - Auth
 *     summary: Verify user email
 *     description: Send OTP Code to user email for verification.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Successful operation
 */
router.get('/verify-email', isAuth, controller.sendVerifyEmail);
/**
 * @openapi
 * '/api/auth/verify-email/{OTP}':
 *   get:
 *     tags:
 *       - Auth
 *     summary: Verify user email
 *     description: Send OTP Code to user email for verification.
 *     parameters:
 *       - in: path
 *         name: OTP
 *         required: true
 *         schema:
 *           type: string
 *         description: OTP code form email
 *     security:
 *       - bearerAuth: []
 *     responses:
 *         204:
 *           description: Successful operation
 */
router.get('/verify-email/:otp', isAuth, controller.verifyEmail);

/**
 * @openapi
 * /api/auth/forgot-password:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Forgot Password
 *     description: Send OTP Code to user email for reset his password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              email:
 *                type: string
 *                description: User email
 *     responses:
 *         204:
 *           description: Successful operation
 */
router.get('/forgot-password', controller.forgotPassword);
/**
 * @openapi
 * /api/auth/verify-password-otp:
 *  get:
 *    tags:
 *      - Auth
 *    summary: Verify otp
 *    description: Verify otp for forget password
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              email:
 *                type: string
 *                description: User email
 *              otp:
 *                type: string
 *                description: otp code
 *    responses:
 *      200:
 *        description: Sucessful operation
 *        content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              ok:
 *                type: boolean
 */
router.get('/verify-password-otp', controller.verifyPasswordOTP);
/**
 * @openapi
 * /api/auth/reset-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Reset Password
 *     description: reset user password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              email:
 *                type: string
 *                description: User email
 *              newPassword:
 *                type: string
 *                description: new Password
 *              otp:
 *                type: string
 *                description: otp code
 *     responses:
 *       204:
 *         description: Successful operation
 */
router.post('/reset-password', controller.resetPassword);

export default router;

/**
 * @openapi
 * components:
 *   schemas:
 *     AuthResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: User's ID
 *           example: 64eb4da56bb4935148f80ae9
 *         email:
 *           type: string
 *           exmple: user@example.com
 *           description: User's email address
 *         fullName:
 *           type: string
 *           example: Mahmoud Khaled
 *           description: User's full name
 *         phoneNumber:
 *           type: string
 *           description: User's Phone number
 *           example: 01234567899
 *         accessToken:
 *           type: string
 *           description: Access token for authentication
 *           example: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZWI0ZGE1NmJiNDkzNTE0OGY4MGFlOSIsImlhdCI6MTY5MzE0MjQzNywiZXhwIjoxNjkzMTQzMDM3fQ.ISUfwVEIMdJeR02qtBeS8w6TKABMDNgxZoSE6myji0I1P3cS3jRTxhUr66LbIpe09cN2Z46esh2dBajss-pAPmBiYy7HTEYUuONxh_FwA2vC7VkCjPBOvMEjR3u8-JhZBgKMnRo2j6ZPODbzBolgW4NLFdwEW2Jk9U6xEVirzetNWVaCs9CeS3cEiQKhoyH9HRKDQgYADD0EABeUmKij-fLCWAIdEN966hdS8QePcWQ38FCFEPAjYLaqpGF4Q0wN62uqGrpYCeLGxmebhfJcd-AF4uOkovWLnaSsPkre5QpSr85R_I-8hTEO9EEkb2dKrY0BGWYjJw1ShDcyya3X5A
 *         refreshToken:
 *           type: string
 *           description: Refresh token for token renewal
 *           example: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZWI0ZGE1NmJiNDkzNTE0OGY4MGFlOSIsImlhdCI6MTY5MzE0MjQzNywiZXhwIjoxNjk1NzM0NDM3fQ.hCADzF08g3Kroh_p-_zgwN67G1apVaWK4O0wdAcENO_UQYEuq4yk0xoE4vyl6qArln3Ih_QQXdgB59d8O9NwAcFJ2Jcrif4_q9n-PzVpGm_V1fTOAQZIIkVvUvAvDeEf0Z270LAIYYQu80Hjgir0hhzo3jQ0_NTT5nDCImIDvBQP2QN24ocj1CCeFSHF9-h7qQJJAHtcrdYj70xrYRrKyZ-vf48m13s9I3xqQDlYfGPgKPO7Llys1vI1lDRNjQOSXVZHi66Rm_-WXX86nNX9N1ez8b8ksqjVREhjXgmk_prJc6FTzNTrShBdsi0L-N2MIzH4jSHrceQ8U4qDBCYw6Q
 */
