var express = require("express");
var router = express.Router();
var db = require('../../database');
var con = db.con






router.post('/updateCompetitive', (req, res) => {

    var sqlString = `UPDATE gamelink_dev_db.gamelink_users SET gamelink_usercompetitive = ${req.body.usercompetitive} WHERE gamelink_userid = ${req.body.userid}`


    con.query(sqlString, (err, result) => {
        if(err){
            console.log(err)
            return
        }
        res.send('success')
        })
	
})

module.exports = router;