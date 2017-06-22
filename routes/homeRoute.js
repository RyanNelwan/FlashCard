'use strict';

const jsFiles = ['deck.js','card.js','studyMode.js','studyModeCard.js','box.js'];

// const 
module.exports = [
    {
        method: 'GET',
        path: '/',
        config: {
            handler: function(request, reply) {
                reply.view('home/index', {
                    context: 'index',
                    jsFiles: jsFiles,
                });
            }
        }
    }
];
