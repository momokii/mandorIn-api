// * GET /dashboard
/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get Dashboard data
 *     tags: [Dashboard]
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
 *                   example: Data dashboard
 *                 data:
 *                     type: object
 *                     properties:
 *                       total_project:
 *                         type: number     
 *                       total_project_done:
 *                         type: number      
 *                       total_project_on_progress:
 *                         type: number      
 *                       total_user:
 *                         type: number      
 *                       total_worker:
 *                         type: number      
 *                       total_work_worker:
 *                         type: number      
 *                       total_free_worker:
 *                         type: number    
 *                       total_admin:
 *                         type: number      
 *                       total_work_admin:
 *                         type: number      
 *                       total_free_admin:
 *                         type: number  
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