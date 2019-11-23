const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;
const mysql = require('mysql');

var mydb = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aey'
});

mydb.connect(function(err){
    if(err){
      console.log('Error connecting to Db');
      return;
    }
    console.log('Connection established');
  });
  


app.use(express.static(path.join(__dirname,'public')));

app.get('/', (req,res)=>{
    res.render(path.join(__dirname,'public','index'));
});

app.get('/try',(req,res)=>{
    res.render({da});
});



app.listen(PORT, ()=>{
    console.log(`Server active on port ${PORT}.`);
});