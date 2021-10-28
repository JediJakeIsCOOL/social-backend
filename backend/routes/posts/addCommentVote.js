const e = require("express");
var express = require("express");
var router = express.Router();
var db = require('../../database');
var con = db.con


router.post('/addCommentVote', (req, res) => {

  
    var sqlStringCheck = `SELECT gamelink_userid from gamelink_dev_db.gamelink_feedposts WHERE gamelink_feedpostid =  ${req.body.feedPostID}`

    
    var getCurrentVotes = `Select gamelink_commentpostpoints FROM gamelink_dev_db.gamelink_feedpostcomments WHERE gamelink_feedpostcomment_id = ${req.body.commentpostid}`



    con.query(getCurrentVotes, (err, result) => {
        if(err){
            console.log(err)
            return
        } 
        currentVotes = result[0].gamelink_commentpostpoints
        
    })

  

    con.query(sqlStringCheck, (err, result1) => {
        if(err){
            console.log(err)
            return
        }
       
        var sqlString = `INSERT INTO gamelink_dev_db.gamelink_userpostvotes (gamelink_feedpostid, gamelink_userid, gamelink_vote, gamelink_feedpostcomment_id) VALUES (${req.body.feedPostID}, ${req.body.userid}, 1, ${req.body.commentpostid})`
            //remove the point to posts table
        var addedVote =  currentVotes + 1
        var addToVotes = `UPDATE gamelink_dev_db.gamelink_feedpostcomments SET gamelink_commentpostpoints = ${addedVote} WHERE gamelink_feedpostcomment_id = ${req.body.commentpostid}`
        con.query(addToVotes, (err, result) => {
            if(err){
                console.log(err)
                return
            }
            con.query(sqlString, (err, result) => {
                if(err){
                    console.log(err)
                    
                }

            
                if(req.body.userid != result1[0].gamelink_userid){
                    let insertNotifications = `INSERt INTO gamelink_dev_db.gamelink_notifications (gamelink_feedpostid, gamelink_feedpostcomment_id, gamelink_postuserid, gamelink_notification_userid, 
                        gamelink_voteid) VALUES (${req.body.feedPostID}, ${req.body.commentpostid}, ${result1[0].gamelink_userid}, ${req.body.userid},  ${result.insertId}) ` 
                    con.query(insertNotifications, (err, result) => {
                        if(err){
                            console.log(err)
                            return
                        }
                        res.send('success')
                    })
                } else {
                    res.send('success')
                }

            })
        })
     
    })
     
})

module.exports = router;