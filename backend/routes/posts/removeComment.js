var express = require("express");
var router = express.Router();
var db = require('../../database');
var con = db.con


router.post('/removeComment', (req, res) => {

        var sqlString2 = `DELETE FROM maindatabase.userpostvotes WHERE feedpostcomment_id = ${req.body.commentid}`
            //remove the point to posts table
        var sqlString = `DELETE FROM maindatabase.feedpostcomments WHERE feedpostcomment_id = ${req.body.commentid}`

        con.query(sqlString2, (err, result) => {
            if(err){
                console.log(err)
                return
            } else {
                
            }
        })

        con.query(sqlString, (err, result) => {
            res.send('success')
        })
           
        
     
})

module.exports = router;