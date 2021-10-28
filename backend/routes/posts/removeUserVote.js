var express = require("express");
var router = express.Router();
var db = require('../../database');
var con = db.con


router.post('/removeUserVote', (req, res) => {


    var sqlStringCheck = `SELECT gamelink_userid from gamelink_dev_db.gamelink_userpostvotes WHERE gamelink_feedpostid = ${req.body.feedPostID} AND gamelink_userid = ${req.body.userid}`

    
    var getCurrentVotes = `Select gamelink_feedpostpoints FROM gamelink_dev_db.gamelink_feedposts WHERE gamelink_feedpostid = ${req.body.feedPostID}`



    con.query(getCurrentVotes, (err, result) => {
        if(err){
            console.log(err)
            return
        } else {
            currentVotes = result[0].gamelink_feedpostpoints
        }
    })

    con.query(sqlStringCheck, (err, result) => {
        if(err){
            console.log(err)
            return
        }
        else{

            var removeNotification = `DELETE FROM gamelink_dev_db.gamelink_notifications WHERE gamelink_feedpostid = ${req.body.feedPostID} AND gamelink_notification_userid = ${req.body.userid} AND gamelink_voteid IS NOT NULL`
            con.query(removeNotification, (err, result) => {
                if(err){
                    console.log(err)
                    return
                }

            })


         
            var sqlString = `DELETE FROM gamelink_dev_db.gamelink_userpostvotes WHERE gamelink_feedpostid = ${req.body.feedPostID} AND gamelink_userid = ${req.body.userid}`
                //remove the point to posts table
            var addedVote =  currentVotes - 1
            
            var addToVotes = `UPDATE gamelink_dev_db.gamelink_feedposts SET gamelink_feedpostpoints = ${addedVote} WHERE gamelink_feedpostid = ${req.body.feedPostID}`
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