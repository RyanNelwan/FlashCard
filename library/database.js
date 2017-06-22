'use strict';

const mysql = require('mysql');

var Database = {

    // TODO: move these over to config file
    _db:   'DATABASE_NAME',
    _host: 'HOST',
    _user: 'USERNAME',
    _pass: 'PASSWORD',
    _connection: undefined,
    
    connection: function(){
        var that = this;
        
        this._connection = mysql.createConnection({
          host      : that._host,
          user      : that._user,
          password  : that._pass,
          database  : that._db,
          charset   : 'utf8mb4'
        });
        
        this._connection.connect();
        
        return this._connection;
    },
    
    now: function(){
        return Math.floor(Date.now() / 1000);
    },
};

module.exports = Database;
