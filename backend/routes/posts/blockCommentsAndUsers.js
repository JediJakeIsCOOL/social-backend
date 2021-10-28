var express = require("express");
var router = express.Router();
var db = require('../../database');
var con = db.con






router.post('/blockCommentsAndUsers', (req, res) => {

    if(req.body.value == '0'){
        var sqlString = `INSERT maindatabase.hideposts (userid, feedpostid) VALUES (${req.body.userid}, ${req.body.postid})`

        con.query(sqlString, (err, result) => {
            if(err){
                console.log(err)
                return
            }
            res.send('success')
        })
    } else if (req.body.value == '1'){
        var getUser = `SELECT userid from maindatabase.feedposts WHERE feedpostid = ${req.body.postid}`

        
        con.query(getUser, (err, result) => {
            if(err){
                console.log(err)
                return
            }
             var sqlString = `INSERT maindatabase.blockusers (userid, blocked_userid) VALUES (${req.body.userid}, ${result[0].userid})`
            con.query(sqlString, (err, result) => {
                if(err){
                    console.log(err)
                    return
                }
                res.send('sucess')
            })
        })
    } else if(req.body.value == '2'){
        var sqlString = `INSERT maindatabase.hidecomments (userid, feedpostcomment_id) VALUES (${req.body.userid}, ${req.body.commentid})`

            con.query(sqlString, (err, result) => {
            if(err){
                console.log(err)
                return
            }
            res.send('sucess')
        })
    }

    


  
	
})

module.exports = router;