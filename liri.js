require("dotenv").config();

var keys = require("./keys")

var Spotify = require('node-spotify-api');

 
 var spotify = new Spotify(keys.spotify);
 
 spotify.search({ type: 'track', query: 'All the Small Things' }, function(err, data) {
   if (err) {
    return console.log('Error occurred: ' + err);
   }
 
    console.log(data.tracks.items[0].album.artists[0]); 
 }); 

 //process.argv[2] example to (can help to grab spotify songs) store to var and console log to see it work