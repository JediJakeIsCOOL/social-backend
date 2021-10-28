var express = require("express");
var router = express.Router();

var path = require("path");
var db = require('../../database');
const fs = require('fs');
var con = db.con

const multer = require('multer')


const storage = multer.diskStorage({
	destination: function (req, file, cb){
		cb(null, './public/uploadedBanners/')
	},
	filename: function (req, file, cb){
		cb(null, Date.now() + file.originalname);
	}
})


const fileFilter = (req, file, cb) => {
	if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
		cb(null, true);
	} else {
		cb(null, false)
	}
}




router.post('/uploadBannerPic', (req, res) => {

	var upload = multer({
		storage: storage,
		fileFilter: fileFilter
	}).single('imageData')

	upload(req, res, function (err) {
		if (err){
			console.log(err)
			return
		}

		const imgPath = "/uploadedBanners/" + req.file.filename
		

		const addToFeed = `  INSERT INTO gamelink_dev_db.gamelink_feedposts (gamelink_feeddate, gamelink_feedpostmedia, gamelink_userid, gamelink_feedpostpoints, gamelink_bannerupdate)
                VALUES (NOW(), "${imgPath}", ${req.body.userid}, 1, 1)`

		const addPostVote = `INSERT INTO gamelink_dev_db.gamelink_userpostvotes `

		con.query(addToFeed , (err, result) => {
			if(err){
				console.log(err)
				return
			}
			
			var insertIntoVotes = `INSERT INTO gamelink_dev_db.gamelink_userpostvotes (gamelink_feedpostid, gamelink_userid, gamelink_vote) VALUES (${result.insertId}, ${req.body.userid}, 1)`

			con.query(insertIntoVotes , (err, result) => {
				if(err){
					console.log(err)
					return
				}
			})

		})
		//delete old one	
		
		// const rightPath = imgPath.replace(/\\/g, '/')
		con.query(`update gamelink_dev_db.gamelink_users SET gamelink_userbanner = "${imgPath}" WHERE gamelink_userid = ${req.body.userid} `, (err, result) => {
			if(err){
				console.log(err)
				return
			}
			res.send(imgPath)
		})
		
	})
	

	
	
	
})

module.exports = router;