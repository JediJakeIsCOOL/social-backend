var express = require("express");
var router = express.Router();

var path = require("path");
var db = require('../../database');
const fs = require('fs');
var con = db.con

const multer = require('multer')


const storage = multer.diskStorage({
	destination: function (req, file, cb){
		cb(null, '../gameshiz/public/uploadedBanners/')
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
		

		const addToFeed = `  INSERT INTO maindatabase.feedposts (feeddate, feedpostmedia, userid, feedpostpoints, bannerupdate)
                VALUES (NOW(), "${imgPath}", ${req.body.userid}, 1, 1)`

		const addPostVote = `INSERT INTO maindatabase.userpostvotes `

		con.query(addToFeed , (err, result) => {
			if(err){
				console.log(err)
				return
			}
			
			var insertIntoVotes = `INSERT INTO maindatabase.userpostvotes (feedpostid, userid, vote) VALUES (${result.insertId}, ${req.body.userid}, 1)`

			con.query(insertIntoVotes , (err, result) => {
				if(err){
					console.log(err)
					return
				}
			})

		})
		//delete old one	
		
		// const rightPath = imgPath.replace(/\\/g, '/')
		con.query(`update maindatabase.users SET userbanner = "${imgPath}" WHERE userid = ${req.body.userid} `, (err, result) => {
			if(err){
				console.log(err)
				return
			}
			res.send(imgPath)
		})
		
	})
	

	
	
	
})

module.exports = router;