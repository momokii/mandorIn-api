// TODO dokumentasi belum lengkap/ sesuai
// * GET /projects/history
/**
 * @swagger
 * /projects/history:
 *   get:
 *     summary: Get semua data history project yang pernah dikerjakan sesuai role
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Ambil halaman nomor berapa
 *       - in: query
 *         name: size
 *         description: Satu halaman akan ada berapa data
 *       - in: query
 *         name: search
 *         description: Kata kunci untuk cari project berdasarkan nama project
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
 *                   example: Data project
 *                 data:
 *                   type: object
 *                   properties:
 *                       total_data:
 *                         type: number
 *                       page:
 *                         type: number
 *                       per_page:
 *                         type: number
 *                       projects:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                               id:
 *                                 type: string
 *                               nama:
 *                                 type: string
 *                               description:
 *                                 type: string
 *                               target:
 *                                 type: string
 *                               start_project:
 *                                 example: 2020-01-12
 *                               end_target_project:
 *                                 example: 20221-10-31
 *                               day_work_start:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: number
 *                                   name:
 *                                     type: string
 *                               day_work_last:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: number
 *                                   name:
 *                                     type: string
 *                               workhour:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: string
 *                                   jam_masuk:
 *                                     example: 08:00
 *                                   jam_selesai:
 *                                     example: 17:00
 *                                   jam_istirahat_mulai:
 *                                     example: 12:00
 *                                   jam_istirahat_selesai:
 *                                     example: 13:00
 *                               long:
 *                                 type: string
 *                               lat:
 *                                 type: string
 *                               pm:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: string
 *                                   nama:
 *                                     type: string
 *                               on_progress:
 *                                 type: boolean
 *                               on_track:
 *                                 type: boolean
 *                               workers:
 *                                 type: array
 *                                 items:
 *                                   type: string
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





// * GET /projects/:id_project
/**
 * @swagger
 * /projects/{id_project}:
 *   get:
 *     summary: Get satu data project - selain superadmin - admin (hanya bisa get project yang sedang dikerjakan) dan user hanya bisa get data project yang sedang terlibat
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_project
 *         description: ID data ingin dicari
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
 *                   example: Dapatkan satu data project
 *                 data:
 *                     type: object
 *                     properties:
 *                               id:
 *                                 type: string
 *                               nama:
 *                                 type: string
 *                               description:
 *                                 type: string
 *                               target:
 *                                 type: string
 *                               start_project:
 *                                 example: 2020-01-12
 *                               end_target_project:
 *                                 example: 20221-10-31
 *                               day_work_start:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: number
 *                                   name:
 *                                     type: string
 *                               day_work_last:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: number
 *                                   name:
 *                                     type: string
 *                               workhour:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: string
 *                                   jam_masuk:
 *                                     example: 08:00
 *                                   jam_selesai:
 *                                     example: 17:00
 *                                   jam_istirahat_mulai:
 *                                     example: 12:00
 *                                   jam_istirahat_selesai:
 *                                     example: 13:00
 *                               long:
 *                                 type: string
 *                               lat:
 *                                 type: string
 *                               pm:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: string
 *                                   nama:
 *                                     type: string
 *                               on_progress:
 *                                 type: boolean
 *                               on_track:
 *                                 type: boolean
 *                               project_summary:
 *                                 type: object
 *                                 properties:
 *                                   total_length_project_target:
 *                                     type: number   
 *                                   total_day_from_start_now:
 *                                     type: number   
 *                                   total_work_day_now:
 *                                     type: number   
 *                                   total_non_work_day:
 *                                     type: number    
 *                                   total_extra_day_work:
 *                                     type: number     
 *                               workers:
 *                                 type: array
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                     id:
 *                                       type: string
 *                                     nama:
 *                                       type: string
 *                               daily_notes:
 *                                 type: array
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                     incomes:
 *                                       type: object
 *                                       properties:
 *                                         data:
 *                                           type: string
 *                                         total:
 *                                           type: number
 *                                         file:
 *                                           type: string   
 *                                     expenses:
 *                                       type: object
 *                                       properties:
 *                                         data:
 *                                           type: string
 *                                         total:
 *                                           type: number
 *                                         file:
 *                                           type: string   
 *                                     is_extra_day:
 *                                       type: boolean
 *                                     daily_confirmation:
 *                                       type: boolean
 *                                     daily_attendances:
 *                                       type: boolean  
 *                                     date:
 *                                       type: string 
 *                                     note_tomorrow:
 *                                       type: string 
 *                                     worker_notes:
 *                                       type: array
 *                                       items:
 *                                         type: object
 *                                         properties:
 *                                           id_user:
 *                                             type: string 
 *                                           data:
 *                                             type: string
 *                                     attendances:
 *                                       type: array
 *                                       items:
 *                                         type: object
 *                                         properties:
 *                                           id_user:
 *                                             type: string 
 *                                           attendances:
 *                                             type: boolean
 *                                           attendances_time:
 *                                             type: string       
 *                                                 
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
 *       '404':
 *         description: Data tidak ditemukan
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





// * GET /projects
/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get semua data project - selain superadmin - admin (hanya bisa get project yang sedang dikerjakan) dan user hanya bisa get data project yang sedang terlibat
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Ambil halaman nomor berapa
 *       - in: query
 *         name: size
 *         description: Satu halaman akan ada berapa data
 *       - in: query
 *         name: search
 *         description: Kata kunci untuk cari project berdasarkan nama project
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
 *                   example: Data project
 *                 data:
 *                   type: object
 *                   properties:
 *                       total_data:
 *                         type: number
 *                       page:
 *                         type: number
 *                       per_page:
 *                         type: number
 *                       projects:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                               id:
 *                                 type: string
 *                               nama:
 *                                 type: string
 *                               description:
 *                                 type: string
 *                               target:
 *                                 type: string
 *                               start_project:
 *                                 example: 2020-01-12
 *                               end_target_project:
 *                                 example: 20221-10-31
 *                               day_work_start:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: number
 *                                   name:
 *                                     type: string
 *                               day_work_last:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: number
 *                                   name:
 *                                     type: string
 *                               workhour:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: string
 *                                   jam_masuk:
 *                                     example: 08:00
 *                                   jam_selesai:
 *                                     example: 17:00
 *                                   jam_istirahat_mulai:
 *                                     example: 12:00
 *                                   jam_istirahat_selesai:
 *                                     example: 13:00
 *                               long:
 *                                 type: string
 *                               lat:
 *                                 type: string
 *                               pm:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: string
 *                                   nama:
 *                                     type: string
 *                               on_progress:
 *                                 type: boolean
 *                               on_track:
 *                                 type: boolean
 *                               workers:
 *                                 type: array
 *                                 items:
 *                                   type: string
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





// * POST /projects
/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Post project baru - superadmin only
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *               deskripsi:
 *                 type: string
 *               target:
 *                 type: string
 *               start_project:
 *                 type: string
 *                 example: 2023-10-15
 *               end_target_project:
 *                 type: string
 *                 example: 2023-12-31
 *               longitude:
 *                 type: number
 *                 example: -74.0060
 *               latitude:
 *                 type: number
 *                 example: 40.7128
 *               id_workhour:
 *                 type: number
 *               id_day_mulai:
 *                 type: number
 *               id_day_selesai:
 *                 type: number
 *               id_pm:
 *                 type: string
 *               id_users:
 *                 type: array
 *                 items:
 *                   type: string
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
 *                   example: Berhasil tambah project baru
 *
 *       '400':
 *         description: Proses input data baru gagal
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
 *         description: Akun tidak punya akses
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





// * PATCH /projects/done
/**
 * @swagger
 * /projects/done:
 *   patch:
 *     summary: Ubah status proyek menjadi telah selesai - superadmin only
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_project:
 *                 type: string
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
 *                   example: string
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
 *       '404':
 *         description: Data tidak ditemukan
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





// * PATCH /projects
/**
 * @swagger
 * /projects:
 *   patch:
 *     summary: Edit informasi project - superadmin only
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_project:
 *                 type: string
 *               nama:
 *                 type: string
 *               description:
 *                 type: string
 *               target:
 *                 type: string
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
 *                   example: Berhasil ubah data informasi project
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
 *       '404':
 *         description: Data tidak ditemukan
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





// * DELETE /projects
/**
 * @swagger
 * /projects:
 *   delete:
 *     summary: Delete satu data project (NOT DEVELOPED) - superadmin anly
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_project:
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
 *                   example: Berhasil hapus data project
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
 *       '404':
 *         description: Data tidak ditemukan
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