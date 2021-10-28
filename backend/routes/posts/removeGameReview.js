var express = require("express");
var router = express.Router();
var db = require('../../database');
var con = db.con


router.post('/removeGameReview', (req, res) => {

    var getFeedPostId = `Select feedpostid from maindatabase.feedposts WHERE userid = ${req.body.userid} AND nftid = ${req.body.gameid}`

    con.query(getFeedPostId, (err, result) => {
        if(err){
            console.log(err)
            return
        }

        var feedPostId = result[0].feedpostid


        
        var sqlString = `DELETE FROM maindatabase.feedposts WHERE userid = ${req.body.userid} AND nftid = ${req.body.gameid}`


        con.query(sqlString, (err, result) => {
            if(err){
                console.log(err)
                return
            }
            
        })

        var sqlString = `DELETE FROM maindatabase.userpostvotes WHERE userid = ${req.body.userid} AND feedpostid = ${feedPostId}`


        con.query(sqlString, (err, result) => {
            if(err){
                console.log(err)
                return
            }
            
        })

        var sqlString = `DELETE FROM maindatabase.usersnfts WHERE userid = ${req.body.userid} AND nftid = ${req.body.gameid}`

        con.query(sqlString, (err, result) => {
            if(err){
                console.log(err)
                return
            }
        })

        var sqlString = `DELETE FROM nfttableyay.nft_ids WHERE game_userid = ${req.body.userid} AND game_id = ${req.body.gameid}`

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