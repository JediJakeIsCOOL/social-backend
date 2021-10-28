var express = require("express");
var router = express.Router();
var db = require('../../database');
var con = db.con


router.post('/voteForPost', (req, res) => {


    var sqlStringCheck = `SELECT gamelink_userid from gamelink_dev_db.gamelink_userpostvotes WHERE gamelink_feedpostid = ${req.body.feedPostID} AND gamelink_userid = ${req.body.userid}`

    
    var getCurrentVotes = `Select gamelink_feedpostpoints FROM gamelink_dev_db.gamelink_feedposts WHERE gamelink_feedpostid = ${req.body.feedPostID}`



    con.query(getCurrentVotes, (err, result) => {
        if(err){
            console.log(err)
            return
        } 
        currentVotes = result[0].gamelink_feedpostpoints
        
    })

    con.query(sqlStringCheck, (err, result) => {
        if(err){
            console.log(err)
            return
        }
        console.log('whats happening')
        var getLoggedUser = `SELECT gamelink_userid from gamelink_dev_db.gamelink_feedposts where gamelink_feedpostid = ${req.body.feedPostID}`

            con.query(getLoggedUser, function (err, result1) {
                if(err){
                    console.log(err)
                    return
                }
                   //if you comment or vote for your own posts dont insert
                var sqlString = `INSERT INTO gamelink_dev_db.gamelink_userpostvotes (gamelink_feedpostid, gamelink_userid, 
                gamelink_vote) VALUES ("${req.body.feedPostID}", ${req.body.userid}, 1)`
                //add the point to posts table
                var addedVote = currentVotes + 1
        
                var addToVotes = `UPDATE gamelink_dev_db.gamelink_feedposts SET gamelink_feedpostpoints = ${addedVote} WHERE gamelink_feedpostid = ${req.body.feedPostID}`
                con.query(addToVotes, (err, result) => {
                    if(err){
                        console.log(err)
                        return
                    }
                
               

                    con.query(sqlString, (err, result) => {
                        if(err){
                            console.log(err)
                            return
                        }
                        
                        if(req.body.userid != result1[0].gamelink_userid){
                            let insertNotifications = `INSERt INTO gamelink_dev_db.gamelink_notifications (gamelink_feedpostid, gamelink_postuserid, gamelink_notification_userid, 
                                gamelink_voteid) VALUES (${req.body.feedPostID}, ${result1[0].gamelink_userid}, ${req.body.userid},  ${result.insertId}) ` 
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
     
})

module.exports = router;