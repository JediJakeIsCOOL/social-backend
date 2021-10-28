var express = require("express");
var router = express.Router();
var db = require('../../database');
var con = db.con






router.post('/updateProfileMedia', (req, res) => {

   
    var sqlString = `UPDATE gamelink_dev_db.gamelink_users SET gamelink_usertwitch = '${req.body.twitch || ""}', gamelink_useryoutube = '${req.body.youtube || ""}', gamelink_usertwitter = '${req.body.twitter || ""}' WHERE gamelink_userid = ${req.body.userid}`
 

    con.query(sqlString, (err, result) => {
        if(err){
            console.log(err)
            return
        }
        res.send('success')
        })
	
})

module.exports = router;