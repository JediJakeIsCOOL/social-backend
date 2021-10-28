var express = require("express");
var router = express.Router();
var db = require('../../database');
var con = db.con






router.post('/blockCommentsAndUsers', (req, res) => {

    if(req.body.value == '0'){
        var sqlString = `INSERT gamelink_dev_db.gamelink_hideposts (gamelink_userid, gamelink_feedpostid) VALUES (${req.body.userid}, ${req.body.postid})`

        con.query(sqlString, (err, result) => {
            if(err){
                console.log(err)
                return
            }
            res.send('success')
        })
    } else if (req.body.value == '1'){
        var getUser = `SELECT gamelink_userid from gamelink_dev_db.gamelink_feedposts WHERE gamelink_feedpostid = ${req.body.postid}`

        
        con.query(getUser, (err, result) => {
            if(err){
                console.log(err)
                return
            }
             var sqlString = `INSERT gamelink_dev_db.gamelink_blockusers (gamelink_userid, gamelink_blocked_userid) VALUES (${req.body.userid}, ${result[0].gamelink_userid})`
            con.query(sqlString, (err, result) => {
                if(err){
                    console.log(err)
                    return
                }
                res.send('sucess')
            })
        })
    } else if(req.body.value == '2'){
        var sqlString = `INSERT gamelink_dev_db.gamelink_hidecomments (gamelink_userid, gamelink_feedpostcomment_id) VALUES (${req.body.userid}, ${req.body.commentid})`

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