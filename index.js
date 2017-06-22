'use strict';

// pm2-dev start index.js

var path = require('path');
global.APP_ROOT = path.resolve(__dirname);

const Bootstrap = require(APP_ROOT + '/library/bootstrap');

var bootstrap = new Bootstrap();
bootstrap.init();
