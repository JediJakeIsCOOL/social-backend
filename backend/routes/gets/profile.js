var express = require("express");
var router = express.Router();

var db = require('../../database');

var con = db.con;


router.get('/profile/:user/:userauthid', (req, res) => {
	if(req.params.userauthid !== "0"){
		let getFollowedUsers = 
		`SELECT gamelink_followed_userid 
		from gamelink_dev_db.gamelink_userfollows
		join gamelink_dev_db.gamelink_users ON gamelink_userfollows.gamelink_userid = gamelink_users.gamelink_userid
		WHERE gamelink_userauthid = "${req.params.userauthid}"
		`

		con.query(getFollowedUsers, function (err, result) {
			if(err){
				console.log(err)
				return
			}
		
				if(result){
					resultArr = []
					for(var x = 0; x < result.length; x++){
						resultArr.push(result[x].gamelink_followed_userid)
					}		
				}
		 })
		 let getUsersProfile =  `SELECT * from gamelink_dev_db.gamelink_users WHERE gamelink_userauthid = "${req.params.userauthid}"`


		 con.query(getUsersProfile, function (err, result) {
			 if(err){
				 console.log(err)
				 return
			 } 

			 userProfile = result
		 })

		 let retreiveProfileInfo = `SELECT * FROM gamelink_dev_db.gamelink_users WHERE gamelink_username = "${req.params.user}"`
	
		 con.query(retreiveProfileInfo, function (err, result1) {
			 if(err){
				 console.log(err)
				 return
			 }
			 if(result1[0]){
				 result1[0].followedUsers = resultArr
				 result1[1] = userProfile
				 res.send(result1)
				 // set up login session and what not
			 } else {
				 console.log(err)
				 res.send('err1')
			 }
		  })
	}

	else{
		let retreiveProfileInfo = `SELECT * FROM gamelink_dev_db.gamelink_users WHERE gamelink_username = "${req.params.user}"`
		
		con.query(retreiveProfileInfo, function (err, result1) {
			 if(err){
				 console.log(err)
				 return
			 }
			if(result1[0]){
				result1[0].followedUsers = []
				res.send(result1)
				// set up login session and what not
			} else {
				console.log(err)
				res.send('err1')
			}
		})
	}
	
})


module.exports = router;