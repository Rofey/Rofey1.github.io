const express = require('express');
const router = express.Router();
const mysql = require('mysql');

var mydb = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aey'
});

mydb.connect(function(err){
    if(err){
      console.log('Error connecting to database.');
      return;
    }
    console.log('Connection to database established.');
  });

router.get('/',(req,res)=>{
    res.render('contact');
});

router.post('/',(req,res)=>{
  if(!req.body.fname || !req.body.lname || !req.body.subject || !req.body.message){
    console.log('No data.');
    return res.send("!req");
}
  mydb.query('INSERT INTO contact(FNAME,LNAME,SUBJECT,MESSAGE) VALUES (?,?,?,?)',[req.body.fname,req.body.lname,req.body.subject,req.body.message],(err,doc)=>{
    if(err)
    {
      return res.send(err);
    }
    console.log('Inserted data.');
    res.render('contact');
  });
});

module.exports = router;