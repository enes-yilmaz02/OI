'use strict';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
const config = require('./config');
const userRoutes = require('./routes/users-routes');
const productRoutes = require('./routes/products-routes');
const orderRoutes = require('./routes/orders-routes');
const favoriteRoutes = require('./routes/favorites-routes');
const app = express();



app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

app.use(cookieParser());

app.use('/api', userRoutes.routes);
app.use('/api', productRoutes.routes);
app.use('/api' , orderRoutes.routes);
app.use('/api' , favoriteRoutes.routes);
// app.use('/api' ,uploadFile.routes);

app.listen(config.port, () => console.log('App is listening on url http://localhost:' + config.port));