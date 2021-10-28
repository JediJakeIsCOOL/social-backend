var express = require("express");
var router = express.Router();
var db = require('../../database');
var con = db.con
const fs = require('fs');

router.post('/removeFeedPost', (req, res) => {
    console.log(req.body.feedpic)
    if(req.body.feedpic !== ''){    
        const lastPicPath = '../gameshiz/public' + req.body.feedpic
        if (fs.existsSync(lastPicPath)){
            fs.unlink(lastPicPath, (err) =>{
                if (err) throw err
                console.log(lastPicPath + ' was deleted');
            })
        }
    }
  
        var sqlString = `DELETE FROM gamelink_dev_db.gamelink_feedposts WHERE gamelink_feedpostid = ${req.body.feedPostID}`


        con.query(sqlString, (err, result) => {
            if(err){
                console.log(err)
                return
            }
            
        })

        var sqlString = `DELETE FROM gamelink_dev_db.gamelink_feedpostcomments WHERE gamelink_feedpostid = ${req.body.feedPostID}`


        con.query(sqlString, (err, result) => {
            if(err){
                console.log(err)
                return
            }
            
        })


        var sqlString = `DELETE FROM gamelink_dev_db.gamelink_notifications WHERE gamelink_feedpostid = ${req.body.feedPostID}`


        con.query(sqlString, (err, result) => {
            if(err){
                console.log(err)
                return
            }
            
        })

        var sqlString = `DELETE FROM gamelink_dev_db.gamelink_usersgames WHERE gamelink_userid = ${req.body.userid} AND gamelink_gameid = ${req.body.gameid}`


        con.query(sqlString, (err, result) => {
            if(err){
                console.log(err)
                return
            }
            
        })

        var sqlString = `DELETE FROM gamelink_dev_db.gamelink_userpostvotes WHERE gamelink_userid = ${req.body.userid} AND gamelink_feedpostid = ${req.body.feedPostID}`


        con.query(sqlString, (err, result) => {
            if(err){
                console.log(err)
                return
            }
            
        })


        var sqlString = `DELETE FROM thegamesdb_db.game_ratings WHERE game_userid = ${req.body.userid} AND game_id = ${req.body.gameid}`

        con.query(sqlString, (err, result) => {
            if(err){
                console.log(err)
                return
            }
            res.send('deleted feed post')
        })
})


module.exports = router;