var express = require("express");
var router = express.Router();
var db = require('../../database');
var con = db.con


router.post('/updateCurrentGame', (req, res) => {

    
    var sqlString = `UPDATE maindatabase.usersnfts SET currentlytrading = ${req.body.flag} WHERE userid = ${req.body.userid} AND nftid = ${req.body.gameid}`
      

    con.query(sqlString, (err, result) => {
        if(err){
            console.log(err)
            return
        }
        res.send('success')
        })
	
})

module.exports = router;