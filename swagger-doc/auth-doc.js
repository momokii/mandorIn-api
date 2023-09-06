// *! TEMPLATES DOC
// /**
//  * @swagger
//  * /:
//  *   post:
//  *     summary: a
//  *     tags: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *
//  *     responses:
//  *       '':
//  *         description:
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 errors:
//  *                   example:
//  *                 message:
//  *                   example:
//  *       '500':
//  *         description: Internal Server Error
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 errors:
//  *                   example: true
//  *                 message:
//  *                   type: string
//  *
//  *
//  */


//* ------------------------------ AUTH DOCUMENTATION ------------------------------ *//

// * /login
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login untuk semua user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 example: username1
 *               password:
 *                 example: password1
 *
 *     responses:
 *       '200':
 *         description: Sukses Login dan dapatkan token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   example: false
 *                 message:
 *                   example: Success Login
 *                 data:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     token_type:
 *                       example: Bearer
 *                     token:
 *                       type: string
 *       '400':
 *         description: Username/ Password Salah
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   example: true
 *                 message:
 *                   type: string
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   example: true
 *                 message:
 *                   type: string
 *
 *
 */





// * /logout
/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout akun user yang sedang login
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       '200':
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   example: false
 *                 message:
 *                   example: Success Logout
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   example: true
 *                 message:
 *                   type: string
 *
 *
 */