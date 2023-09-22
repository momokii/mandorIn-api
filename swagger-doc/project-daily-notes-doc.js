// * GET /projects/daily-notes/workers
/**
 * @swagger
 * /projects/daily-notes/workers:
 *   get:
 *     summary: Get data absensi dan catatan user workers pada sebuah project
 *     tags: [Project-DailyNotes]
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
 *         name: id_project
 *         description: ID data ingin dicari
 *       - in: query
 *         name: from_date
 *         description: Cari summary dari tanggal berapa
 *       - in: query
 *         name: to_date
 *         description: Cari summary sampai tanggal berapa
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
 *                   example: Dapatkan data keuangan
 *                 data:
 *                     type: object
 *                     properties:
 *                               project_summary:
 *                                 type: object
 *                                 properties:
 *                                   nama:
 *                                     type: string
 *                                   description:
 *                                     type: string
 *                                   pm:
 *                                     type: object
 *                                     properties:
 *                                       id_pm:
 *                                         type: string
 *                                       nama:
 *                                         type: string   
 *                               user_attendance_summary:
 *                                 type: object
 *                                 properties:
 *                                   total_work_day:
 *                                     type: number    
 *                                   total_attendance:
 *                                     type: number   
 *                                   user_attendance_percentage:
 *                                     type: number   
 *                                   total_user_notes:
 *                                     type: number          
 *                               user_daily_notes:
 *                                 type: object
 *                                 properties:
 *                                   total_data:
 *                                     type: number
 *                                   page:
 *                                     type: number
 *                                   per_page:
 *                                     type: number
 *                                   data:
 *                                     type: array
 *                                     items:
 *                                       type: object
 *                                       properties:
 *                                         date:
 *                                           type: string
 *                                         id_user:
 *                                           type: string
 *                                         attendances: 
 *                                           type: boolean
 *                                         attendances_time:
 *                                           type: string     
 *                                         worker_note:
 *                                           type: string     
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





// * GET /projects/daily-notes/finances
/**
 * @swagger
 * /projects/daily-notes/finances:
 *   get:
 *     summary: Get data keuangan dari sebuah project
 *     tags: [Project-DailyNotes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id_project
 *         description: ID data ingin dicari
 *       - in: query
 *         name: from_date
 *         description: Cari summary dari tanggal berapa
 *       - in: query
 *         name: to_date
 *         description: Cari summary sampai tanggal berapa
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
 *                   example: Dapatkan data keuangan
 *                 data:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                               start_date:
 *                                 type: string
 *                               end_date:
 *                                 type: string
 *                               daily_data:
 *                                 type: object
 *                                 properties:
 *                                   date:
 *                                     type: string
 *                                   is_extra_day:
 *                                     type: boolean
 *                                   incomes:
 *                                     type: object
 *                                     properties:
 *                                       data:
 *                                         type: string
 *                                       total:
 *                                         type: number
 *                                       file:
 *                                         type: string    
 *                                   expenses:
 *                                     type: object
 *                                     properties:
 *                                       data:
 *                                         type: string
 *                                       total:
 *                                         type: number   
 *                                       file:
 *                                         type: string   
 *                               total_incomes:
 *                                 type: number      
 *                               total_expenses:
 *                                 type: number      
 *                               total:
 *                                 type: number      
 *       '400':
 *         description: Bad Request
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





// * GET /projects/daily-notes
/**
 * @swagger
 * /projects/daily-notes:
 *   get:
 *     summary: Get data daily-notes dari sebuah project
 *     tags: [Project-DailyNotes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id_project
 *         description: ID data ingin dicari
 *       - in: query
 *         name: page
 *         description: Ambil halaman nomor berapa
 *       - in: query
 *         name: size
 *         description: Satu halaman akan ada berapa data
 *       - in: query
 *         name: today
 *         description: Set "true" untuk hanya dapatkan data hari ini
 *       - in: query
 *         name: date
 *         description: Set dengan format "yyyy-MM-dd" dan cari tanggal sesuai
 *       - in: query
 *         name: from_date
 *         description: Cari daily-notes dari tanggal berapa
 *       - in: query
 *         name: to_date
 *         description: Cari daily-notes sampai tanggal berapa
 *
 *     responses:
 *       '200_all_or_with_from_to_date':
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   example: false
 *                 message:
 *                   example: Dapatkan data daily-notes
 *                 data:
 *                     type: object
 *                     properties:
 *                                   total_data:
 *                                     type: number
 *                                   page:
 *                                     type: number
 *                                   per_page:
 *                                     type: number
 *                                   daily_notes:
 *                                     type: array
 *                                     items:
 *                                       type: object
 *                                       properties:
 *                                         _id:
 *                                           type: string
 *                                         is_extra_day:
 *                                           type: boolean
 *                                         daily_attendances:
 *                                           type: boolean
 *                                         daily_confirmation:
 *                                           type: boolean
 *                                         date:
 *                                           type: string  
 *                                         note_tomorrow:
 *                                           type: string
 *                                         incomes:
 *                                           type: object
 *                                           properties:
 *                                             data:
 *                                               type: string
 *                                             total:
 *                                               type: number
 *                                             file:
 *                                               type: string     
 *                                         expenses:
 *                                           type: object
 *                                           properties:
 *                                             data:
 *                                               type: string
 *                                             total:
 *                                               type: number  
 *                                             file:
 *                                               type: string 
 *                                         workers_notes:
 *                                           type: array
 *                                           items:
 *                                             type: object 
 *                                             properties:
 *                                               id_user:
 *                                                 type: string
 *                                               data:
 *                                                 type: string
 *                                               _id:
 *                                                 type: string 
 *                                         attendances:
 *                                           type: array
 *                                           items:
 *                                             type: object 
 *                                             properties:
 *                                               id_user:
 *                                                 type: string
 *                                               attendances:
 *                                                 type: boolean
 *                                               _id:
 *                                                 type: string   
 *       '200_today':
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   example: false
 *                 message:
 *                   example: Dapatkan data daily-notes
 *                 data:
 *                     type: object
 *                     properties:
 *                                   _id:
 *                                     type: string
 *                                   is_extra_day:
 *                                     type: boolean  
 *                                   daily_attendances:
 *                                     type: boolean
 *                                   daily_confirmation:
 *                                     type: boolean
 *                                   date:
 *                                     type: string  
 *                                   note_tomorrow:
 *                                     type: string
 *                                   incomes:
 *                                     type: object
 *                                     properties:
 *                                       data:
 *                                         type: string
 *                                       total:
 *                                         type: number
 *                                       file:
 *                                         type: string    
 *                                   expenses:
 *                                     type: object
 *                                     properties:
 *                                       data:
 *                                         type: string
 *                                       total:
 *                                         type: number  
 *                                       file:
 *                                         type: string  
 *                                   workers_notes:
 *                                     type: array
 *                                     items:
 *                                       type: object 
 *                                       properties:
 *                                         id_user:
 *                                           type: string
 *                                         data:
 *                                           type: string
 *                                         _id:
 *                                           type: string 
 *                                   attendances:
 *                                     type: array
 *                                     items:
 *                                       type: object 
 *                                       properties:
 *                                         id_user:
 *                                           type: string
 *                                         attendances:
 *                                           type: boolean
 *                                         _id:
 *                                           type: string   
 *                                   today_note_from_yesterday:
 *                                      type: string
 *                                   weather_prediction:
 *                                      type: object 
 *                                      properties:
 *                                        _id:
 *                                          type: string
 *                                        id_project:
 *                                          type: string
 *                                        timezone:
 *                                          type: string
 *                                        elevation:
 *                                          type: number
 *                                        unit:
 *                                          type: object
 *                                          properties:
 *                                            temperature:
 *                                              type: string
 *                                            precipitation:
 *                                              type: string
 *                                        date:
 *                                          type: string
 *                                        hourly:
 *                                          type: array
 *                                          items:
 *                                            type: string
 *                                        temp_forecast:
 *                                          type: number
 *                                        precipitation_probability:
 *                                          type: number
 *                                             
 *                                        
 *
 *       '200_selected_one_date':
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   example: false
 *                 message:
 *                   example: Dapatkan data daily-notes
 *                 data:
 *                     type: object
 *                     properties:
 *                                   _id:
 *                                     type: string
 *                                   is_extra_day:
 *                                     type: boolean     
 *                                   daily_attendances:
 *                                     type: boolean
 *                                   daily_confirmation:
 *                                     type: boolean
 *                                   date:
 *                                     type: string  
 *                                   note_tomorrow:
 *                                     type: string
 *                                   incomes:
 *                                     type: object
 *                                     properties:
 *                                       data:
 *                                         type: string
 *                                       total:
 *                                         type: number
 *                                       file:
 *                                         type: string  
 *                                   expenses:
 *                                     type: object
 *                                     properties:
 *                                       data:
 *                                         type: string
 *                                       total:
 *                                         type: number 
 *                                       file:
 *                                         type: string    
 *                                   workers_notes:
 *                                     type: array
 *                                     items:
 *                                       type: object 
 *                                       properties:
 *                                         id_user:
 *                                           type: string
 *                                         data:
 *                                           type: string
 *                                         _id:
 *                                           type: string 
 *                                   attendances:
 *                                     type: array
 *                                     items:
 *                                       type: object 
 *                                       properties:
 *                                         id_user:
 *                                           type: string
 *                                         attendances:
 *                                           type: boolean
 *                                         _id:
 *                                           type: string    
 * 
 *       '400':
 *         description: Bad Request
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





// * POST /projects/daily-notes/workers/delete
/**
 * @swagger
 * /projects/daily-notes/workers/delete:
 *   post:
 *     summary: Hapus data daily notes user
 *     tags: [Project-DailyNotes]
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
 *                   example: Berhasil hapus data daily-notes user
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





// * POST /projects/daily-notes/workers
/**
 * @swagger
 * /projects/daily-notes/workers:
 *   post:
 *     summary: Post catatan harian oleh workers
 *     tags: [Project-DailyNotes]
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
 *               data:
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
 *                   example: Berhasil update workers note
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





// * POST /projects/daily-notes/attendances/confirm
/**
 * @swagger
 * /projects/daily-notes/attendances/confirm:
 *   post:
 *     summary: Post Konfirmasi absen harian
 *     tags: [Project-DailyNotes]
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
 *                   example: Berhasil Update Konfirmasi absen harian
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





// * POST /projects/daily-notes/attendances
/**
 * @swagger
 * /projects/daily-notes/attendances:
 *   post:
 *     summary: Post Konfirmasi absen harian oleh workers
 *     tags: [Project-DailyNotes]
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
 *                   example: User {username} berhasil absen untuk hari {tanggal} - {waktu}
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





// * POST /projects/daily-notes/tomorrow
/**
 * @swagger
 * /projects/daily-notes/tomorrow:
 *   post:
 *     summary: Post catatan dari project untuk hari besok
 *     tags: [Project-DailyNotes]
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
 *               data:
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
 *                   example: Berhasil ubah data note untuk hari besok
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





// * POST /projects/daily-notes/confirm
/**
 * @swagger
 * /projects/daily-notes/confirm:
 *   post:
 *     summary: Post konfirmasi daily notes
 *     tags: [Project-DailyNotes]
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
 *                   example: Berhasil ubah status daily notes
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




// * POST /projects/daily-notes/:finance/delete
/**
 * @swagger
 * /projects/daily-notes/{finance}/delete:
 *   post:
 *     summary: Delete daily-notes data
 *     tags: [Project-DailyNotes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: finance
 *         description: sesuaikan dengan data ingin di post "incomes" / "expenses"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_project:
 *                 type: string
 *               file_only:
 *                 type: boolean
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
 *                   example: Berhasil hapus data daily notes
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





// * POST /projects/daily-notes/:finance
/**
 * @swagger
 * /projects/daily-notes/{finance}:
 *   post:
 *     summary: Post incomes/ expenses pada daily notes
 *     tags: [Project-DailyNotes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: finance
 *         description: sesuaikan dengan data ingin di post "incomes" / "expenses"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id_project:
 *                 type: string
 *               data:
 *                 type: string
 *               total:
 *                 type: number
 *               file:
 *                 type: file  
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
 *                   example: Berhasil tambah data baru
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





// * POST /projects/daily-notes
/**
 * @swagger
 * /projects/daily-notes:
 *   post:
 *     summary: Post daily-notes baru
 *     tags: [Project-DailyNotes]
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
 *                   example: Berhasil buat daily notes baru
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