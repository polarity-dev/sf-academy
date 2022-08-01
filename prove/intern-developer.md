###index.js


const express =require('express')  //
const multer=require('multer') //
const http = require('http')
const cors = require('cors')
const { ALL } = require('dns')
const {dati }  =require('./dati')  //portare la pagina dei dati json


//app.use(express.json)  significa gli informazione che lo prendo dai clienti la rendera in formato json file


const storage  = multer.diskStorage({    //diskstorege perche voglio salvare su disco
    destination : function(req ,file,cb){    //ho distination che nella cartella uploads crea il file con stesso nome  
        cb(null,'./uploads/')
     },
     filename :function (req,file,cb) {
        console.log('uploaded'+file.originalname)
        cb(null,file.originalname)
      }

 })

const upload = multer({    //utillizare multer 
    storage :storage       // deve caricare soltanto un file e quale il nome che corrisponde al input del nome del file
}).single('filetoupload')

const app =express()
app.set('view engine ','ejs')  // dire alla applicazione di impostare una variabile  ejs che ho instalato 



app.get('/',(req,res) => { 
    res.render('index.html')   //collegare con la pagina html che ci scrive il form 

})

app.post('/uploads',(req,res)=>{     //qui sto caricando il file  ,se ce un errore ritorna che cè errore se no passa il file 
    upload(req,res, err => {                             
        if (err) return console.error(err)   
        console.log(req.file)
        res.send('ok')

     })  
})




app.listen(3000, ()=>{          //mettere in ascolto nostro server alla porta 3000
    console.log('server started')  
})





