const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const container = require('./container');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const passport = require('passport');


//Creating server using container
container.resolve(function(users,lodash){

  mongoose.Promise = global.Promise;
  mongoose.connect('mongodb://localhost/cricketApp',{useMongoClient:true});

  const app = setUpServer();

  function setUpServer(){
    const app = express();
    const server = http.createServer(app);
    server.listen(3000,() => {
      console.log('Listening on port 3000');
    });

    configureExpress(app);

    // Setup Route
    const router = require('express-promise-router')();
    users.setRouting(router);
    app.use(router);
  }

  function configureExpress(app){
    require('./passport/passport-local');
    require('./passport/passport_facebook');

    app.use(express.static('public'));
    app.use(cookieParser());
    app.set('view engine','ejs');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(validator());
    app.use(session({
       //cookie: { maxAge: 60000 },
       secret : "thisisasecretkey",
       resave : true,
       saveUninitialized : true,
       store : new mongoStore({mongooseConnection : mongoose.connection})
    }));
    //
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());

    app.locals.lodash = lodash;
  }
});
