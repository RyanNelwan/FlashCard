'use strict';

module.exports = [
    {
        method: 'GET',
        path: '/js/{file*}',
        handler: {
            directory: {
                path: 'www/js'
            }
        }
    },
    {
        method: 'GET',
        path: '/css/{file*}',
        handler: {
            directory: {
                path: 'www/css'
            }
        }
    },
    {
        method: 'GET',
        path: '/fonts/{file*}',
        handler: {
            directory: {
                path: 'www/fonts'
            }
        }
    },
    {
        method: 'GET',
        path: '/downloads/{file*}',
        handler: {
            directory: {
                path: 'www/downloads'
            }
        }
    },
    {
        method: 'GET',
        path: '/img/{file*}',
        handler: {
            directory: {
                path: 'www/img'
            }
        }
    },
];
