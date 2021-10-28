var express = require("express");
var router = express.Router();

var db = require('../../database');

var con = db.con;


router.get('/getprofilefeed/:userid/:feedtype', (req, res) => {

	if(req.params.feedtype === '0'){
		var retreiveProfileInfo =
		`SELECT feedposts.*, users.username, users.userpic, nft_ratings.nft_rating, usersnfts.currentlytrading, IFNULL(t2.commentCount, 0) AS commentCount
		FROM maindatabase.feedposts
		JOIN maindatabase.users ON users.userid = feedposts.userid
		left join maindatabase.usersnfts ON usersnfts.nftid = feedposts.nftid
		left JOIN ( SELECT feedpostcomments.feedpostid, count(feedpostcomments.feedpostcomment_id) AS commentCount from maindatabase.feedpostcomments group by feedpostcomments.feedpostid) t2 ON t2.feedpostid = feedposts.feedpostid
		LEFT JOIN maindatabase.nft_ratings ON feedposts.nftid = nft_ratings.nft_id AND feedposts.userid = nft_ratings.nft_ratinguserid
		where users.userid = ${req.params.userid} ORDER BY feedposts.feedpostid DESC`
		if(req.params.userid){
			con.query(retreiveProfileInfo, function (err, result1) {
				if(err){
					console.log(err)
					return
				}
				if(result1.length){
					result1[0].userVoteIds = ''
				}
				if(result1.length){
					var checkForLoggedInPostVotes = `SELECT feedpostid from maindatabase.userpostvotes WHERE userid = ${req.params.userid}`
					var userVotePostIds = []
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
					res.send(result1)
				}

			})
		}
	} else if(req.params.feedtype === '1') {
		var retreiveProfileInfo =
		`SELECT feedposts.*, users.username, users.userpic, nft_ratings.nft_rating, usersnfts.currentlytrading, IFNULL(t2.commentCount, 0) AS commentCount
		FROM maindatabase.feedposts
		JOIN maindatabase.users ON users.userid = feedposts.userid
		left join maindatabase.usersnfts ON usersnfts.nftid = feedposts.nftid
		left JOIN ( SELECT feedpostcomments.feedpostid, count(feedpostcomments.feedpostcomment_id) AS commentCount from maindatabase.feedpostcomments group by feedpostcomments.feedpostid) t2 ON t2.feedpostid = feedposts.feedpostid
		LEFT JOIN maindatabase.nft_ratings ON feedposts.nftid = nft_ratings.nft_id AND feedposts.userid = nft_ratings.nft_ratinguserid
		WHERE users.userid = ${req.params.userid} ORDER BY feedposts.feedpostpoints DESC`
		if(req.params.userid){
			con.query(retreiveProfileInfo, function (err, result1) {
				if(err){
					console.log(err)
					return
				}
				if(result1.length){
					result1[0].userVoteIds = ''
				}
				if(result1.length){
					var checkForLoggedInPostVotes = `SELECT feedpostid from maindatabase.userpostvotes WHERE userid = ${req.params.userid}`
					var userVotePostIds = []
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
					res.send(result1)
				}

			})
		}
	} else if(req.params.feedtype === '2'){
		var retreiveProfileInfo =
		`SELECT feedposts.*, users.username, users.userpic, nft_ratings.nft_rating, usersnfts.currentlytrading, IFNULL(t2.commentCount, 0) AS commentCount
		FROM maindatabase.feedposts
		JOIN maindatabase.users ON users.userid = feedposts.userid
		left join maindatabase.usersnfts ON usersnfts.nftid = feedposts.nftid
		left JOIN ( SELECT feedpostcomments.feedpostid, count(feedpostcomments.feedpostcomment_id) AS commentCount from maindatabase.feedpostcomments group by feedpostcomments.feedpostid) t2 ON t2.feedpostid = feedposts.feedpostid
		LEFT JOIN maindatabase.nft_ratings ON feedposts.nftid = nft_ratings.nft_id AND feedposts.userid = nft_ratings.nft_ratinguserid
		where users.userid = '${req.params.userid}' and feedposts.isreview = 1 ORDER BY feedposts.feedpostid DESC `
		if(req.params.userid){
			con.query(retreiveProfileInfo, function (err, result1) {
				if(err){
					console.log(err)
					return
				}
				if(result1.length){
					result1[0].userVoteIds = ''
				}
				if(result1.length){
					var checkForLoggedInPostVotes = `SELECT feedpostid from maindatabase.userpostvotes WHERE userid = ${req.params.userid}`
					var userVotePostIds = []
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
					res.send(result1)
				}

			})
		}
	} else if(req.params.feedtype === '3'){
		var retreiveProfileInfo =
		`SELECT feedpostcomments.*, users.username, users.userpic, feedposts.isreview,
		 feedposts.favoritenft, feedposts.currentlytrading
		FROM maindatabase.feedpostcomments
		JOIN maindatabase.feedposts ON feedpostcomments.feedpostid = feedposts.feedpostid
		JOIN maindatabase.users ON users.userid = feedposts.userid
		left join maindatabase.usersnfts ON usersnfts.nftid = feedposts.nftid
		where feedpostcomments.userid_comment = '${req.params.userid}'
		ORDER BY feedpostcomments.feedpostcomment_id DESC `
		if(req.params.userid){
			con.query(retreiveProfileInfo, function (err, result1) {
				if(err){
					console.log(err)
					return
				}
				if(result1.length){
					result1[0].userVoteIds = ''
				}
				if(result1.length){
					var checkForLoggedInPostVotes = `SELECT feedpostid from maindatabase.userpostvotes WHERE userid = ${req.params.userid}`
					var userVotePostIds = []
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
					res.send(result1)
				}

			})
		}
	}



})


module.exports = router;
