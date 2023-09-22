// * GET /days
/**
 * @swagger
 * /days:
 *   get:
 *     summary: Get semua data day (hari)
 *     tags: [Days (Hari)]
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
 *                   example: Dapatkan data day (hari)
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       nama:
 *                         type: string
 *
 *       '401':
 *         description: Akun tidak punya akses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   example: true
 *                 message:
 *                   example: Akun tidak punya akses
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