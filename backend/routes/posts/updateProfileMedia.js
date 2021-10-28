var express = require("express");
var router = express.Router();
var db = require('../../database');
var con = db.con






router.post('/updateProfileMedia', (req, res) => {

   
    var sqlString = `UPDATE maindatabase.users SET usertwitch = '${req.body.twitch || ""}', useryoutube = '${req.body.youtube || ""}', usertwitter = '${req.body.twitter || ""}' WHERE userid = ${req.body.userid}`
 

    con.query(sqlString, (err, result) => {
        if(err){
            console.log(err)
            return
        }
        res.send('success')
        })
	
})

module.exports = router;