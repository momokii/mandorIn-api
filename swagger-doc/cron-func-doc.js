// * GET /cron-funcs
/**
 * @swagger
 * /cron-funcs:
 *   get:
 *     summary: Get data cron function
 *     tags: [Cron Function]
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
 *                   example: Get data cron function
 *                 data:
 *                   type: object
 *                   properties:
 *                       cron_id:
 *                         type: string
 *                       cron_status:
 *                         type: boolean
 *                       cron_interval_minute:
 *                         type: number
 *
 *       '401':
 *         description: Account doesn't have access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   example: true
 *                 message:
 *                   example: Account doesn't have access
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





// * POST /cron-funcs/switch
/**
 * @swagger
 * /cron-funcs/switch:
 *   post:
 *     summary: Change cron function status to on or off
 *     tags: [Cron Function]
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
 *                   example: Success change cron function status
 *
 *       '401':
 *         description: Account doesn't have access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   example: true
 *                 message:
 *                   example: Account doesn't have access
 *
 *       '404':
 *         description: Data not found
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





// * PATCH /cron-funcs/intervals
/**
 * @swagger
 * /cron-funcs/intervals:
 *   patch:
 *     summary: Update or change cron function intervals (minute interval)
 *     tags: [Cron Function]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               new_interval:
 *                 type: number
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
 *                   example: Success edit cron function intervals
 *
 *       '400':
 *         description: Data inputed is not valid
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
 *       '401':
 *         description: Account doesn't have access
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