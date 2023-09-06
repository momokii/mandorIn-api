// * GET /users/self
/**
 * @swagger
 * /users/self:
 *   get:
 *     summary: Get data user login
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       '200_user':
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   example: false
 *                 message:
 *                   example: Dapatkan data user
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     nama:
 *                       type: string
 *                     id_role:
 *                       type: number
 *                     role:
 *                       type: string
 *                     id_project:
 *                       type: string
 *       '200_admin':
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   example: false
 *                 message:
 *                   example: Dapatkan data user
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     nama:
 *                       type: string
 *                     id_role:
 *                       type: number
 *                     role:
 *                       type: string
 *                     projects:
 *                       type: array
 *                       items:
 *                         id_project:
 *                           type: string
 *       '200_superadmin':
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   example: false
 *                 message:
 *                   example: Dapatkan data user
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     nama:
 *                       type: string
 *                     id_role:
 *                       type: number
 *                     role:
 *                       type: string
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





// * GET /users/{username}
/**
 * @swagger
 * /users/{username}:
 *   get:
 *     summary: Get satu data user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: Username user yang dicari
 *
 *     responses:
 *       '200_user':
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   example: false
 *                 message:
 *                   example: Dapatkan data user
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     nama:
 *                       type: string
 *                     id_role:
 *                       type: number
 *                     role:
 *                       type: string
 *                     id_project:
 *                       type: string
 *       '200_admin':
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   example: false
 *                 message:
 *                   example: Dapatkan data user
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     nama:
 *                       type: string
 *                     id_role:
 *                       type: number
 *                     role:
 *                       type: string
 *                     projects:
 *                       type: array
 *                       items:
 *                         id_project:
 *                           type: string
 *       '200_superadmin':
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   example: false
 *                 message:
 *                   example: Dapatkan data user
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     nama:
 *                       type: string
 *                     id_role:
 *                       type: number
 *                     role:
 *                       type: string
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





// * GET /users
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get semua data akun user - superadmin only
 *     tags: [User]
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
 *         name: free
 *         description: Set "true" untuk hanya tampilkan pekerja yang sedang free (tidak terlibat dalam proyek)
 *       - in: query
 *         name: user
 *         description: Set "true" untuk tampilkan hanya semua data user (pekerja) baik terlibat/tidak pada sebuah proyek
 *       - in: query
 *         name: pm
 *         description: Set "true" untuk hanya tampilkan user "admin" (project manager) saja -> dimana PM bisa mengatur > 1 proyek
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
 *                   example: Dapatkan data akun
 *                 data:
 *                   type: object
 *                   properties:
 *                     total_data:
 *                       type: number
 *                     page:
 *                       type: number
 *                     per_page:
 *                       type: number
 *                     akun:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           username:
 *                             type: string
 *                           nama:
 *                             type: string
 *                           id_role:
 *                             type: number
 *                           role:
 *                             type: string
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





// * POST /users
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Buat akun baru - superadmin only
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               nama:
 *                 type: string
 *               id_role:
 *                 type: number
 *                 example: 3
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
 *                   example: Sukses Buat Akun Baru
 *                 data:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *       '400':
 *         description: Kesalahan pemrosesan buat user baru
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   example: true
 *                 message:
 *                   type: string
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





// * PATCH /users/password
/**
 * @swagger
 * /users/password:
 *   patch:
 *     summary: Edit password akun user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_user:
 *                 type: string
 *               password:
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
 *                   example: Sukses ubah password akun {username}
 *       '400':
 *         description: Kesalahan pemrosesan edit password user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   example: true
 *                 message:
 *                   type: string
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





// * PATCH /users
/**
 * @swagger
 * /users:
 *   patch:
 *     summary: Edit info akun
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_user:
 *                 type: string
 *               nama:
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
 *                   example: Berhasi edit informasi akun
 *       '400':
 *         description: Kesalahan pemrosesan edit info user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   example: true
 *                 message:
 *                   type: string
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





// * DELETE /users
/**
 * @swagger
 * /users:
 *   delete:
 *     summary: Delete akun lain - superadmin only
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_user:
 *                 type: string
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
 *                   example: Berhasil hapus akun {username}
 *       '400':
 *         description: Kesalahan pemrosesan delete user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   example: true
 *                 message:
 *                   type: string
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