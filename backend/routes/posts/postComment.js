var express = require("express");
var router = express.Router();
var db = require('../../database');
var con = db.con


const multer = require('multer')


const storage = multer.diskStorage({
	destination: function (req, file, cb){
		cb(null, '../gameshiz/public/uploadedCommentMedia/')
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



router.post('/postComment', (req, res) => {

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
            const imgPath = "/uploadedCommentMedia/" + req.file.filename

            var postComment = `INSERT INTO maindatabase.feedpostcomments (feedpostid, userid_comment, usercomment, mediatype, feedpostmedia, commentpostpoints, feeddate) VALUES (${req.body.feedpostid}, ${req.body.loggeduser}, '${req.body.comment}', "${req.file.mimetype}", "${imgPath}", 1, NOW())`
        }else{
            var postComment = `INSERT INTO maindatabase.feedpostcomments (feedpostid, userid_comment, usercomment, commentpostpoints, feeddate) VALUES (${req.body.feedpostid}, ${req.body.loggeduser}, '${req.body.comment}', 1, NOW())`
        }

        

        var getLoggedUser = `SELECT userid from maindatabase.feedposts where feedpostid = ${req.body.feedpostid}`

        con.query(getLoggedUser, function (err, result1) {
            if(err){
                console.log(err)
                return
            }

            con.query(postComment, (err, result) => {
                if(err){
                    console.log(err)
                    return
                }

                if(req.body.loggeduser != result1[0].userid){
                    let insertNotifications = `INSERt INTO maindatabase.notifications (feedpostid, postuserid, notification_userid, feedpostcomment_id) VALUES (${req.body.feedpostid}, ${result1[0].userid}, ${req.body.loggeduser}, ${result.insertId}) ` 
                    con.query(insertNotifications, (err, result) => {
                        if(err){
                            console.log(err)
                            return
                        } 
                    })
                }
                var insertIntoVotes = `INSERT INTO maindatabase.userpostvotes (feedpostid, userid, vote, feedpostcomment_id) VALUES (${req.body.feedpostid}, ${req.body.loggeduser}, 1, ${result.insertId})`
                con.query(insertIntoVotes, (err, result) => {
                    if(err){
                        console.log(err)
                        return
                    }
            
                    res.send('success')
                })
            })
        })
    })
})

module.exports = router;