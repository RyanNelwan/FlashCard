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
                Database.connection().query('SELECT d.*, (SELECT count(*) FROM cards AS c WHERE c.deck_id = d.id) as number_of_cards FROM decks AS d', null, function(err, results){
                    if (err) {
                        return reply({'error':err});
                    }
                    reply({'decks':results});
                });
            }
        }
    },{
        method: 'POST',
        path: '/deck/create',
        config: {
            handler: function(request, reply) {

                var data = qs.parse(request.payload);
                var name = data.name;
                
                Database.connection().query('INSERT INTO decks (name, created_at) VALUES (?,?)', [name, Database.now()], function(err, result){
                    if (err) {
                        return reply({'error':err});
                    }
                    Database.connection().query('SELECT d.*, (SELECT count(*) FROM cards AS c WHERE c.deck_id = d.id) as number_of_cards FROM decks AS d WHERE d.id = ?', [result.insertId], function(err, results){
                        if (err) {
                            return reply({'error':err});
                        }
                        reply({
                            'deck': results[0],
                        });
                    });
                });
            }
        }
    },{
        method: 'POST',
        path: '/deck/card/create',
        config: {
            handler: function(request, reply) {

                var data = qs.parse(request.payload);
                var deckId = data.deck_id;
                var question = data.question;
                var answer = data.answer;
                var defaultBoxId = 1;
                
                Database.connection().query('INSERT INTO cards (deck_id, question, answer, box_id, created_at) VALUES (?,?,?,?,?)', [deckId, question, answer, defaultBoxId, Database.now()], function(err, result){
                    if (err) {
                        return reply({'error':err});
                    }
                    var cardId = result.insertId;
                    Database.connection().query('SELECT * FROM cards WHERE id = ?', [cardId], function(err, result){
                        if (err) {
                            return reply({'error':err});
                        }
                        reply({
                            'card': result[0]
                        });
                    });
                });
            }
        }
    },{
        method: 'POST',
        path: '/deck/card/fetch_all',
        config: {
            handler: function(request, reply) {

                var data = qs.parse(request.payload);
                var deckId = data.deck_id;
                
                Database.connection().query('SELECT * FROM cards WHERE deck_id = ?', [deckId], function(err, result){
                    reply({'cards':result});
                });
            }
        }
    },{
        method: 'POST',
        path: '/deck/card/update_box_id',
        config: {
            handler: function(request, reply) {

                var data = qs.parse(request.payload);
                var cardId = data.card_id;
                var boxId = data.box_id;
                
                Database.connection().query('UPDATE cards SET box_id = ? WHERE id = ?', [boxId, cardId], function(err, result){
                    reply({'cards':result});
                });
            }
        }
    }
];
