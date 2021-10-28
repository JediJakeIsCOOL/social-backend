var express = require("express");
var router = express.Router();

var db = require('../../database');

var con = db.con;


router.get('/mainfeed/:feedtype/:userid', (req, res) => {

	if(req.params.feedtype === '1'){

		if(req.params.userid){
			var retreiveProfileInfo = `SELECT feedposts.*, userpostvotes.voteid, users.username,
			users.userpic,  users.userid, IFNULL(t2.commentCount, 0) AS commentCount
			FROM maindatabase.feedposts
			JOIN maindatabase.users ON users.userid = feedposts.userid
			left JOIN ( SELECT feedpostcomments.feedpostid, count(feedpostcomments.feedpostcomment_id) AS commentCount
			from maindatabase.feedpostcomments group by feedpostcomments.feedpostid) t2 ON t2.feedpostid = feedposts.feedpostid
			LEFT JOIN maindatabase.userpostvotes ON feedposts.userid = userpostvotes.userid
			left join maindatabase.usersnfts ON usersnfts.nftid = feedposts.nftid
			LEFT JOIN maindatabase.blockusers ON users.userid = blockusers.blocked_userid AND blockusers.userid =  ${req.params.userid}
			LEFT JOIN maindatabase.hideposts ON feedposts.feedpostid = hideposts.feedpostid AND hideposts.userid = ${req.params.userid}
			WHERE blockusers.blocked_userid IS NULL AND hideposts.feedpostid IS NULL
			Group By feedposts.feedpostid
			ORDER BY feedposts.feedpostpoints DESC`
			//i need the feedpostpoints sorted by it
			// LEFT JOIN nfttableyay.nft_ids ON feedposts.nftid = games.id
			// LEFT JOIN nfttableyay.platforms ON games.platform = platforms.id
			// LEFT JOIN nfttableyay.nft_ids ON feedposts.nftid = nft_ratings.nft_id AND feedposts.userid = nft_ratings.nft_ratinguserid
		} else {
			var retreiveProfileInfo = `SELECT feedposts.*, userpostvotes.voteid, users.username,
			users.userpic,  users.userid,
			IFNULL(t2.commentCount, 0) AS commentCount
			FROM maindatabase.feedposts
			JOIN maindatabase.users ON users.userid = feedposts.userid
			left JOIN ( SELECT feedpostcomments.feedpostid, count(feedpostcomments.feedpostcomment_id) AS commentCount
			from maindatabase.feedpostcomments group by feedpostcomments.feedpostid) t2 ON t2.feedpostid = feedposts.feedpostid
			LEFT JOIN maindatabase.userpostvotes ON feedposts.userid = userpostvotes.userid
			left join maindatabase.usersnfts ON usersnfts.nftid = feedposts.nftid
			Group By feedposts.feedpostid
			ORDER BY feedposts.feedpostpoints DESC`
		}
		// LEFT JOIN nfttableyay.nft_ids ON feedposts.nftid = games.id
		// LEFT JOIN nfttableyay.platforms ON games.platform = platforms.id
		// LEFT JOIN nfttableyay.nft_ids ON feedposts.nftid = nft_ratings.nft_id AND feedposts.userid = nft_ratings.nft_ratinguserid

		con.query(retreiveProfileInfo, function (err, result1) {
			var userVotePostIds = []
			if(err){
				console.log(err)
				return
			} else {
				if(req.params.userid){

					var checkForLoggedInPostVotes = `SELECT feedpostid from maindatabase.userpostvotes WHERE userid = ${req.params.userid}
					AND feedpostcomment_id IS NULL`

					con.query(checkForLoggedInPostVotes, function (err, result) {
						if(err){
							console.log(err)
							return
						}
						for(var x = 0; x < result.length; x++){
							userVotePostIds.push(parseInt(result[x].feedpostid))
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

		let selectFollowed = `SELECT followed_userid FROM maindatabase.userfollows WHERE userid = ${req.params.userid}`

		var followedUserIds = []
		con.query(selectFollowed, function (err, result2) {
			if(err){
				console.log(err)
				return
			}

			for(var x = 0; x < result2.length; x++){
				followedUserIds.push(result2[x].followed_userid)
			}

			if(result2.length){
				var getFollowedUsersPosts =
				`SELECT feedposts.*, users.username,  users.userpic,  users.userid,  AS platform_name,  nft_ratings.nft_rating, IFNULL(t2.commentCount, 0) AS commentCount
				FROM maindatabase.feedposts
				JOIN maindatabase.users ON users.userid = feedposts.userid
				left JOIN ( SELECT feedpostcomments.feedpostid, count(feedpostcomments.feedpostcomment_id) AS commentCount from maindatabase.feedpostcomments group by feedpostcomments.feedpostid) t2 ON t2.feedpostid = feedposts.feedpostid
				LEFT JOIN maindatabase.blockusers ON users.userid = blockusers.blocked_userid AND blockusers.userid =  ${req.params.userid}
				LEFT JOIN maindatabase.hideposts ON feedposts.feedpostid = hideposts.feedpostid AND hideposts.userid = ${req.params.userid}
				LEFT JOIN maindatabase.userpostvotes ON feedposts.userid = userpostvotes.userid
				WHERE feedposts.userid IN (${followedUserIds}) AND blockusers.userid IS NULL AND hideposts.feedpostid IS NULL
				ORDER BY feedposts.feedpostid DESC `
				// LEFT JOIN nfttableyay.nft_ids ON feedposts.nftid = games.id
				// LEFT JOIN nfttableyay.platforms ON games.platform = platforms.id
				// LEFT JOIN nfttableyay.nft_ids ON feedposts.nftid = nft_ratings.nft_id AND feedposts.userid = nft_ratings.nft_ratinguserid
				con.query(getFollowedUsersPosts, function (err, result1) {
					var userVotePostIds = []
					if(err){
						console.log(err)
						return
					} else {
						// is there a uservote made by the logged in user already on the posts that are displayed, loop through the feedpost id s and do a select with them

						if(req.params.userid){

							var checkForLoggedInPostVotes = `SELECT feedpostid from maindatabase.userpostvotes WHERE userid = ${req.params.userid} AND feedpostcomment_id IS NULL`

							con.query(checkForLoggedInPostVotes, function (err, result) {
								if(err){
									console.log(err)
									return
								}
								for(var x = 0; x < result.length; x++){
									userVotePostIds.push(parseInt(result[x].feedpostid))
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
		// 	`SELECT DISTINCT feedposts.feedpostid, notifications.*,  feedposts.currentlytrading, feedposts.favoritenft, users.username,
		// 	feedpostcomments.feeddate, feedpostcomments.usercomment, users.userpic, ,
		// 	feedposts.feedmessage, feedposts.isreview AS platform_name, feedposts.userid
		// 	FROM maindatabase.notifications
		// 	JOIN maindatabase.notifications ON notifications.feedpostid = feedposts.feedpostid
		// 	JOIN maindatabase.users ON notifications.notification_userid = users.userid
		//  	JOIN maindatabase.feedpostcomments ON feedpostcomments.userid_comment = users.userid
		// 	LEFT JOIN maindatabase.userpostvotes ON users.userid = userpostvotes.userid
		// 	left
		// 	WHERE feedposts.userid = ${req.params.userid} AND feedpostcomments.userid_comment != ${req.params.userid} AND userpostvotes.userid != ${req.params.userid}
		// 	ORDER BY notifications.notificationid`

		var sqlString = `Select notifications.*, users.username, feedpostcomments.feedpostmedia,
			users.userpic, feedpostcomments.usercomment, feedpostcomments.feedpostcomment_id,
			IFNULL(feedposts.currentlytrading, 0) AS currentlytrading, IFNULL(feedposts.bannerupdate, 0) as bannerupdate,
			IFNULL(feedposts.favoritenft, 0) as favoritenft, IFNULL(feedposts.favoritenft, 0) as favoritenft,
			IFNULL(feedposts.isreview, 0) AS isreview, feedposts.feedmessage, feedposts.feedpostmedia AS postMedia
			FROM maindatabase.notifications
			left JOIN maindatabase.feedposts ON feedposts.feedpostid = notifications.feedpostid
			JOIN maindatabase.users ON notifications.notification_userid = users.userid
			left JOIN maindatabase.feedpostcomments ON notifications.feedpostcomment_id = feedpostcomments.feedpostcomment_id
			left join maindatabase.userpostvotes ON notifications.voteid = userpostvotes.voteid
			left join maindatabase.usersnfts ON usersnfts.nftid = feedposts.nftid
			LEFT JOIN maindatabase.blockusers ON users.userid = blockusers.blocked_userid AND blockusers.userid =  ${req.params.userid}
			LEFT JOIN maindatabase.hideposts ON feedposts.feedpostid = hideposts.feedpostid AND hideposts.userid = ${req.params.userid}
			WHERE notifications.postuserid = ${req.params.userid} AND blockusers.blocked_userid IS NULL AND hideposts.feedpostid IS NULL
			order by notifications.notificationid DESC
		`
		// LEFT JOIN nfttableyay.nft_ids ON feedposts.nftid = games.id
		// LEFT JOIN nfttableyay.platforms ON games.platform = platforms.id
		// just get the feedpost ids , loop through them each and add the results as array of arrays or some shit
		//still need to add back in block rules
			var getLoggedUser = `SELECT username from maindatabase.users where userid = ${req.params.userid}`

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
						result[0].loggedUserName = result1[0].username
					} else {

					}
					res.send(result)
				})

			})
			// look through comments and votes where the userid of the person voted on is the logged in user,
			// then also get the user information of the people who voted or commented
				// where blockusers.userid IS NULL AND hideposts.feedpostid IS NULL AND
			// need only the results with the logged in userid, but we only have the feed post so maybe two queries
	}






})


module.exports = router;
