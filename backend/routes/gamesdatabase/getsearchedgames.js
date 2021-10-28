var express = require("express");
var router = express.Router();

var async = require("async");

var db = require('../../gamedatabase.js');

var con = db.con;

router.get('/getsearchedgames/:search', (req, res) => {
    const platformFilterList = '1, 2, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 4971, 2, 3, 9, 4912, 38, 41, 4915, 4916, 4919, 4920, 4971, 4980, 4981'

	let getGameSearch = 
    `SELECT games.game_title, games.id, platforms.name AS PlatformName, ROUND(AVG(game_ratings.rating), 2) AS rating 
    FROM games 
    JOIN platforms ON platforms.id = games.platform 
    LEFT JOIN game_ratings ON games.id = game_ratings.game_id
    WHERE games.game_title LIKE "%${req.params.search}%" AND games.platform IN (${platformFilterList}) 
    GROUP BY games.id
    LIMIT 20` 

	con.query(getGameSearch, function (err, result1) {
        if(err){
            console.log(err)
            return
        }
        if(result1.length){
            const startUrl = 'https://cdn.thegamesdb.net/images/original/'

            async.eachOfSeries(result1, function(datum, i, inner_callback){
               
                const getGameImages = `SELECT filename FROM banners WHERE type = 'boxart' AND side = 'front' AND games_id = ${datum.id}`
                con.query(getGameImages, function (err, result) {
                    
                    if(err){
                        console.log(err)
                        return
                    }
                    if(result.length){
                        result1[i]['game_image_url'] = startUrl + result[0].filename
                       
                    }
                    inner_callback(err)
                })
                
            }, function(err){
                res.send(result1)
            })
        }
    })
})


module.exports = router;