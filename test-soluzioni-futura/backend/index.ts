import mysql from 'mysql';
import express from 'express';
import fileUpload, { UploadedFile } from 'express-fileupload';
import bodyParser from 'body-parser';
import cors from 'cors';


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
  var d = new Date();
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
        var timestamp = getMySQLTimestamp(); 
        for(var row of result){
            var id = row.id;
            var message = row.message;
            var k = message.split(' ')[0];
            var idx = message.indexOf(" ")[0];
            var d = message.substring(idx+1);
            con.query(`UPDATE message SET proc_k='${k}', proc_d='${d}', status='processed', proc_timestamp='${timestamp}' WHERE id=${id} ` , function (err: any, result: any) {             
          });    
        }               
    })}


app.post('/importDataFromFile', (req, res) => {
    if (req.files) {
    var f = req.files.soluzioni as UploadedFile
      var text = f.data.toString();
      var textArray = text.split("\n");
      var limits = textArray[0].split(' ');
      var a  = Number(limits[0]);
      var b = Number(limits[1]);                      
      for(var i  in textArray ){
        if(Number(i) < a || Number(i) > b){
            continue;
          }
          var e = textArray[i];
          var p = e.split(' ')[0];
          var idx = e.indexOf(" ");
          var message = e.substring(idx+1);
          var query = `INSERT INTO message SET priority=${mysql.escape(p)}, message=${mysql.escape(message)}`
      con.query(query, function (err: any, result: any) {
          if (err) {          
            res.status(500).send(err);
        } 
      });                       
     }
    res.send('ok');
}});


app.get('/pendingData', function(req, res) {
  con.query("SELECT * FROM message WHERE status='unprocessed'", function (err: any, result: any) {
    res.send(result);
  });
});   


app.get('/data', function(req, res){
   var query=`SELECT * FROM message WHERE status='processed' ${req.query.from?'AND proc_timestamp > \''+ req.query.from + '\'': ''}  ORDER BY timestamp ${req.query.limit? 'LIMIT '+ req.query.limit: ''}`
  con.query(query, function (err: any, result: any) {  
      res.send(result);
  });
});