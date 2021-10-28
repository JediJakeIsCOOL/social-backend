var express = require("express");
var router = express.Router();
var db = require('../../database');
var con = db.con


router.post('/removeUserVote', (req, res) => {


    var sqlStringCheck = `SELECT userid from maindatabase.userpostvotes WHERE feedpostid = ${req.body.feedPostID} AND userid = ${req.body.userid}`

    
    var getCurrentVotes = `Select feedpostpoints FROM maindatabase.feedposts WHERE feedpostid = ${req.body.feedPostID}`



    con.query(getCurrentVotes, (err, result) => {
        if(err){
            console.log(err)
            return
        } else {
            currentVotes = result[0].feedpostpoints
        }
    })

    con.query(sqlStringCheck, (err, result) => {
        if(err){
            console.log(err)
            return
        }
        else{

            var removeNotification = `DELETE FROM maindatabase.notifications WHERE feedpostid = ${req.body.feedPostID} AND notification_userid = ${req.body.userid} AND voteid IS NOT NULL`
            con.query(removeNotification, (err, result) => {
                if(err){
                    console.log(err)
                    return
                }

            })


         
            var sqlString = `DELETE FROM maindatabase.userpostvotes WHERE feedpostid = ${req.body.feedPostID} AND userid = ${req.body.userid}`
                //remove the point to posts table
            var addedVote =  currentVotes - 1
            
            var addToVotes = `UPDATE maindatabase.feedposts SET feedpostpoints = ${addedVote} WHERE feedpostid = ${req.body.feedPostID}`
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