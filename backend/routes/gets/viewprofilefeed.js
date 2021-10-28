var express = require("express");
var router = express.Router();

var db = require('../../database');

var con = db.con;


router.get('/viewprofilefeed/:username/:feedtype/:userid', (req, res) => {

	if(req.params.feedtype === '0'){
		var retreiveProfileInfo =
		`SELECT feedposts.*, users.username, users.userpic,
		nft_ratings.nft_rating, usersnfts.currentlytrading, IFNULL(t2.commentCount, 0) AS commentCount
		FROM maindatabase.feedposts
		JOIN maindatabase.users ON users.userid = feedposts.userid
		left JOIN ( SELECT feedpostcomments.feedpostid, count(feedpostcomments.feedpostcomment_id) AS commentCount from maindatabase.feedpostcomments group by feedpostcomments.feedpostid) t2 ON t2.feedpostid = feedposts.feedpostid
		left join maindatabase.usersnfts ON usersnfts.nftid = feedposts.nftid
		left join maindatabase.nft_ratings ON nft_ratings.nft_ratinguserid = users.userid
		where users.username = '${req.params.username}' ORDER BY feedposts.feedpostid DESC`

		var userVotePostIds = []

		con.query(retreiveProfileInfo, function (err, result1) {
			if(err){
				console.log(err)
				return
			} else if(result1.length){
				if(req.params.userid !== 'undefined'){

					var checkForLoggedInPostVotes = `SELECT feedpostid from maindatabase.userpostvotes WHERE userid = ${req.params.userid}`

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
					result1[0].userVoteIds = userVotePostIds
					res.send(result1)
				}
			} else {
				res.send([])
			}
		})
	}
	else if (req.params.feedtype === '1') {
		var retreiveProfileInfo =
		`SELECT feedposts.*, users.username, users.userpic,
		 nft_ratings.nft_rating, IFNULL(usersnfts.currentlytrading, 0) AS currentlytrading, IFNULL(t2.commentCount, 0) AS commentCount
		FROM maindatabase.feedposts
		JOIN maindatabase.users ON users.userid = feedposts.userid
		left join maindatabase.usersnfts ON usersnfts.nftid = feedposts.nftid
		left JOIN ( SELECT feedpostcomments.feedpostid, count(feedpostcomments.feedpostcomment_id) AS commentCount from maindatabase.feedpostcomments group by feedpostcomments.feedpostid) t2 ON t2.feedpostid = feedposts.feedpostid
		LEFT JOIN nfttableyay.nft_ids ON feedposts.nftid = nft_ratings.nft_id AND feedposts.userid = nft_ratings.nft_ratinguserid
		where users.username = '${req.params.username}' ORDER BY feedposts.feedpostpoints DESC`

		var userVotePostIds = []
		con.query(retreiveProfileInfo, function (err, result1) {

			if(err){
				console.log(err)
				return
			} else if(result1.length){
				if(req.params.userid !== 'undefined'){

					var checkForLoggedInPostVotes = `SELECT feedpostid from maindatabase.userpostvotes WHERE userid = ${req.params.userid}`

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
					result1[0].userVoteIds = userVotePostIds
					res.send(result1)
				}
			} else {
				res.send([])
			}
		})
	}
 	else if (req.params.feedtype === '2'){
		var retreiveProfileInfo =
		`SELECT feedposts.*, users.username, users.userpic,
		 nft_ratings.nft_rating, usersnfts.currentlytrading, IFNULL(t2.commentCount, 0) AS commentCount
		FROM maindatabase.feedposts
		JOIN maindatabase.users ON users.userid = feedposts.userid
		left join maindatabase.usersnfts ON usersnfts.nftid = feedposts.nftid
		left JOIN ( SELECT feedpostcomments.feedpostid, count(feedpostcomments.feedpostcomment_id) AS commentCount from maindatabase.feedpostcomments group by feedpostcomments.feedpostid) t2 ON t2.feedpostid = feedposts.feedpostid
		LEFT JOIN nfttableyay.nft_ids ON feedposts.nftid = nft_ratings.nft_id AND feedposts.userid = nft_ratings.nft_ratinguserid
		where users.username = '${req.params.username}' and feedposts.isreview = 1 ORDER BY feedposts.feedpostid DESC `

		var userVotePostIds = []
		con.query(retreiveProfileInfo, function (err, result1) {

			if(err){
				console.log(err)
				return
			} else if(result1.length){
				if(req.params.userid !== 'undefined'){

					var checkForLoggedInPostVotes = `SELECT feedpostid from maindatabase.userpostvotes WHERE userid = ${req.params.userid}`

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
					result1[0].userVoteIds = userVotePostIds
					res.send(result1)
				}
			} else {
				res.send([])
			}
		})
	} else if(req.params.feedtype === '3'){
		var retreiveProfileInfo =
		`SELECT feedpostcomments.*, users.username, users.userpic, feedposts.isreview,
		 feedposts.favoritenft, feedposts.currentlytrading
		FROM maindatabase.feedpostcomments
		JOIN maindatabase.feedposts ON feedpostcomments.feedpostid = feedposts.feedpostid
		JOIN maindatabase.users ON users.userid = feedpostcomments.userid_comment
		left join maindatabase.usersnfts ON usersnfts.nftid = feedposts.nftid
		WHERE users.username = '${req.params.username}'
		ORDER BY feedpostcomments.feedpostcomment_id DESC `

		var userVotePostIds = []
		con.query(retreiveProfileInfo, function (err, result1) {

			if(err){
				console.log(err)
				return
			} else if(result1.length){
				if(req.params.userid !== 'undefined'){

					var checkForLoggedInPostVotes = `SELECT feedpostid from maindatabase.userpostvotes WHERE userid = ${req.params.userid}`

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
					result1[0].userVoteIds = userVotePostIds
					res.send(result1)
				}
			} else {
				res.send([])
			}
		})
	}
})

module.exports = router;
