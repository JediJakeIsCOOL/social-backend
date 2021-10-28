var express = require("express");
var router = express.Router();
var db = require('../../database');
var con = db.con


router.post('/removeCommentVote', (req, res) => {

  
    var sqlStringCheck = `SELECT userid from maindatabase.userpostvotes WHERE feedpostcomment_id = ${req.body.commentpostid} AND userid = ${req.body.userid}`

    
    var getCurrentVotes = `Select commentpostpoints FROM maindatabase.feedpostcomments WHERE feedpostcomment_id = ${req.body.commentpostid}`



    con.query(getCurrentVotes, (err, result) => {
        if(err){
            console.log(err)
            return
        } 
        currentVotes = result[0].commentpostpoints
        
    })

  

    con.query(sqlStringCheck, (err, result) => {
        if(err){
            console.log(err)
            return
        }
        else{

            var removeNotification = `DELETE FROM maindatabase.notifications WHERE feedpostcomment_id = ${req.body.commentpostid} AND notification_userid = ${req.body.userid} AND voteid IS NOT NULL`
            con.query(removeNotification, (err, result) => {
                if(err){
                    console.log(err)
                    return
                }

            })
         
            var sqlString = `DELETE FROM maindatabase.userpostvotes WHERE feedpostcomment_id = ${req.body.commentpostid} AND userid = ${req.body.userid}`
                //remove the point to posts table
            var addedVote =  currentVotes - 1
            var addToVotes = `UPDATE maindatabase.feedpostcomments SET commentpostpoints = ${addedVote} WHERE feedpostcomment_id = ${req.body.commentpostid}`
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