var express = require("express");
var router = express.Router();
var db = require('../../database');
var con = db.con


const multer = require('multer')


const storage = multer.diskStorage({
	destination: function (req, file, cb){
		cb(null, './public/uploadedCommentMedia/')
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

            var postComment = `INSERT INTO gamelink_dev_db.gamelink_feedpostcomments (gamelink_feedpostid, gamelink_userid_comment, gamelink_usercomment, gamelink_mediatype, gamelink_feedpostmedia, gamelink_commentpostpoints, gamelink_feeddate) VALUES (${req.body.feedpostid}, ${req.body.loggeduser}, '${req.body.comment}', "${req.file.mimetype}", "${imgPath}", 1, NOW())`
        }else{
            var postComment = `INSERT INTO gamelink_dev_db.gamelink_feedpostcomments (gamelink_feedpostid, gamelink_userid_comment, gamelink_usercomment, gamelink_commentpostpoints, gamelink_feeddate) VALUES (${req.body.feedpostid}, ${req.body.loggeduser}, '${req.body.comment}', 1, NOW())`
        }

        

        var getLoggedUser = `SELECT gamelink_userid from gamelink_dev_db.gamelink_feedposts where gamelink_feedpostid = ${req.body.feedpostid}`

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

                if(req.body.loggeduser != result1[0].gamelink_userid){
                    let insertNotifications = `INSERt INTO gamelink_dev_db.gamelink_notifications (gamelink_feedpostid, gamelink_postuserid, gamelink_notification_userid, gamelink_feedpostcomment_id) VALUES (${req.body.feedpostid}, ${result1[0].gamelink_userid}, ${req.body.loggeduser}, ${result.insertId}) ` 
                    con.query(insertNotifications, (err, result) => {
                        if(err){
                            console.log(err)
                            return
                        } 
                    })
                }
                var insertIntoVotes = `INSERT INTO gamelink_dev_db.gamelink_userpostvotes (gamelink_feedpostid, gamelink_userid, gamelink_vote, gamelink_feedpostcomment_id) VALUES (${req.body.feedpostid}, ${req.body.loggeduser}, 1, ${result.insertId})`
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