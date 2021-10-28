
var express = require("express");
var router = express.Router();
var db = require('../../database');
var con = db.con
const fs = require('fs');

router.post('/removePicture', (req, res) => {


    const lastPicPath = './public' + req.body.gamelink_feedpostmedia
    fs.unlink(lastPicPath, (err) =>{
        if (err) throw err
        console.log(lastPicPath + ' was deleted');
    })
  

    var feedPostId = req.body.gamelink_feedpostid


    
    var sqlString = `DELETE FROM gamelink_dev_db.gamelink_feedposts WHERE gamelink_feedpostid = ${feedPostId}`


    con.query(sqlString, (err, result) => {
        if(err){
            console.log(err)
            return
        }
        
    })

    var sqlString = `DELETE FROM gamelink_dev_db.gamelink_userpostvotes WHERE gamelink_feedpostid = ${feedPostId}`


    con.query(sqlString, (err, result) => {
        if(err){
            console.log(err)
            return
        }
        res.send('deleted feed pic')
    })

   
})

module.exports = router;

