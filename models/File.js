const mongoose = require('mongoose')

const File = mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    file: {
        type: String,
        required: true
    }
})

mongoose.model('files', File)