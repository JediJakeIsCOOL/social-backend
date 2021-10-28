var express = require("express");
var router = express.Router();
var db = require('../../database');
var con = db.con


router.post('/removeCommentVote', (req, res) => {

  
    var sqlStringCheck = `SELECT gamelink_userid from gamelink_dev_db.gamelink_userpostvotes WHERE gamelink_feedpostcomment_id = ${req.body.commentpostid} AND gamelink_userid = ${req.body.userid}`

    
    var getCurrentVotes = `Select gamelink_commentpostpoints FROM gamelink_dev_db.gamelink_feedpostcomments WHERE gamelink_feedpostcomment_id = ${req.body.commentpostid}`



    con.query(getCurrentVotes, (err, result) => {
        if(err){
            console.log(err)
            return
        } 
        currentVotes = result[0].gamelink_commentpostpoints
        
    })

  

    con.query(sqlStringCheck, (err, result) => {
        if(err){
            console.log(err)
            return
        }
        else{

            var removeNotification = `DELETE FROM gamelink_dev_db.gamelink_notifications WHERE gamelink_feedpostcomment_id = ${req.body.commentpostid} AND gamelink_notification_userid = ${req.body.userid} AND gamelink_voteid IS NOT NULL`
            con.query(removeNotification, (err, result) => {
                if(err){
                    console.log(err)
                    return
                }

            })
         
            var sqlString = `DELETE FROM gamelink_dev_db.gamelink_userpostvotes WHERE gamelink_feedpostcomment_id = ${req.body.commentpostid} AND gamelink_userid = ${req.body.userid}`
                //remove the point to posts table
            var addedVote =  currentVotes - 1
            var addToVotes = `UPDATE gamelink_dev_db.gamelink_feedpostcomments SET gamelink_commentpostpoints = ${addedVote} WHERE gamelink_feedpostcomment_id = ${req.body.commentpostid}`
            con.query(addToVotes, (err, result) => {
                if(err){
                    console.log(err)
                    return
                } else {
                    
                }
            })

            con.query(sqlString, (err, result) => {
               res.send('success')
            })


         

           
        }
     
    })
     
})

module.exports = router;