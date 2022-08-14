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
























//il processing dei dati deve avvenire in blocchi di massimo 15 messaggi ogni 10 secondi
 /*
var count1 = 0 ;

console.log(count1);
setInterval(function(){ 
    count1++ ;
    if (count1 <= 15){ 
    console.log('ciao' )};

},10000)

*/


 



 // si devono processare i dati in ordine di priorità: prima le priorità alte, in seguito le priorità basse. Ad esempio, se è presente almeno un dato con priorità 3, questo dovrà essere processato prima di passare ai dati con priorità 2 o 1
 /*
 const dati  =[
    {name :'laptop',
     price :1000

    },
    { 
    name:'desktop',
    price:1500,
    }
 ];

 




 dati.sort((a,b)=>{ 
    return b.number1 - a.number2 ;   //dal priptieta alta a pripriota bassa
 } )

 console.log(dati)

 /*function compare(a,b){
    return a - b 
    
  }


  console.log(vals);
  vals.sort(compare);
  console.log(vals)
 
 
  */



  //l'elaborazione di un messaggio consiste nel salvare i valori K e D su un DB relazionale, associando il timestamp di elaborazione (che dovrà essere lo stesso per tutti i messaggi dello stesso blocco)
 




