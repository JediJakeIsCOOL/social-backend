var express = require("express");
var router = express.Router();
var db = require('../../database');
var con = db.con


router.post('/removeGameReview', (req, res) => {

    var getFeedPostId = `Select gamelink_feedpostid from gamelink_dev_db.gamelink_feedposts WHERE gamelink_userid = ${req.body.userid} AND gamelink_gameid = ${req.body.gameid}`

    con.query(getFeedPostId, (err, result) => {
        if(err){
            console.log(err)
            return
        }

        var feedPostId = result[0].gamelink_feedpostid


        
        var sqlString = `DELETE FROM gamelink_dev_db.gamelink_feedposts WHERE gamelink_userid = ${req.body.userid} AND gamelink_gameid = ${req.body.gameid}`


        con.query(sqlString, (err, result) => {
            if(err){
                console.log(err)
                return
            }
            
        })

        var sqlString = `DELETE FROM gamelink_dev_db.gamelink_userpostvotes WHERE gamelink_userid = ${req.body.userid} AND gamelink_feedpostid = ${feedPostId}`


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

        var sqlString = `DELETE FROM thegamesdb_db.game_ratings WHERE game_userid = ${req.body.userid} AND game_id = ${req.body.gameid}`

        con.query(sqlString, (err, result) => {
            if(err){
                console.log(err)
                return
            }
            res.send('deleted game review')
        })
    })

})

module.exports = router;