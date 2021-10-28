var express = require("express");
var router = express.Router();

var path = require("path");
var db = require('../../database');
const fs = require('fs');
var con = db.con

const multer = require('multer')


const storage = multer.diskStorage({
	destination: function (req, file, cb){
		cb(null, '../gameshiz/public/uploadedProfPics/')
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




router.post('/uploadProfPic', (req, res) => {

	var upload = multer({
		storage: storage,
		fileFilter: fileFilter
	}).single('imageData')

	upload(req, res, function (err) {
		if (err){
			console.log(err)
			return
		}

		//delete old one

		let selectLastPic = `Select userpic from maindatabase.users WHERE userid = ${req.body.userid} `

		con.query(selectLastPic, (err, result) => {
			if(err){
				console.log(err)
				return
			}

			if(result[0].userpic !== null){
				const lastPicPath = '../gameshiz/public' + result[0].userpic

				fs.unlink(lastPicPath, (err) =>{
					if (err) throw err
					console.log(lastPicPath + ' was deleted');
				})
			}
		})
	
		const imgPath = "/uploadedProfPics/" + req.file.filename


		

		
		// const rightPath = imgPath.replace(/\\/g, '/')
		con.query(`update maindatabase.users SET userpic = "${imgPath}" WHERE userid = ${req.body.userid} `, (err, result) => {
			if(err){
				console.log(err)
				return
			}
			res.send(imgPath)
		})
		
	})
	

	
	
	
})

module.exports = router;