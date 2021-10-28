var express = require("express");
var router = express.Router();

var db = require('../../database');

var con = db.con;


router.get('/mainfeed/:feedtype/:userid', (req, res) => {
	
	if(req.params.feedtype === '1'){

		if(req.params.userid){
			var retreiveProfileInfo = `SELECT gamelink_feedposts.*, gamelink_userpostvotes.gamelink_voteid, gamelink_users.gamelink_username,  gamelink_users.gamelink_userpic,  gamelink_users.gamelink_userid, games.game_title, platforms.name AS platform_name, game_ratings.game_review, game_ratings.rating, IFNULL(t2.commentCount, 0) AS commentCount
			FROM gamelink_dev_db.gamelink_feedposts
			JOIN gamelink_dev_db.gamelink_users ON gamelink_users.gamelink_userid = gamelink_feedposts.gamelink_userid
			left JOIN ( SELECT gamelink_feedpostcomments.gamelink_feedpostid, count(gamelink_feedpostcomments.gamelink_feedpostcomment_id) AS commentCount from gamelink_dev_db.gamelink_feedpostcomments group by gamelink_feedpostcomments.gamelink_feedpostid) t2 ON t2.gamelink_feedpostid = gamelink_feedposts.gamelink_feedpostid
			LEFT JOIN gamelink_dev_db.gamelink_userpostvotes ON gamelink_feedposts.gamelink_userid = gamelink_userpostvotes.gamelink_userid
			left join gamelink_dev_db.gamelink_usersgames ON gamelink_usersgames.gamelink_gameid = gamelink_feedposts.gamelink_gameid
			LEFT JOIN gamelink_dev_db.gamelink_blockusers ON gamelink_users.gamelink_userid = gamelink_blockusers.gamelink_blocked_userid AND gamelink_blockusers.gamelink_userid =  ${req.params.userid}
			LEFT JOIN gamelink_dev_db.gamelink_hideposts ON gamelink_feedposts.gamelink_feedpostid = gamelink_hideposts.gamelink_feedpostid AND gamelink_hideposts.gamelink_userid = ${req.params.userid}
			LEFT JOIN thegamesdb_db.games ON gamelink_feedposts.gamelink_gameid = games.id
			LEFT JOIN thegamesdb_db.platforms ON games.platform = platforms.id
			LEFT JOIN thegamesdb_db.game_ratings ON gamelink_feedposts.gamelink_gameid = game_ratings.game_id AND gamelink_feedposts.gamelink_userid = game_ratings.game_userid
			WHERE gamelink_blockusers.gamelink_blocked_userid IS NULL AND gamelink_hideposts.gamelink_feedpostid IS NULL
			Group By gamelink_feedposts.gamelink_feedpostid
			ORDER BY gamelink_feedposts.gamelink_feedpostid DESC`
		} else {
			var retreiveProfileInfo = `SELECT gamelink_feedposts.*, gamelink_userpostvotes.gamelink_voteid, gamelink_users.gamelink_username,  gamelink_users.gamelink_userpic,  gamelink_users.gamelink_userid, games.game_title, platforms.name AS platform_name, game_ratings.game_review, game_ratings.rating, IFNULL(t2.commentCount, 0) AS commentCount
			FROM gamelink_dev_db.gamelink_feedposts
			JOIN gamelink_dev_db.gamelink_users ON gamelink_users.gamelink_userid = gamelink_feedposts.gamelink_userid
			left JOIN ( SELECT gamelink_feedpostcomments.gamelink_feedpostid, count(gamelink_feedpostcomments.gamelink_feedpostcomment_id) AS commentCount from gamelink_dev_db.gamelink_feedpostcomments group by gamelink_feedpostcomments.gamelink_feedpostid) t2 ON t2.gamelink_feedpostid = gamelink_feedposts.gamelink_feedpostid
			LEFT JOIN gamelink_dev_db.gamelink_userpostvotes ON gamelink_feedposts.gamelink_userid = gamelink_userpostvotes.gamelink_userid
			left join gamelink_dev_db.gamelink_usersgames ON gamelink_usersgames.gamelink_gameid = gamelink_feedposts.gamelink_gameid
			LEFT JOIN thegamesdb_db.games ON gamelink_feedposts.gamelink_gameid = games.id
			LEFT JOIN thegamesdb_db.platforms ON games.platform = platforms.id
			LEFT JOIN thegamesdb_db.game_ratings ON gamelink_feedposts.gamelink_gameid = game_ratings.game_id AND gamelink_feedposts.gamelink_userid = game_ratings.game_userid
			Group By gamelink_feedposts.gamelink_feedpostid
			ORDER BY gamelink_feedposts.gamelink_feedpostid DESC`
		}


		con.query(retreiveProfileInfo, function (err, result1) {
			var userVotePostIds = []
			if(err){
				console.log(err)
				return
			} else {
				if(req.params.userid){
	
					var checkForLoggedInPostVotes = `SELECT gamelink_feedpostid from gamelink_dev_db.gamelink_userpostvotes WHERE gamelink_userid = ${req.params.userid} AND gamelink_feedpostcomment_id IS NULL`
	
					con.query(checkForLoggedInPostVotes, function (err, result) {
						if(err){
							console.log(err)
							return
						}
						for(var x = 0; x < result.length; x++){
							userVotePostIds.push(parseInt(result[x].gamelink_feedpostid))
						}
						if(result1.length){
							result1[0]['userVoteIds'] = userVotePostIds	
							res.send(result1)
						}
					})
				} else {
				
					if(result1.length){
					result1[0].userVoteIds = userVotePostIds
					}
					
					res.send(result1)
				}
	
			
			}
		 })
	} else if (req.params.feedtype === "2" && req.params.userid) {
		//feedpostid not coming through?

		let selectFollowed = `SELECT gamelink_followed_userid FROM gamelink_dev_db.gamelink_userfollows WHERE gamelink_userid = ${req.params.userid}`
		
		var followedUserIds = []
		con.query(selectFollowed, function (err, result2) {
			if(err){
				console.log(err)
				return
			}

			for(var x = 0; x < result2.length; x++){
				followedUserIds.push(result2[x].gamelink_followed_userid)
			}

			if(result2.length){
				var getFollowedUsersPosts = 
				`SELECT DISTINCT gamelink_feedposts.*, gamelink_users.gamelink_username,  gamelink_users.gamelink_userpic,  gamelink_users.gamelink_userid, games.game_title, platforms.name AS platform_name, game_ratings.game_review, game_ratings.rating, IFNULL(t2.commentCount, 0) AS commentCount
				FROM gamelink_dev_db.gamelink_feedposts
				JOIN gamelink_dev_db.gamelink_users ON gamelink_users.gamelink_userid = gamelink_feedposts.gamelink_userid
				left JOIN ( SELECT gamelink_feedpostcomments.gamelink_feedpostid, count(gamelink_feedpostcomments.gamelink_feedpostcomment_id) AS commentCount from gamelink_dev_db.gamelink_feedpostcomments group by gamelink_feedpostcomments.gamelink_feedpostid) t2 ON t2.gamelink_feedpostid = gamelink_feedposts.gamelink_feedpostid
				LEFT JOIN gamelink_dev_db.gamelink_blockusers ON gamelink_users.gamelink_userid = gamelink_blockusers.gamelink_blocked_userid AND gamelink_blockusers.gamelink_userid =  ${req.params.userid}
			LEFT JOIN gamelink_dev_db.gamelink_hideposts ON gamelink_feedposts.gamelink_feedpostid = gamelink_hideposts.gamelink_feedpostid AND gamelink_hideposts.gamelink_userid = ${req.params.userid}
				LEFT JOIN gamelink_dev_db.gamelink_userpostvotes ON gamelink_feedposts.gamelink_userid = gamelink_userpostvotes.gamelink_userid
				LEFT JOIN thegamesdb_db.games ON gamelink_feedposts.gamelink_gameid = games.id
				LEFT JOIN thegamesdb_db.platforms ON games.platform = platforms.id
				LEFT JOIN thegamesdb_db.game_ratings ON gamelink_feedposts.gamelink_gameid = game_ratings.game_id AND gamelink_feedposts.gamelink_userid = game_ratings.game_userid 
				WHERE gamelink_feedposts.gamelink_userid IN (${followedUserIds}) AND gamelink_blockusers.gamelink_userid IS NULL AND gamelink_hideposts.gamelink_feedpostid IS NULL
				ORDER BY gamelink_feedposts.gamelink_feedpostid DESC `
			
				con.query(getFollowedUsersPosts, function (err, result1) {
					var userVotePostIds = []
					if(err){
						console.log(err)
						return
					} else {
						// is there a uservote made by the logged in user already on the posts that are displayed, loop through the feedpost id s and do a select with them
						
						if(req.params.userid){
			
							var checkForLoggedInPostVotes = `SELECT gamelink_feedpostid from gamelink_dev_db.gamelink_userpostvotes WHERE gamelink_userid = ${req.params.userid} AND gamelink_feedpostcomment_id IS NULL`
			
							con.query(checkForLoggedInPostVotes, function (err, result) {
								if(err){
									console.log(err)
									return
								}
								for(var x = 0; x < result.length; x++){
									userVotePostIds.push(parseInt(result[x].gamelink_feedpostid))
								}
							
								if(result1.length){
									result1[0]['userVoteIds'] = userVotePostIds	
									res.send(result1)
								}
							})
						} else {
						
							if(result1.length){
							result1[0].userVoteIds = userVotePostIds
							}
							
							res.send(result1)
						}
			
					
					}
				})
			} else {
				res.send("")
			}

		})

		//notifications
	} else if (req.params.feedtype === "3" && req.params.userid) {
		
		// var sqlString = 
		// 	`SELECT DISTINCT gamelink_feedposts.gamelink_feedpostid, gamelink_notifications.*,  gamelink_feedposts.gamelink_currentlyplaying, gamelink_feedposts.gamelink_topgame, gamelink_users.gamelink_username, 
		// 	gamelink_feedpostcomments.gamelink_feeddate, gamelink_feedpostcomments.gamelink_usercomment, gamelink_users.gamelink_userpic, games.game_title,
		// 	gamelink_feedposts.gamelink_feedmessage, gamelink_feedposts.gamelink_isreview, platforms.name AS platform_name, gamelink_feedposts.gamelink_userid
		// 	FROM gamelink_dev_db.gamelink_notifications
		// 	JOIN gamelink_dev_db.gamelink_notifications ON gamelink_notifications.gamelink_feedpostid = gamelink_feedposts.gamelink_feedpostid
		// 	JOIN gamelink_dev_db.gamelink_users ON gamelink_notifications.gamelink_notification_userid = gamelink_users.gamelink_userid
		//  	JOIN gamelink_dev_db.gamelink_feedpostcomments ON gamelink_feedpostcomments.gamelink_userid_comment = gamelink_users.gamelink_userid
		// 	LEFT JOIN gamelink_dev_db.gamelink_userpostvotes ON gamelink_users.gamelink_userid = gamelink_userpostvotes.gamelink_userid
		// 	left 
		
	
		// 	WHERE gamelink_feedposts.gamelink_userid = ${req.params.userid} AND gamelink_feedpostcomments.gamelink_userid_comment != ${req.params.userid} AND gamelink_userpostvotes.gamelink_userid != ${req.params.userid}
		// 	ORDER BY gamelink_notifications.gamelink_notificationid`


		var sqlString = `Select gamelink_notifications.*, gamelink_users.gamelink_username, gamelink_feedpostcomments.gamelink_feedpostmedia, 
			gamelink_users.gamelink_userpic, gamelink_feedpostcomments.gamelink_usercomment, gamelink_feedpostcomments.gamelink_feedpostcomment_id,
			IFNULL(gamelink_feedposts.gamelink_currentlyplaying, 0) AS gamelink_currentlyplaying , IFNULL(gamelink_feedposts.gamelink_topgame, 0) as gamelink_topgame, games.game_title, platforms.name AS platform_name,
			IFNULL(gamelink_feedposts.gamelink_isreview, 0) AS gamelink_isreview, gamelink_feedposts.gamelink_feedmessage, gamelink_feedposts.gamelink_feedpostmedia AS postMedia
			FROM gamelink_dev_db.gamelink_notifications
			left JOIN gamelink_dev_db.gamelink_feedposts ON gamelink_feedposts.gamelink_feedpostid = gamelink_notifications.gamelink_feedpostid 
			JOIN gamelink_dev_db.gamelink_users ON gamelink_notifications.gamelink_notification_userid = gamelink_users.gamelink_userid
			left JOIN gamelink_dev_db.gamelink_feedpostcomments ON gamelink_notifications.gamelink_feedpostcomment_id = gamelink_feedpostcomments.gamelink_feedpostcomment_id
			left join gamelink_dev_db.gamelink_userpostvotes ON gamelink_notifications.gamelink_voteid = gamelink_userpostvotes.gamelink_voteid 
			left join gamelink_dev_db.gamelink_usersgames ON gamelink_usersgames.gamelink_gameid = gamelink_feedposts.gamelink_gameid
			LEFT JOIN gamelink_dev_db.gamelink_blockusers ON gamelink_users.gamelink_userid = gamelink_blockusers.gamelink_blocked_userid AND gamelink_blockusers.gamelink_userid =  ${req.params.userid}
			LEFT JOIN gamelink_dev_db.gamelink_hideposts ON gamelink_feedposts.gamelink_feedpostid = gamelink_hideposts.gamelink_feedpostid AND gamelink_hideposts.gamelink_userid = ${req.params.userid}
			LEFT JOIN thegamesdb_db.games ON gamelink_feedposts.gamelink_gameid = games.id
			LEFT JOIN thegamesdb_db.platforms ON games.platform = platforms.id
			WHERE gamelink_notifications.gamelink_postuserid = ${req.params.userid} AND gamelink_blockusers.gamelink_blocked_userid IS NULL AND gamelink_hideposts.gamelink_feedpostid IS NULL
			order by gamelink_notifications.gamelink_notificationid DESC
		` 

		// just get the feedpost ids , loop through them each and add the results as array of arrays or some shit 
		//still need to add back in block rules
		


			var getLoggedUser = `SELECT gamelink_username from gamelink_dev_db.gamelink_users where gamelink_userid = ${req.params.userid}`

			con.query(getLoggedUser, function (err, result1) {
				if(err){
					console.log(err)
					return
				}


				
				con.query(sqlString, function (err, result) {
					if(err){
						console.log(err)
						return
					}
					if(result.length){
						result[0].loggedUserName = result1[0].gamelink_username
					} else {
	
					}
					res.send(result)
			
					
				})
					
			})



			// look through comments and votes where the userid of the person voted on is the logged in user, 
			// then also get the user information of the people who voted or commented


			
				// where gamelink_blockusers.gamelink_userid IS NULL AND gamelink_hideposts.gamelink_feedpostid IS NULL AND

			// need only the results with the logged in userid, but we only have the feed post so maybe two queries
		
	}

	

		

	
})


module.exports = router;