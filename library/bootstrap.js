'use strict';

const fs = require('fs');
const Hapi = require('hapi');
const server = new Hapi.Server();
const Path = require('path');
const Hoek = require('hoek');
const Bcrypt = require('bcrypt');

module.exports = function(environment) {
    
    // Init node app
    this.init = function(){
        this.compileCssIfNeeded();
        this.initServer();
    };
    
    // Init the server
    this.initServer = function(){
        server.connection({
            port: 8080
        });    
        
        // Setup templating engine
        server.register(require('vision'), (err) => {

            Hoek.assert(!err, err);

            const defaultContext = {
                defaultTitle: 'FlashCard',
                defaultJsFiles: ['utils.js', 'main.js'],
                defaultCssFiles: ['main.css'],
            };

            server.views({
                engines: {
                    html: require('handlebars'),
                },
                context: defaultContext,
                relativeTo: APP_ROOT,
                path: './views',
                layout: true,
                layoutPath: './views/layout',
                helpersPath: './views/helpers',
            });
        });
        
        // Setup routes
        server.register(require('inert'), (err) => {
            const routes = require(APP_ROOT + '/routes/routes');
            server.route(routes);
        });
        
        // Kick start server
        server.start((err) => {
            if (err) {
                console.log(err);
                throw err;
            }
            console.log('Server running at:', server.info.uri);
        });
    };
    
    // Helper method for compliling less files
    this.compileCssIfNeeded = function(){
        fs.readdir(APP_ROOT + "/www/css", function( err, files ) {
            files.forEach(function(file, index){
                var cssFilename = file;
                var cssFilenamePath = APP_ROOT + "/www/css/" + cssFilename;
                
                var lessFilename = cssFilename.split(".")[0] + ".less";
                var lessFilenamePath = APP_ROOT + "/www/less/" + lessFilename;

                var cssModifiedTime = fs.statSync(cssFilenamePath).mtime;
                var lessModifiedTime = fs.statSync(lessFilenamePath).mtime;

                // console.log(cssFilenamePath);

                if (lessModifiedTime.getTime() > cssModifiedTime.getTime()) {
                    
                    console.log('Compiling CSS file: ' + lessFilename  + ' >>> ' + cssFilename + " | " + lessModifiedTime.getTime() + " " + cssModifiedTime.getTime());
                    
                    var less = require('less');
                    less.render(fs.readFileSync(lessFilenamePath).toString(), {
                        filename: cssFilenamePath,
                        compress: true
                    }, function(error, output) {
                        // console.log(output, e);
                        if (error !== null) {
                            console.log(error);
                            return;
                        }
                        fs.writeFile(cssFilenamePath, output.css);
                    });
                }
            });
        });    
    };
};
