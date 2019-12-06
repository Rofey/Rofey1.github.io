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

router.get('/',(req,res)=>{
    
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
          return res.render("checkout",{data:data1,total:0,cartQty:cartQty});
          }
        });
      });
});

router.post('/', (req, res) => {
    // return res.send(req.body);
    if(!req.body.name || !req.body.cell || !req.body.address){
        return res.send("!req");
    }
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
            if(data1.length<1)
                res.send("No data.");
            var total = 0;
            data1.forEach(element => {
                total= total + element.QTY*element.PRICE;
            });
            total = total+100;
            mydb.query("INSERT INTO checkout(CART_ID, BILL_NAME, BILL_CELL, BILL_ADDRESS, BILL_TOTAL) VALUES (?,?,?,?,?)", [ data[0]["CART_ID"],req.body.name,req.body.cell,req.body.address,total], (err, data2) => {
                if (err) {
                    return res.send(err);
                }
                
                mydb.query("INSERT INTO cart() VALUES ()",[], (err, data3) => {
                    if (err) {
                        return res.send(err);
                    }
                    mydb.query("UPDATE cart SET ORDER_DONE=? WHERE CART_ID = ?",[1,data[0]["CART_ID"]], (err, data4) => {
                        if (err) {
                            return res.send(err);
                        }
                        var messageEnd='Order has been placed. You may continue shopping here.'
                        res.render('placed',{msg:messageEnd});
                    }); 
                });
            });

        // return res.redirect("/cart");
        }
        });
    });

});

module.exports = router;