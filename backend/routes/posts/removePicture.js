
var express = require("express");
var router = express.Router();
var db = require('../../database');
var con = db.con
const fs = require('fs');

router.post('/removePicture', (req, res) => {


    const lastPicPath = '../gameshiz/public' + req.body.feedpostmedia
    fs.unlink(lastPicPath, (err) =>{
        if (err) throw err
        console.log(lastPicPath + ' was deleted');
    })
  

    var feedPostId = req.body.feedpostid


    
    var sqlString = `DELETE FROM maindatabase.feedposts WHERE feedpostid = ${feedPostId}`


    con.query(sqlString, (err, result) => {
        if(err){
            console.log(err)
            return
        }
        
    })

    var sqlString = `DELETE FROM maindatabase.userpostvotes WHERE feedpostid = ${feedPostId}`


    con.query(sqlString, (err, result) => {
        if(err){
            console.log(err)
            return
        }
        res.send('deleted feed pic')
    })

   
})

module.exports = router;

