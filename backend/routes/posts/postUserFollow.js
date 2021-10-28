var express = require("express");
var router = express.Router();
var db = require('../../database');
var con = db.con


router.post('/postUserFollow', (req, res) => {
    console.log(req.body)

    let getViewedUserid = `SELECT gamelink_userid from gamelink_dev_db.gamelink_users WHERE gamelink_username = "${req.body.username}"`

    con.query(getViewedUserid, (err, result) => {
        if(err){
            console.log(err)
            return
        }
        const viewedUserId = result[0].gamelink_userid

        if(req.body.follow == 1){
            var sqlString = `INSERT INTO gamelink_dev_db.gamelink_userfollows (gamelink_userid, gamelink_followed_userid) VALUES (${req.body.userid}, ${viewedUserId})`
        } else {
            var sqlString = `DELETE FROM gamelink_dev_db.gamelink_userfollows WHERE gamelink_userid = ${req.body.userid} AND gamelink_followed_userid = ${viewedUserId}`
        }
        

        
    
        con.query(sqlString, (err, result) => {
            if(err){
                console.log(err)
                return
            }
            if(req.body.follow == 1){
                var insertNotifications = `INSERt INTO gamelink_dev_db.gamelink_notifications (gamelink_postuserid, gamelink_notification_userid, 
                    gamelink_followid) VALUES (${viewedUserId}, ${req.body.userid}, ${result.insertId}) `
            } else {
    
                var insertNotifications = `DELETE FROM gamelink_dev_db.gamelink_notifications WHERE gamelink_postuserid = ${viewedUserId} AND gamelink_notification_userid = ${req.body.userid}`
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