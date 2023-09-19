const Multer = require('multer')
const util = require('util')

let process_file = Multer({
    storage: Multer.memoryStorage(),
}).single('file')

let processFileMiddleware = util.promisify(process_file)

module.exports = processFileMiddleware