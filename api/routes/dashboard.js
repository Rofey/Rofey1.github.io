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


  router.get('/',(req,res,next)=>{
    //join with picture table
    mydb.query('SELECT * from laptop,picture where laptop.ID=picture.ID',(err,doc)=>{
      if(err){
        res.send(JSON.stringify({msg: err.message}));
      }
      
      mydb.query('SELECT CART_ID from cart where ORDER_DONE=0', (err, data2) => {
        if (err) {
          return res.send(err);
        }
        mydb.query("SELECT * from cart_product,laptop,picture WHERE cart_product.CART_ID=? and laptop.ID=cart_product.PRODUCT_ID and laptop.ID=picture.ID", [data2[0]["CART_ID"]], (err, data1) => {
          if (err) {
            return res.send(err);
          }
          else {
            // return res.send(data1);
            var cartQty = 0;
            data1.forEach(element => {
              cartQty = cartQty + element.QTY;
            });
            console.log(cartQty);
            return res.render('index',{data:doc, cartQty: cartQty });
          }
        });
      });
      
      //in the ejs file, use data[i].name,model,price and picture to show all products on home page only
      //on clicking any of them return their product id page
      //hardcode the id in the action link of the product
      //open product page with parameter id
});
});


module.exports = router;