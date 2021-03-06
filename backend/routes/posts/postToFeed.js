var express = require("express");
var router = express.Router();

var path = require("path");
var db = require('../../database');
const fs = require('fs');
var con = db.con

const multer = require('multer')


const storage = multer.diskStorage({
	destination: function (req, file, cb){
		cb(null, '../gameshiz/public/uploadedFeedMedia/')
	},
	filename: function (req, file, cb){
		cb(null, Date.now() + file.originalname);
	}
})


const fileFilter = (req, file, cb) => {
	if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'video/quicktime'){
		cb(null, true);
	} else {
		cb(null, false)
	}
}




router.post('/postToFeed', (req, res) => {

 
    var upload = multer({
        storage: storage,
        fileFilter: fileFilter
    }).single("imageData")

    


	upload(req, res, function (err) {
		if (err){
			console.log(err)
			return
        }

        if(req.file){
            const imgPath = "/uploadedFeedMedia/" + req.file.filename

            var newDate = new Date();
            if(req.body.postMessage){

                var sqlString = `INSERT INTO maindatabase.feedposts (feedmessage, userid, feedpostmedia, feeddate, feedpostpoints, mediatype) VALUES ("${req.body.postMessage}", ${req.body.userid}, "${imgPath}", NOW(), 1, "${req.file.mimetype}")`
            }
            else{
                var sqlString = `INSERT INTO maindatabase.feedposts (userid, feedpostmedia, feeddate, feedpostpoints, mediatype) VALUES (${req.body.userid}, "${imgPath}", NOW(), 1, "${req.file.mimetype}")`
            }
            con.query(sqlString, (err, result) => {
                if(err){
                    console.log(err)
                    return
                }
                
            })
        }
        else {
            var newDate = new Date();
            var sqlString = `INSERT INTO maindatabase.feedposts (feedmessage, userid, feeddate, feedpostpoints) VALUES ("${req.body.postMessage}", ${req.body.userid}, NOW(), 1)`

            con.query(sqlString, (err, result) => {
                if(err){
                    console.log(err)
                    return
                }
               
            })
        }


        var selectLastFeedPost = `Select feedpostid from maindatabase.feedposts WHERE userid = ${req.body.userid} ORDER BY feedpostid DESC`

         con.query(selectLastFeedPost, (err, result) => {
            if(err){
                console.log(err)
                return
            }
            const feedpostId = result[0].feedpostid
            var insertIntoVotes = `INSERT INTO maindatabase.userpostvotes (feedpostid, userid, vote) VALUES (${feedpostId}, ${req.body.userid}, 1)`
            con.query(insertIntoVotes, (err, result) => {
                if(err){
                    console.log(err)
                    return
                }
                if(req.file){
                    res.send(req.file.mimetype)
                } else {
                    res.send('success')
                }
            })
        })

        //insert into vote table
        
		

    })
	
	
})

module.exports = router;