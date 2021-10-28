var express = require("express");
var router = express.Router();

var async = require("async");

var db = require('../../gamedatabase.js');

var db2 = require('../../database');

var con2 = db2.con
var con = db.con;

router.post('/postprofilegame', (req, res) => {
    let deleteDuplicateAdds = `
        DELETE FROM maindatabase.usersnfts WHERE userid = ${req.body.userid} AND nftid = ${req.body.gameid}
    `
    con2.query(deleteDuplicateAdds, function (err, result1) {
        if(err){
            console.log(err)
            return
        }
    })

    let postProfileGame = `
        INSERT INTO maindatabase.usersnfts (userid, nftid, nftart, currentlytrading)
       VALUES (${req.body.userid}, ${req.body.gameid}, "${req.body.gameart}", ${req.body.currentGame})
    `

    con2.query(postProfileGame, function (err, result1) {
        if(err){
            console.log(err)
            return
        }
        res.send('success')
    })

})

module.exports = router;
