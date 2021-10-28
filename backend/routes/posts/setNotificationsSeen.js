var express = require("express");
var router = express.Router();
var db = require('../../database');
var con = db.con






router.post('/setNotificationsSeen', (req, res) => {

    var sqlString = `UPDATE gamelink_dev_db.gamelink_notifications SET gamelink_isviewed = 1 WHERE gamelink_notificationid IN (${req.body.postids})`


    con.query(sqlString, (err, result) => {
        if(err){
            console.log(err)
            return
        }
        res.send('success')
    })
	
})

module.exports = router;