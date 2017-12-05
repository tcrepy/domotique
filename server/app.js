var express = require('express');
var mysql = require('mysql');
var bodyParser = require("body-parser");

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'domotique'
});

connection.connect();

var server = express();
/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
server.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
server.use(bodyParser.json());


server.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

server.post('/select', function (req, res) {
    var id = req.body.id;
    var sql = 'select * from switch';
    if (id !== undefined){
        sql += ' where SW_ID = '+ id;
    }
    connection.query(sql, function (error, results, fields) {
        if(error) throw error;
        res.json(results);
    });
});

server.post('/update', function (req, res) {
    var id = req.body.id;
    console.log(req.body.bool);
    connection.query('SELECT * FROM switch WHERE SW_ID = '+id, function (error, results, fields) {
        if(error) throw error;
        var bool = results.SW_BOOL;
    });
    if (req.body.bool.length !== 0)
        bool = req.body.bool;
    var sql = 'UPDATE switch SET SW_BOOL = '+ bool +' WHERE SW_ID = '+ id;
    console.log(sql);
    connection.query(sql, function (error, results, fields) {
        if(error) res.json({'etat': 'err'});
        res.json({'etat':'ok'});
    })
});

server.post('/updatename', function (req, res) {
    var id = req.body.id;
    console.log(req.body.newName);
    connection.query('SELECT * FROM switch WHERE SW_ID = '+id, function (error, results, fields) {
        if(error) throw error;
        var name = results.SW_NOM;
    });
    if (req.body.newName.length !== 0)
        name = req.body.newName;
    var sql = 'UPDATE switch SET SW_NOM = \''+ name +'\' WHERE SW_ID = '+ id;
    console.log(sql);
    connection.query(sql, function (error, results, fields) {
        if(error) res.json({'etat': 'err'});
        res.json({'etat':'ok'});
    })
});

server.post('/supprimer', function (req, res) {
    var id = req.body.id;
    connection.query('SELECT * FROM switch WHERE SW_ID = '+id, function (error, results, fields) {
        if(error) throw error;
    });
    var sql = 'DELETE FROM switch WHERE SW_ID = '+ id;
    console.log(sql);
    connection.query(sql, function (error, results, fields) {
        if(error) res.json({'etat': 'err'});
        res.json({'etat':'ok'});
    })
});

server.post('/add', function(req, res){
    let name = req.body.name;
    let pgpio = req.body.pgpio;
    connection.query('INSERT INTO switch SET SW_NOM = "' + name + '", SW_GPIO_ID = "'+ pgpio + '", SW_BOOL = 0', function (error, results, fields) {
        if (error) res.json({'etat': 'err'});
        res.json({'etat': 'ok'});
    });
});

server.listen(8080);

console.log('Listening on 8080...');