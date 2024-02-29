/**
 * @swagger
 * components:
 *   schemas:
 *     messageModel:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *           description: First name and the Last name of the message
 *         email:
 *           type: string
 *           description: Email of the message
 *         message:
 *           type: string
 *           description:  of the message
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date and time when the message was created
 *       required:
 *         - fullName
 *         - email
 *         - message
 */

/**
 * @swagger
 * /api/messages/create:
 *   post:
 *     summary: Create a new message
 *     description: Creates a new message
 *     tags:
 *       -  message
 *     requestBody:
 *       description: message object to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       '201':
 *         description: A successful response, returns the newly created message
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
 *                     message:
 *                       type: object
 *       '400':
 *         description: Invalid email format
 *       '409':
 *         description: Email already exists
 *       '500':
 *         description: Unexpected error
 */

// =====================get all=========================

/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Get all messages
 *     description: Retrieve a list of all messages
 *     tags:
 *       - message
 *     responses:
 *       '200':
 *         description: A list of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       '500':
 *         description: Unexpected error
 */
// =============================update messages=========================
/**
 * @swagger
 *
 * /api/messages/{id}:
 *   put:
 *     summary: Update message
 *     description: Update message with the given ID.
 *     tags: [message]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the message to update
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: message
 *         description: The message object to update
 *         required: true
 *     responses:
 *       200:
 *         description: The updated message
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

// ======================delete========================

/**
 * @swagger
 * /api/messages/{id}:
 *   delete:
 *     summary: Delete message by ID
 *     description: Deletes message based on their ID. Only the message who owns the account can delete their account.
 *     tags: [message]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the message to delete
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               messageId:
 *                 type: string
 *                 description: The ID of the message making the request
 *             example:
 *               messageId: 1234567890
 *     responses:
 *       '200':
 *         description: message successfully deleted
 *       '401':
 *         description: Only the message who owns the account can delete their account
 *       '404':
 *         description: message not found
 */

/**
 * @swagger
 * /api/messages/{id}:
 *   get:
 *     summary: Get messages item by ID
 *     tags: [message]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the messages item to retrieve
 *     responses:
 *       200:
 *         description: Returns the messages item with the specified ID
 *         schema:
 *           $ref: '#/definitions/messages'
 *       404:
 *         description: messages item not found
 *       500:
 *         description: Internal server error
 */
