var express = require("express");
var router = express.Router();
var db = require('../../database');
var con = db.con


router.post('/voteForPost', (req, res) => {


    var sqlStringCheck = `SELECT userid from maindatabase.userpostvotes WHERE feedpostid = ${req.body.feedPostID} AND userid = ${req.body.userid}`

    
    var getCurrentVotes = `Select feedpostpoints FROM maindatabase.feedposts WHERE feedpostid = ${req.body.feedPostID}`



    con.query(getCurrentVotes, (err, result) => {
        if(err){
            console.log(err)
            return
        } 
        currentVotes = result[0].feedpostpoints
        
    })

    con.query(sqlStringCheck, (err, result) => {
        if(err){
            console.log(err)
            return
        }
        console.log('whats happening')
        var getLoggedUser = `SELECT userid from maindatabase.feedposts where feedpostid = ${req.body.feedPostID}`

            con.query(getLoggedUser, function (err, result1) {
                if(err){
                    console.log(err)
                    return
                }
                   //if you comment or vote for your own posts dont insert
                var sqlString = `INSERT INTO maindatabase.userpostvotes (feedpostid, userid, 
                vote) VALUES ("${req.body.feedPostID}", ${req.body.userid}, 1)`
                //add the point to posts table
                var addedVote = currentVotes + 1
        
                var addToVotes = `UPDATE maindatabase.feedposts SET feedpostpoints = ${addedVote} WHERE feedpostid = ${req.body.feedPostID}`
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
                        
                        if(req.body.userid != result1[0].userid){
                            let insertNotifications = `INSERt INTO maindatabase.notifications (feedpostid, postuserid, notification_userid, 
                                voteid) VALUES (${req.body.feedPostID}, ${result1[0].userid}, ${req.body.userid},  ${result.insertId}) ` 
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