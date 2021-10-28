var express = require("express");
var router = express.Router();
var db = require('../../database');
var con = db.con


router.post('/updateCurrentGame', (req, res) => {

    
    var sqlString = `UPDATE gamelink_dev_db.gamelink_usersgames SET gamelink_currentlyplaying = ${req.body.flag} WHERE gamelink_userid = ${req.body.userid} AND gamelink_gameid = ${req.body.gameid}`
      

    con.query(sqlString, (err, result) => {
        if(err){
            console.log(err)
            return
        }
        res.send('success')
        })
	
})

module.exports = router;