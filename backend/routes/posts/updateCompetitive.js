var express = require("express");
var router = express.Router();
var db = require('../../database');
var con = db.con






router.post('/updateCompetitive', (req, res) => {

    var sqlString = `UPDATE maindatabase.users SET usersocialsflag = ${req.body.usercompetitive} WHERE userid = ${req.body.userid}`


    con.query(sqlString, (err, result) => {
        if(err){
            console.log(err)
            return
        }
        res.send('success')
        })
	
})

module.exports = router;