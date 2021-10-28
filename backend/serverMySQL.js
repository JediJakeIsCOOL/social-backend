const express = require('express')
const app = express()
const bodyParse = require('body-parser')
var cors = require('cors')

app.use(bodyParse.json({
	limit: '50mb',
	paramaterLimit: 100000,
	extended: true
}))

app.use(express.static('public'))
app.use(cors())
app.set('port', process.env.PORT || 8443)


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


//get http
app.use(require("./routes/gets/myprofile"));
app.use(require("./routes/gets/mainfeed"));
app.use(require("./routes/gets/profile"));
app.use(require("./routes/gets/getprofilefeed"));
app.use(require("./routes/gets/viewprofilefeed"));
app.use(require("./routes/gets/getusergames"));
app.use(require("./routes/gets/getuserimages"));
app.use(require("./routes/gets/getuservideos"));
app.use(require("./routes/gets/getusermerch"));
app.use(require("./routes/gets/getuserachievements"));
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

app.listen(app.get('port'));