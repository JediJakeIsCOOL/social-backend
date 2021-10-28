var express = require("express");
var router = express.Router();

var db = require('../../database');

var con = db.con;


router.get('/myprofile/:userid/:username', (req, res) => {

	let retreiveProfileInfo = 
	`SELECT gamelink_userid, gamelink_username, gamelink_userpic, gamelink_userbanner, gamelink_usertwitch, gamelink_useryoutube, gamelink_usertwitter, gamelink_usercompetitive
	FROM gamelink_dev_db.gamelink_users 
	WHERE gamelink_users.gamelink_userauthid = '${req.params.userid}'`

	
	
	con.query(retreiveProfileInfo, function (err, result) {

		if(err){
			console.log(err)
			return
		}


		if(result.length){
			let getNotifications = `
				SELECT count(gamelink_notifications.gamelink_notificationid) AS newNotifications
				from gamelink_dev_db.gamelink_notifications
				WHERE gamelink_notifications.gamelink_postuserid = ${result[0].gamelink_userid} AND gamelink_notifications.gamelink_isviewed = 0 
			`

			con.query(getNotifications, function (err, result1) {
				if(err){
					console.log(err)
					return
				}
				result[0].newNotifications = result1[0].newNotifications		
				res.send(result)

			})
	
		} else {	
			let newSignupInsert = `INSERT INTO gamelink_dev_db.gamelink_users (gamelink_userauthid, gamelink_username) VALUES ("${req.params.userid}", "${req.params.username}")`
			con.query(newSignupInsert, function (err, result) {
				if(err){
					console.log(err)	
					return
				}
				let logIntoNewAccount = 
				`SELECT gamelink_dev_db.gamelink_users.*
				FROM gamelink_dev_db.gamelink_users 
				WHERE gamelink_dev_db.gamelink_users.gamelink_userauthid = "${req.params.userid}"`

				con.query(logIntoNewAccount, function (err, result) {
					if(err){
						console.log(err)	
						return
						// set up login session and what not
					} 
					res.send(result)
				})
			})

		}
		
	
 	})
	
})


module.exports = router;