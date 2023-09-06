// * GET /workhours/id_workhour
/**
 * @swagger
 * /workhours/{id_workhour}:
 *   get:
 *     summary: Get satu data workhour (Waktu Kerja)
 *     tags: [Waktu Kerja]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_workhour
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
 *                   example: Dapatkan satu data workhour
 *                 data:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       jam_masuk:
 *                         example: 08:00
 *                       jam_selesai:
 *                         example: 18:00
 *                       jam_istirahat_mulai:
 *                         example: 12:00
 *                       jam_istirahat_selesai:
 *                         example: 13:00
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





// * GET /workhours
/**
 * @swagger
 * /workhours:
 *   get:
 *     summary: Get semua data workhour (Waktu Kerja)
 *     tags: [Waktu Kerja]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Ambil halaman nomor berapa
 *       - in: query
 *         name: size
 *         description: Satu halaman akan ada berapa data
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
 *                   example: Data waktu kerja
 *                 data:
 *                   type: object
 *                   properties:
 *                       total_data:
 *                         type: number
 *                       page:
 *                         type: number
 *                       per_page:
 *                         type: number
 *                       workhours:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                              id:
 *                                type: string
 *                              jam_masuk:
 *                                example: 08:00
 *                              jam_selesai:
 *                                example: 18:00
 *                              jam_istirahat_mulai:
 *                                example: 12:00
 *                              jam_istirahat_selesai:
 *                                example: 13:00
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





// * POST /workhours
/**
 * @swagger
 * /workhours:
 *   post:
 *     summary: Post informasi baru workhour (Waktu Kerja)
 *     tags: [Waktu Kerja]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mulai:
 *                 type: string
 *                 example: 08:00
 *               selesai:
 *                 type: string
 *                 example: 17:00
 *               istirahat_mulai:
 *                 type: string
 *                 example: 12:00
 *               istirahat_selesai:
 *                 type: string
 *                 example: 13:00
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
 *                   example: Berhasil tambah data informasi waktu kerja
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





// * PATCH /workhours
/**
 * @swagger
 * /workhours:
 *   patch:
 *     summary: Edit informasi workhour (Waktu Kerja)
 *     tags: [Waktu Kerja]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_workhour:
 *                 type: string
 *               mulai:
 *                 type: string
 *                 example: 08:00
 *               selesai:
 *                 type: string
 *                 example: 17:00
 *               istirahat_mulai:
 *                 type: string
 *                 example: 12:00
 *               istirahat_selesai:
 *                 type: string
 *                 example: 13:00
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
 *                   example: Berhasil ubah data informasi waktu kerja
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





// * DELETE /workhours
/**
 * @swagger
 * /workhours:
 *   delete:
 *     summary: Delete satu data informasi workhour (Waktu Kerja)
 *     tags: [Waktu Kerja]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_workhour:
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
 *                   example: Berhasil hapus data waktu kerja
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