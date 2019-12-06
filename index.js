const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const bodyparser = require('body-parser');
const PORT = process.env.PORT || 5000;

const dashboardRoutes = require('./api/routes/dashboard');
const productRoutes = require('./api/routes/product');
const cartRoutes = require('./api/routes/cart');
const contactRoutes = require('./api/routes/contact');
const checkoutRoutes = require('./api/routes/checkout');


app.use(express.static(path.join(__dirname,'public')));

//app.use(cors);
app.use(bodyparser.urlencoded({extended:false}));

app.use('/',dashboardRoutes);
app.use('/product',productRoutes);
app.use('/cart',cartRoutes);
app.use('/contact',contactRoutes);
app.use('/checkout',checkoutRoutes);

// app.set('views', path.join(__dirname,'public'));
app.set('view engine','ejs');


app.listen(PORT, ()=>{
    console.log(`Server active on port ${PORT}.`);
});
