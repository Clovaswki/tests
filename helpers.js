const fs = require('fs')

module.exports = {
    fileEncode: (filename) => {
        let bitmap = fs.readFileSync(__dirname+filename)
        return Buffer.from(bitmap).toString('base64')
    },
    fileDecode: (str64, filename) => {
        let bitmap = Buffer.from(str64, 'base64')
        fs.writeFileSync('./img/'+filename, bitmap, 'binary', err => console.log(err))
    }
}