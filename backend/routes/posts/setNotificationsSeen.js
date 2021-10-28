var express = require("express");
var router = express.Router();
var db = require('../../database');
var con = db.con






router.post('/setNotificationsSeen', (req, res) => {

    var sqlString = `UPDATE maindatabase.notifications SET isviewed = 1 WHERE notificationid IN (${req.body.postids})`


    con.query(sqlString, (err, result) => {
        if(err){
            console.log(err)
            return
        }
        res.send('success')
    })
	
})

module.exports = router;