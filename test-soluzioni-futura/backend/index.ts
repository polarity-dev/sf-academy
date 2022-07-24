var mysql = require('mysql');

import express from 'express';
import fileUpload, { UploadedFile } from 'express-fileupload';
import bodyParser from 'body-parser';
import { exit } from 'process';
var cors = require('cors')

var con = mysql.createConnection({
  host: "db",
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: "test"

});

con.connect(function(err: any) {
  
  if (err) throw err;
  
  console.log("Connected!");
});

const app = express();
app.use(fileUpload({
    createParentPath: true
}));
app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const port = process.env.PORT || 3000;
app.listen(port);
console.log(`listening on port ${port}`);

setInterval(function(){
    processing(con);      
}
, 10000);


function getMySQLTimestamp(){
  

  let d = new Date();
  return d.getUTCFullYear() + '-' +
      ('00' + (d.getUTCMonth()+1)).slice(-2) + '-' +
      ('00' + d.getUTCDate()).slice(-2) + ' ' + 
      ('00' + d.getUTCHours()).slice(-2) + ':' + 
      ('00' + d.getUTCMinutes()).slice(-2) + ':' + 
      ('00' + d.getUTCSeconds()).slice(-2);
}
function processing(con: any){

    con.query("SELECT * FROM message WHERE status='unprocessed' ORDER BY priority desc LIMIT 15", function (err: any, result: any) {
        if (err) throw err;
        let timestamp = getMySQLTimestamp(); 
        for(let row of result){
            let id = row.id;
            let message = row.message;
            let k = message.split(' ')[0];
            let idx = message.indexOf(" ")[0];
            let d = message.substring(idx+1);
            con.query(`UPDATE message SET proc_k='${k}', proc_d='${d}', status='processed', proc_timestamp='${timestamp}' WHERE id=${id} ` , function (err: any, result: any) {             
                            console.log("1 record updated");
                        }         
                        );    
        }               
    })}
 

app.post('/importDataFromFile', (req, res) => {
    if (req.files) {
    let f = req.files.soluzioni as UploadedFile
    console.log(f.data.toString());

      var text = f.data.toString();
      var textArray = text.split("\n");



      let limits = textArray[0].split(' ');
      let a  = Number(limits[0]);
      let b = Number(limits[1]);                      
      
      for(let i  in textArray ){
        if(Number(i) < a || Number(i) > b){
            continue;
          }
          let e = textArray[i];
          let p = e.split(' ')[0];
          let idx = e.indexOf(" ");
          let message = e.substring(idx+1);
      
      con.query(`INSERT INTO message SET priority=${p}, message='${message}' `, function (err: any, result: any) {
              console.log("1 record inserted");
          });  

      }

    res.send('ok');
}});



app.get('/pendingData', function(req, res) {
  con.query("SELECT * FROM message WHERE status='unprocessed'", function (err: any, result: any) {
    console.log(result);
    res.send(result);
  });
});   

app.get('/data', function(req, res){
  console.log(req.query.limit);
  console.log(req.query.from);  
   let query=`SELECT * FROM message WHERE status='processed' ${req.query.from?'AND proc_timestamp > \''+ req.query.from + '\'': ''}  ORDER BY timestamp ${req.query.limit? 'LIMIT '+ req.query.limit: ''}`


  con.query(query, function (err: any, result: any) {  
      console.log(result);
      res.send(result);
    });
  }

);








//processing(con);
