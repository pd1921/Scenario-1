var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;
var fs = require("fs");
/* GET home page. */
//var path = "/Users/ben/Desktop/nycu_ma/WireLab/moe/MOE/public/text/";
 var path = "/home/tsn/Desktop/moe/MOE/public/text/"
router.get('/', function(req, res, next) {
  res.render('scenario1_v2', { title: 'scenario 1', song1: '卡加布列島', song2: '小幸運', song3: '知足'});
});

router.post('/menu', function(req, res, next){
  var user = req.body.username;
  var loc = req.body.location;
  res.render('menu', { title: 'menu', username: user, loc: loc});
});

router.post('/room1', async function(req, res, next) {
  var user = req.body.username;
  var loc = req.body.location;
  var song = req.body.song;
  // console.log(user);
  // console.log(loc);
  // console.log(song);
  var lyrics = await fs.readFileSync( path+"new_ca",'utf-8').toString().split("\r\n");
  var beats = await fs.readFileSync( path+"new_ca_beats",'utf-8').toString();
  // console.log(lyrics);
  // console.log(beats);
  res.render('room', { title: 'room 1', room: '1', username: user, loc: loc, song: song, lyrics: lyrics, beats: beats});
  // exec("/Applications/Jamulus.app/Contents/MacOS/Jamulus");
});

router.post('/room2', async function(req, res, next) {
  var user = req.body.username;
  var loc = req.body.location;
  var song = req.body.song;
  var lyrics = await fs.readFileSync( path+"new_lucky",'utf-8').toString().split("\r\n");
  var beats = await fs.readFileSync( path+"new_lucky_beats",'utf-8').toString();
  // console.log(lyrics);
  // console.log(beats);
  res.render('room', { title: 'room 2', room: '2', username: user, loc: loc,song: song, lyrics: lyrics, beats: beats });
  // exec("/Applications/Jamulus.app/Contents/MacOS/Jamulus");
});

router.post('/room3', async function(req, res, next) {
  var user = req.body.username;
  var loc = req.body.location;
  var song = req.body.song;
  var lyrics = await fs.readFileSync( path+"new_zhizu",'utf-8').toString().split("\r\n");
  var beats = await fs.readFileSync( path+"new_zhizu_beats",'utf-8').toString();
  console.log(lyrics);
  console.log(beats);
  res.render('room', { title: 'room 3', room: '3', username: user, loc: loc, song: song, lyrics: lyrics, beats: beats });
  // exec("/Applications/Jamulus.app/Contents/MacOS/Jamulus");
});
module.exports = router;
