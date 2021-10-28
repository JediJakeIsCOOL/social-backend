var express = require("express");
var router = express.Router();

var db = require('../../database');

var con = db.con;


router.get('/getusergames/:userid/:currentlyplaying', (req, res) => {

	if(req.params.currentlyplaying === '2'){
		var getUserGames = `
			SELECT gamelink_usersgames.*, ROUND(AVG(game_ratings.rating), 2) AS rating, game_ratings.game_review, games.game_title, platforms.name, gamelink_feedposts.gamelink_feedpostid
			FROM gamelink_dev_db.gamelink_usersgames
			LEFT JOIN thegamesdb_db.game_ratings ON gamelink_usersgames.gamelink_gameid = game_ratings.game_id AND gamelink_usersgames.gamelink_userid = game_ratings.game_userid
			left JOIN thegamesdb_db.games ON gamelink_usersgames.gamelink_gameid = games.id
			left JOIN thegamesdb_db.platforms ON games.platform = platforms.id
			left join gamelink_dev_db.gamelink_feedposts ON gamelink_feedposts.gamelink_userid = gamelink_usersgames.gamelink_userid AND gamelink_feedposts.gamelink_gameid = gamelink_usersgames.gamelink_gameid
			WHERE gamelink_usersgames.gamelink_userid = ${req.params.userid} AND gamelink_feedposts.gamelink_isreview = 1
			GROUP BY gamelink_usersgames.gamelink_gameid
		`
	
	} else {
		 getUserGames = `
			SELECT gamelink_usersgames.*, ROUND(AVG(game_ratings.rating), 2) AS rating, game_ratings.game_review, games.game_title, platforms.name, gamelink_feedposts.gamelink_feedpostid
			FROM gamelink_dev_db.gamelink_usersgames
			LEFT JOIN thegamesdb_db.game_ratings ON gamelink_usersgames.gamelink_gameid = game_ratings.game_id AND gamelink_usersgames.gamelink_userid = game_ratings.game_userid
			left JOIN thegamesdb_db.games ON gamelink_usersgames.gamelink_gameid = games.id
			left JOIN thegamesdb_db.platforms ON games.platform = platforms.id
			left join gamelink_dev_db.gamelink_feedposts ON gamelink_feedposts.gamelink_userid = gamelink_usersgames.gamelink_userid AND gamelink_feedposts.gamelink_gameid = gamelink_usersgames.gamelink_gameid
			WHERE gamelink_usersgames.gamelink_userid = ${req.params.userid} AND gamelink_feedposts.gamelink_currentlyplaying = ${req.params.currentlyplaying}
			GROUP BY gamelink_usersgames.gamelink_gameid
		`
	}
	
	con.query(getUserGames, function (err, result) {
		if(err){
			console.log(err)
			return
		}
		res.send(result)
			
		// set up login session and what not
	
	 })
	 
	
})


module.exports = router;