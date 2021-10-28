var express = require("express");
var router = express.Router();
var db = require('../../database');
var con = db.con


router.post('/postUserFollow', (req, res) => {
    console.log(req.body)

    let getViewedUserid = `SELECT userid from maindatabase.users WHERE username = "${req.body.username}"`

    con.query(getViewedUserid, (err, result) => {
        if(err){
            console.log(err)
            return
        }
        const viewedUserId = result[0].userid

        if(req.body.follow == 1){
            var sqlString = `INSERT INTO maindatabase.userfollows (userid, followed_userid) VALUES (${req.body.userid}, ${viewedUserId})`
        } else {
            var sqlString = `DELETE FROM maindatabase.userfollows WHERE userid = ${req.body.userid} AND followed_userid = ${viewedUserId}`
        }
        

        
    
        con.query(sqlString, (err, result) => {
            if(err){
                console.log(err)
                return
            }
            if(req.body.follow == 1){
                var insertNotifications = `INSERt INTO maindatabase.notifications (postuserid, notification_userid, 
                    followid) VALUES (${viewedUserId}, ${req.body.userid}, ${result.insertId}) `
            } else {
    
                var insertNotifications = `DELETE FROM maindatabase.notifications WHERE postuserid = ${viewedUserId} AND notification_userid = ${req.body.userid}`
            }
        
            con.query(insertNotifications, (err, result) => {
                if(err){
                    console.log(err)
                    return
                }
                if(req.body.follow == 1){
                    res.send('1')
                } else {
                    res.send('0')
                }
            })
                
        })
    })

    
	
})

module.exports = router;