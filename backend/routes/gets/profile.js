var express = require("express");
var router = express.Router();

var db = require('../../database');

var con = db.con;


router.get('/profile/:user/:userauthid', (req, res) => {
	if(req.params.userauthid !== "0"){
		let getFollowedUsers = 
		`SELECT followed_userid 
		from maindatabase.userfollows
		join maindatabase.users ON userfollows.userid = users.userid
		WHERE userauthid = "${req.params.userauthid}"
		`

		con.query(getFollowedUsers, function (err, result) {
			if(err){
				console.log(err)
				return
			}
		
				if(result){
					resultArr = []
					for(var x = 0; x < result.length; x++){
						resultArr.push(result[x].followed_userid)
					}		
				}
		 })
		 let getUsersProfile =  `SELECT * from maindatabase.users WHERE userauthid = "${req.params.userauthid}"`


		 con.query(getUsersProfile, function (err, result) {
			 if(err){
				 console.log(err)
				 return
			 } 

			 userProfile = result
		 })

		 let retreiveProfileInfo = `SELECT * FROM maindatabase.users WHERE username = "${req.params.user}"`
	
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
		let retreiveProfileInfo = `SELECT * FROM maindatabase.users WHERE username = "${req.params.user}"`
		
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