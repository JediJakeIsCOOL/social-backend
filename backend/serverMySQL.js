const express = require('express')
const app = express()
const bodyParse = require('body-parser')
var cors = require('cors')

// app.use('./uploadedProfPics', express.static('uploadedProfPics'))

app.use(bodyParse.json({
	limit: '50mb',
	paramaterLimit: 100000,
	extended: true
}))
app.use(cors())



//get http
app.use(require("./routes/gets/myprofile"));
app.use(require("./routes/gets/mainfeed"));
app.use(require("./routes/gets/profile"));
app.use(require("./routes/gets/getprofilefeed"));
app.use(require("./routes/gets/viewprofilefeed"));
app.use(require("./routes/gets/getusernfts"));
app.use(require("./routes/gets/getuserimages"));
app.use(require("./routes/gets/getuservideos"));
app.use(require("./routes/gets/getusermerch"));
app.use(require("./routes/gets/getfeedpost"));
app.use(require("./routes/gets/getComments"));


//post http
app.use(require("./routes/posts/uploadProfPic"));
app.use(require("./routes/posts/uploadBannerPic"));
app.use(require("./routes/posts/postToFeed"));
app.use(require("./routes/posts/voteForPost"));
app.use(require("./routes/posts/removeUserVote.js"));
app.use(require("./routes/posts/updateProfileMedia"));
app.use(require("./routes/posts/updateCompetitive"));
app.use(require("./routes/posts/postUserFollow"));
app.use(require("./routes/posts/removeGameReview"));
app.use(require("./routes/posts/removeFeedPost"));
app.use(require("./routes/posts/postProfileGame.js"));
app.use(require("./routes/posts/removePicture.js"));
app.use(require("./routes/posts/postComment.js"));
app.use(require("./routes/posts/updateCurrentGame.js"));
app.use(require("./routes/posts/blockCommentsAndUsers.js"))

app.use(require("./routes/posts/removeComment.js"));

app.use(require("./routes/posts/removeCommentVote.js"));
app.use(require("./routes/posts/addCommentVote.js"));
app.use(require("./routes/posts/setNotificationsSeen.js"));


//games database
app.use(require("./routes/gamesdatabase/getsearchedgames"));
app.use(require("./routes/gamesdatabase/getgamereviews"));

app.use(require("./routes/gamesdatabase/postgamereview"));

app.listen(4000, () => {
	console.log("Server is running on port 4000.")
});
