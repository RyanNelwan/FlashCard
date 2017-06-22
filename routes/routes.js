'use strict';

module.exports = [].concat(
    require('../routes/staticRoute'),
    require('../routes/deckRoute'),
    require('../routes/homeRoute')
);
