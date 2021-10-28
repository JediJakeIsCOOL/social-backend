var express = require("express");
var router = express.Router();

var async = require("async");

var db = require('../../gamedatabase.js');

var con = db.con;

router.get('/getgamereviews/:game_id', (req, res) => {

	let getGameSearch = 
    `SELECT AVG(rating) AS rating
    FROM game_ratings 
    WHERE game_id = ${req.params.game_id}` 

	con.query(getGameSearch, function (err, result1) {
        if(err){
            console.log(err)
            return
        }
        if(result1.length){
           res.send(result1)
        }
    })
})


module.exports = router;