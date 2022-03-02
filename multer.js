const multer = require('multer')

var storage = multer.diskStorage({
    filename: (req, file, done) => {
        done(null, file.originalname)
    }
})

module.exports = multer({storage: storage})