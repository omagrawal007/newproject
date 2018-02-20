/**
 * Express configuration
 */

'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./environment');
var passport = require('passport');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var moment = require('moment')
var versionator = require('versionator').create(config.version);

module.exports = function(app) {
  var env = app.get('env');
  
  app.use(versionator.middleware)

  app.set('view engine', 'jade');
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(passport.initialize());

  // Persist sessions with mongoStore
  // We need to enable sessions for passport twitter because its an oauth 1.0 strategy
  app.use(session({
    secret: config.secrets.session,
    resave: true,
    saveUninitialized: true, name: 'id',
    cookie: { secure: false,maxAge:60000 * 335 },
    store: new mongoStore({
      mongooseConnection: mongoose.connection,
      db: 'Social'
    })
  }));
  if ('production' === env) {
    app.set('trust proxy', 1) // trust first proxy
    
    app.use(morgan('combined'));
  }

  if ('development' === env || 'test' === env) {
    app.set('trust proxy', 1) // trust first proxy
  
    app.use(morgan('combined'));
    
    app.use(errorHandler()); // Error handler - has to be last
  }
};