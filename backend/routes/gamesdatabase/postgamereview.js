var express = require("express");
var router = express.Router();

var async = require("async");

var db = require('../../gamedatabase.js');

var db2 = require('../../database');

var con2 = db2.con
var con = db.con;

router.post('/postgamereview', (req, res) => {

    let deleteOtherSameGameReviewsByUser = `
        DELETE FROM thegamesdb_db.game_ratings
        WHERE game_id = ${req.body.gameid} AND game_userid =  ${req.body.userid}
    `

    con.query(deleteOtherSameGameReviewsByUser, function (err, result1) {
        if(err){
            console.log(err)
            return
        }  
    })

	let getGameSearch = 
    `INSERT INTO thegamesdb_db.game_ratings (game_id, rating, game_review, game_userid)
    VALUES (${req.body.gameid}, ${req.body.rating}, "${req.body.review}", ${req.body.userid})` 

	con.query(getGameSearch, function (err, result1) {
        if(err){
            console.log(err)
            return
        }
        
        if(req.body.topGame === 1){
            var addReviewToFeed = `
                INSERT INTO gamelink_dev_db.gamelink_feedposts (gamelink_feeddate, gamelink_feedpostmedia, gamelink_userid, gamelink_isreview, gamelink_gameid, gamelink_feedpostpoints, gamelink_topgame, gamelink_currentlyplaying)
                VALUES (NOW(), "${req.body.gameart}", ${req.body.userid}, 1, ${req.body.gameid}, 1, 1, ${req.body.currentGame})
            `
        } else {
            var addReviewToFeed = `
                INSERT INTO gamelink_dev_db.gamelink_feedposts (gamelink_feeddate, gamelink_feedpostmedia, gamelink_userid, gamelink_isreview, gamelink_gameid, gamelink_feedpostpoints, gamelink_currentlyplaying)
                VALUES (NOW(), "${req.body.gameart}", ${req.body.userid}, 1, ${req.body.gameid}, 1, ${req.body.currentGame})
            `
        }
        con2.query(addReviewToFeed, function (err, result1) {
            if(err){
                console.log(err)
                return
            }

            
            var selectLastFeedPost = `Select gamelink_feedpostid from gamelink_dev_db.gamelink_feedposts WHERE gamelink_userid = ${req.body.userid} ORDER BY gamelink_feedpostid DESC`

            con2.query(selectLastFeedPost, (err, result) => {
                if(err){
                    console.log(err)
                    return
                }
                const feedpostId = result[0].gamelink_feedpostid
                var insertIntoVotes = `INSERT INTO gamelink_dev_db.gamelink_userpostvotes (gamelink_feedpostid, gamelink_userid, gamelink_vote) VALUES (${feedpostId}, ${req.body.userid}, 1)`
                con2.query(insertIntoVotes, (err, result) => {
                    if(err){
                        console.log(err)
                        return
                    }

                })
            })
        })
        
        res.send('success')
        
    })
})


module.exports = router;