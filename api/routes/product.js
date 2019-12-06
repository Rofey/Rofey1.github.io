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



router.get('/:id', (req, res) => {
  //mydb.query('SELECT * from laptop JOINS processor on laptop.ID=processor.ID where ID = ? ',[req.params.idd],(err,doc)=>{
    mydb.query('SELECT * from laptop,picture where laptop.ID=picture.ID',(err,docc)=>{
      if(err){
        res.send(JSON.stringify({msg: err.message}));
      }
  
    mydb.query('SELECT * from laptop,processor,picture where laptop.ID = ? and processor.ID = ? and picture.ID = ?', [req.params.id, req.params.id, req.params.id], (err, doc) => {
    if (err) {
      res.send(JSON.stringify({ msg: err.message }));
    }
    console.log('Sending laptop data');
    // var data=JSON.stringify({information:doc});
    console.log(doc[0]);
    var data = doc[0];
    // for (var i = 0; i < doc.length; i++) {
    //   var row = doc[i];
    //   console.log(row.BRAND, "costs", row.MODEL);
    // }   
    //res.json(data);
    mydb.query('SELECT CART_ID from cart where ORDER_DONE=0', (err, data2) => {
      if (err) {
        return res.send(err);
      }
      mydb.query("SELECT * from cart_product,processor,laptop,picture WHERE cart_product.CART_ID=? and laptop.ID=cart_product.PRODUCT_ID and laptop.ID=picture.ID and laptop.ID = processor.ID", [data2[0]["CART_ID"]], (err, data1) => {
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
          return res.render('product', { docc: docc,data: data, cartQty: cartQty });
        }
      });
    });
  });
});
  //from this data, use the process atrributes to show in description area
  //picture attributes used in img src tags
});

router.post("/:id/addtocart", function (req, res) {
  // res.send(req.body.quantity);
  mydb.query('SELECT CART_ID from cart where ORDER_DONE=0', (err, data) => {
    if (err) {
      return res.send(err);
    }
    mydb.query('SELECT * from cart_product where PRODUCT_ID=? and CART_ID=?', [req.params.id, data[0]["CART_ID"]], (err, data1) => {
      // res.send(data);
      if (err)
        return res.send(err);
      if (data1.length < 1) {
        mydb.query('INSERT INTO cart_product(CART_ID, PRODUCT_ID, QTY) VALUES (?,?,?)', [data[0]["CART_ID"], req.params.id, req.body.quantity], (err, data2) => {
          if (err) {
            return res.send(err);
          }
          else {
            return res.redirect("/");
          }
        });
      }
      else {
        var qty = data1[0]["QTY"] + parseInt(req.body.quantity);
        mydb.query("UPDATE cart_product SET QTY=? WHERE PRODUCT_ID=? and CART_ID=?", [qty, req.params.id, data[0]["CART_ID"]], (err, data3) => {
          if (err) {
            return res.send(err);
          }
          else {
            return res.redirect("/");
          }
        });
      }
    });

  });

});



module.exports = router;