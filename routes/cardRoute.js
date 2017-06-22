'use strict';

var jsFiles = [];
var csFiles = [];

const qs = require('qs');
const Database = require('../library/database.js');

module.exports = [
    {
        method: 'POST',
        path: '/deck/fetch_all',
        config: {
            handler: function(request, reply) {
                var data = {};
                // Start with fixtures
                reply({'reached':'yes'});
            }
        }
    },{
        method: 'POST',
        path: '/deck/create',
        config: {
            handler: function(request, reply) {

                var data = qs.parse(request.payload);
                var deckName = data.deck_name;
                
                Database.connection().query('INSERT INTO decks (name, created_at) VALUES (?,?)', [deckName, Database.now()], function(err, result){
                    console.log(err, result);
                });
                
                // Start with fixtures
                reply({'reached':'yes'});
            }
        }
    }
];
