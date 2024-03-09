/**
 * @swagger
 * components:
 *   schemas:
 *     subscribersModel:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: Email of the subscriber
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date and time when the subscriber was created
 *       required:
 *         - email
 */

/**
 * @swagger
 * /api/subscribe/create:
 *   post:
 *     summary: Create a new subscribe
 *     description: Creates a new subscriber
 *     tags:
 *       -  subscribers
 *     requestBody:
 *       description: subscriber object to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       '201':
 *         description: A successful response, returns the newly created subscriber
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     subscriber:
 *                       type: object
 *       '400':
 *         description: Invalid email format
 *       '500':
 *         description: Unexpected error
 */
// =====================get all=========================

/**
 * @swagger
 * /api/subscribe/:
 *   get:
 *     summary: Get all subscribers
 *     description: Retrieve a list of all subscribers
 *     tags:
 *       - subscribers
 *     responses:
 *       '200':
 *         description: A list of subscribers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       '500':
 *         description: Unexpected error
 */
