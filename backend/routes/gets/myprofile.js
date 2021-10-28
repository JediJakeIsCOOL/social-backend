var express = require("express");
var router = express.Router();

var db = require('../../database');

var con = db.con;


router.get('/myprofile/:userid/:username', (req, res) => {

	let retreiveProfileInfo =
	`SELECT userid, username, userpic, userbanner, usertwitch, useryoutube, usertwitter
	FROM maindatabase.users
	WHERE users.userauthid = "${req.params.userid}"`

	con.query(retreiveProfileInfo, function (err, result) {

		if(err){
			console.log(err)
			return
		}


		if(result.length){
			let getNotifications = `
				SELECT min(notifications.notificationid) AS newNotifications
				from maindatabase.notifications
				WHERE notifications.notification_userid != ${result[0].userid} AND notifications.isviewed = 0
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
			let newSignupInsert = `INSERT INTO maindatabase.users (userauthid, username) VALUES ("${req.params.userid}", "${req.params.username}")`
			con.query(newSignupInsert, function (err, result) {
				if(err){
					console.log(err)
					return
				}
				let logIntoNewAccount =
				`SELECT maindatabase.users.*
				FROM maindatabase.users
				WHERE maindatabase.users.userauthid = "${req.params.userid}"`

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
