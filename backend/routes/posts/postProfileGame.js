var express = require("express");
var router = express.Router();

var async = require("async");

var db = require('../../gamedatabase.js');

var db2 = require('../../database');

var con2 = db2.con
var con = db.con;

router.post('/postprofilegame', (req, res) => {
    
    console.log(req.body)
    let deleteDuplicateAdds = `
        DELETE FROM gamelink_dev_db.gamelink_usersgames WHERE gamelink_userid = ${req.body.userid} AND gamelink_gameid = ${req.body.gameid}
    `
    con2.query(deleteDuplicateAdds, function (err, result1) {
        if(err){
            console.log(err)
            return
        }
    })

    let postProfileGame = `
        INSERT INTO gamelink_dev_db.gamelink_usersgames (gamelink_userid, gamelink_gameid, gamelink_gameart, gamelink_currentlyplaying)
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