/**
 * @swagger
 * components:
 *   schemas:
 *     UserModel:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *           description: First name and the Last name of the user
 *         email:
 *           type: string
 *           description: Email of the user
 *         password:
 *           type: string
 *           description: Password of the user
 *         userRole:
 *           type: string
 *           description: Role of the user
 *           enum:
 *             - user
 *             - admin
 *           default: user
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date and time when the user was created
 *       required:
 *         - fullName
 *         - email
 *         - password
 */

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user
 *     tags:
 *       -  A user
 *     requestBody:
 *       description: User object to be created
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
 *               password:
 *                 type: string
 *     responses:
 *       '201':
 *         description: A successful response, returns the newly created user
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
 *                     user:
 *                       type: object
 *       '400':
 *         description: Invalid email format
 *       '409':
 *         description: Email already exists
 *       '500':
 *         description: Unexpected error
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Authenticate user and get a JWT token
 *     description: Authenticate user with email and password, and return a JWT token
 *     tags:
 *       - A user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: string
 *                   description: Status user
 *                 token:
 *                   type: string
 *                   description: JWT token for the authenticated user
 *       '201':
 *         description: Invalid email or password
 *       '500':
 *         description: Unexpected error
 */

// =====================get all=========================

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users
 *     tags:
 *       - A user
 *     responses:
 *       '200':
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       '500':
 *         description: Unexpected error
 */
// =============================update users=========================
/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update.
 *         schema:
 *           type: string
 *     tags:
 *       - A user
 *     requestBody:
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
 *                 format: email
 *               password:
 *                 type: string
 *               userRole:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User updated successfully.
 *       '400':
 *         description: Invalid request data.
 *       '404':
 *         description: User not found.
 *       '500':
 *         description: Internal Server Error.
 */
// ======================delete========================

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Deletes a user based on their ID. Only the user who owns the account can delete their account.
 *     tags: [A user]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to delete
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user making the request
 *             example:
 *               userId: 1234567890
 *     responses:
 *       '200':
 *         description: User successfully deleted
 *       '401':
 *         description: Only the user who owns the account can delete their account
 *       '404':
 *         description: User not found
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a users item by ID
 *     tags: [A user]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the users item to retrieve
 *     responses:
 *       200:
 *         description: Returns the users item with the specified ID
 *         schema:
 *           $ref: '#/definitions/userModel'
 *       404:
 *         description: users item not found
 *       500:
 *         description: Internal server error
 */
