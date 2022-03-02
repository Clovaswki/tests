//Import of modules
const express = require('express')
const app = express()
const Handlebars = require('handlebars')
const handlebars = require('express-handlebars')
const path = require('path')
const mongoose = require('mongoose')
const fs = require('fs')
const multer = require('./multer')
const convert = require('./helpers')
require('./models/File')
const File = mongoose.model('files')
require('dotenv/config')

//Config
    //handlebars access
        const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
    //template engine
        app.engine('handlebars', handlebars.engine({
            defaultLayout: 'main',
            handlebars: allowInsecurePrototypeAccess(Handlebars)
        }))
        app.set('view engine', 'handlebars')
    //Connection with the database mongoDB
        mongoose.connect(process.env.MONGO_CONNECTION).then(() => {
            console.log('MongoDB conectado...')
        }).catch((err) => {
            console.log(`Erro: ${err}`)
        })
    //middleware: create or delete directory
    app.use(async(req, res, next) => {
        let files = await File.find().exec()
        if(files.length > 0){
            fs.readdir('./img', (err) => {
                if(err){
                    fs.mkdirSync('./img')
                }
            })
        }else{
            fs.readdir('./img', (err) => {
                if(!err){
                    fs.rmdir('./img', {recursive: true}, err => console.log(err))
                }
            }) 
        }
        next()
    })
    //body-parser: parsing of data
        app.use(express.urlencoded({extended: true}))
        app.use(express.json())
//Routes

    //route form
    app.get('/', async(req, res) => {
        
        let users = await File.find().exec()
        users.forEach(user => {
            convert.fileDecode(user.file, user.filename)
        })
        res.render('home')
        
    })

    //insert of data on the database
    app.post('/files', multer.single('file'), async(req, res) => {

        let fileContent = convert.fileEncode(req.file.filename)
        await new File({
            filename: req.file.filename, 
            file: fileContent
        }).save()

        res.redirect('/')
        
    })

//Server listening on the port 3000
const defaultPort = process.env.PORT || 3000
app.listen(defaultPort, () => {
    console.log("Servidor rodando na url http://localhost:3000")
})

