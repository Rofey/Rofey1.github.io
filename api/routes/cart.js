const express = require('express');
const router = express.Router();
const mysql = require('mysql');

var mydb = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'aey'
});

mydb.connect(function (err) {
  if (err) {
    console.log('Error connecting to database.');
    return;
  }
  console.log('Connection to database established.');
});

router.get('/', (req, res) => {
  mydb.query('SELECT CART_ID from cart where ORDER_DONE=0', (err, data) => {
    if (err) {
      return res.send(err);
    }
    mydb.query("SELECT * from cart_product,laptop,picture WHERE cart_product.CART_ID=? and laptop.ID=cart_product.PRODUCT_ID and laptop.ID=picture.ID", [ data[0]["CART_ID"]], (err, data1) => {
      if (err) {
        return res.send(err);
      }
      else {
        // return res.send(data1);
        var cartQty=0;
        data1.forEach(element => {
          cartQty = cartQty+element.QTY;
        });
        console.log(cartQty);
        return res.render("cart",{data:data1,total:0,cartQty:cartQty});
      }
    });
  });

});

router.get('/clear', (req, res) => {
  mydb.query('SELECT CART_ID from cart where ORDER_DONE=0', (err, data) => {
    if (err) {
      return res.send(err);
    }
    mydb.query("DELETE FROM cart_product WHERE CART_ID=?", [ data[0]["CART_ID"]], (err, data1) => {
      if (err) {
        return res.send(err);
      }
      else {
        // return res.send(data1);
      return res.redirect("/cart");
      }
    });
  });

});

module.exports = router;