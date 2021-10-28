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
  
        var sqlString = `DELETE FROM maindatabase.feedposts WHERE feedpostid = ${req.body.feedPostID}`


        con.query(sqlString, (err, result) => {
            if(err){
                console.log(err)
                return
            }
            
        })

        var sqlString = `DELETE FROM maindatabase.feedpostcomments WHERE feedpostid = ${req.body.feedPostID}`


        con.query(sqlString, (err, result) => {
            if(err){
                console.log(err)
                return
            }
            
        })


        var sqlString = `DELETE FROM maindatabase.notifications WHERE feedpostid = ${req.body.feedPostID}`


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

        var sqlString = `DELETE FROM maindatabase.userpostvotes WHERE userid = ${req.body.userid} AND feedpostid = ${req.body.feedPostID}`


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
            res.send('deleted feed post')
        })
})


module.exports = router;