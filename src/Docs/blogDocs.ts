/**
 * @swagger
 * components:
 *   schemas:
 *     blogModel:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the Blog.
 *           readOnly: true
 *         title:
 *           type: string
 *           description: The title of the Blog.
 *           example: "My Blog"
 *         description:
 *           type: string
 *           description: The content of the Blog.
 *           example: "This is my Blog description."
 *         image:
 *           type: string
 *           description: The URL of the image associated with the Blog.
 *           example: "https://example.com/images/my-Blog.jpg"
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date the Blog was created.
 *           readOnly: true
 *   requestBodies:
 *     BlogRequestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the Blog.
 *                 example: "My Blog"
 *               description:
 *                 type: string
 *                 description: The content of the Blog.
 *                 example: "This is my Blog description."
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file for the Blog.
 *     UpdateBlogRequestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the Blog.
 *                 example: "My Blog"
 *               description:
 *                 type: string
 *                 description: The content of the Blog.
 *                 example: "This is my Blog description."
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The updated image file for the Blog.
 */

// -==============================create Blogs=========================

/**
 * @swagger
 * /api/blogs/create:
 *   post:
 *     summary: Create a new Blog
 *     tags: [Blogs]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Successfully created a new Blog
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 saveBlog:
 *                   type: object
 *                   $ref: '#/components/schemas/blogModel'
 *                 status:
 *                   type: string
 *       '400':
 *         description: Bad request, missing required fields
 *       '500':
 *         description: Internal server error
 */

// ===========================get all Blogs==================

/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: Get all Blogs
 *     responses:
 *       200:
 *         description: A list of all Blogs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/blogModel'
 */

// ========================one Blog=====================
/**
 * @swagger
 * /api/blogs/{id}:
 *   get:
 *     summary: Get a single Blog by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Blog to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the Blog object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/blogModel'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error, please try again later
 */

// ===================get all=====================

/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: Get all Blogs
 *     tags: [Blogs]
 *     description: Retrieve a list of all Blogs.
 *     responses:
 *       200:
 *         description: OK. Returns a list of all Blogs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The ID of the Blog.
 *                       name:
 *                         type: string
 *                         description: The name of the Blog.
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time of the Blog.
 *                       location:
 *                         type: string
 *                         description: The location of the Blog.
 *                       description:
 *                         type: string
 *                         description: A description of the Blog.
 *       500:
 *         description: Internal Server Error. Something went wrong on the server.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message describing the error.
 */

// ==================update=============================

/**
 * @swagger
 * /api/blogs/{id}:
 *   put:
 *     summary: Update an Blog by ID
 *     tags: [Blogs]
 *     description: Update an existing Blog with new data.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the Blog to update.
 *     requestBody:
 *       required: true
 *       description: The updated Blog data, including an image file.
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The updated BlogTitle of the Blog.
 *               description: 
 *                 type: string
 *                 description: The updated description of the Blog.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: An updated image file for the Blog.
 *     responses:
 *       200:
 *         description: OK. Returns the updated Blog.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the updated Blog.
 *                 name:
 *                   type: string
 *                   description: The updated name of the Blog.
 *                 date:
 *                   type: string
 *                   format: date-time
 *                   description: The updated date and time of the Blog.

 *                 description:
 *                   type: string
 *                   description: The updated description of the Blog.
 *                 image:
 *                   type: string
 *                   description: The URL of the updated image file for the Blog.
 *       500:
 *         description: Internal Server Error. Something went wrong on the server.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message describing the error.
 */

// ======================delete===========================

/**
 * @swagger
 * /api/blogs/{id}:
 *   delete:
 *     summary: Delete an Blog by ID
 *     tags: [Blogs]
 *     description: Delete an existing Blog by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the Blog to delete.
 *     responses:
 *       200:
 *         description: OK. Returns a success message indicating the Blog was deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the Blog was deleted.
 *       500:
 *         description: Internal Server Error. Something went wrong on the server.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message describing the error.
 */
