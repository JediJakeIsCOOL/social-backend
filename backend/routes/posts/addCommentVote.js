const e = require("express");
var express = require("express");
var router = express.Router();
var db = require('../../database');
var con = db.con


router.post('/addCommentVote', (req, res) => {

  
    var sqlStringCheck = `SELECT userid from maindatabase.feedposts WHERE feedpostid =  ${req.body.feedPostID}`

    
    var getCurrentVotes = `Select commentpostpoints FROM maindatabase.feedpostcomments WHERE feedpostcomment_id = ${req.body.commentpostid}`



    con.query(getCurrentVotes, (err, result) => {
        if(err){
            console.log(err)
            return
        } 
        currentVotes = result[0].commentpostpoints
        
    })

  

    con.query(sqlStringCheck, (err, result1) => {
        if(err){
            console.log(err)
            return
        }
       
        var sqlString = `INSERT INTO maindatabase.userpostvotes (feedpostid, userid, vote, feedpostcomment_id) VALUES (${req.body.feedPostID}, ${req.body.userid}, 1, ${req.body.commentpostid})`
            //remove the point to posts table
        var addedVote =  currentVotes + 1
        var addToVotes = `UPDATE maindatabase.feedpostcomments SET commentpostpoints = ${addedVote} WHERE feedpostcomment_id = ${req.body.commentpostid}`
        con.query(addToVotes, (err, result) => {
            if(err){
                console.log(err)
                return
            }
            con.query(sqlString, (err, result) => {
                if(err){
                    console.log(err)
                    
                }

            
                if(req.body.userid != result1[0].userid){
                    let insertNotifications = `INSERt INTO maindatabase.notifications (feedpostid, feedpostcomment_id, postuserid, notification_userid, 
                        voteid) VALUES (${req.body.feedPostID}, ${req.body.commentpostid}, ${result1[0].userid}, ${req.body.userid},  ${result.insertId}) ` 
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