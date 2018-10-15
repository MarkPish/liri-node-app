// read and set any variables with the dotenv package
require("dotenv").config();
//Node Module imports needed to run the various functions
var keys = require("./keys");
var request = require("request");
var Spotify = require('node-spotify-api');
var bandsInTown = require("mhs-bandsintown");
var moment = require("moment");
var fs = require("fs"); //reads and writes files



// code to access keys information 
var spotify = new Spotify(keys.spotify);
var omdbUrl = 'http://www.omdbapi.com/?apikey=trilogy&t=';


//Stored argument's array
var nodeArgv = process.argv;
var command = process.argv[2];
//movie or song
var query = "";
//attaches multiple word arguments (this mess makes it so we dont have to use parenthesis if query is longer than one word)
for (var i=3; i<nodeArgv.length; i++){
  if(i>3 && i<nodeArgv.length){
    query = query + "+" + nodeArgv[i];
  } else{
    query = query + nodeArgv[i];
  }
}


//switch case 
//this allows to switch between the four given commands 
// need to fix this and clean it up, not supposed to have if else statments in this, use dot notation to call on [3] which will be what the user enters for query or prompt
switch(command){
    case "concert-this":
  bands(process.argv[3]);
  break;
  case "spotify-this-song":
    if(query){
      spotifySong(query);
    } else{
      spotifySong("The Sign");
    }
  break;

  case "movie-this":
    if(query){
      omdbData(query)
    } else{
      omdbData("Mr. Nobody")
    }
  break;

  case "do-what-it-says":
    doThing();
  break;

  default:
    console.log("{Please enter a command: concert-this, spotify-this-song, movie-this, do-what-it-says}");
  break;
}



//Adding the append function to log.txt to add prompt aka what user input 
function appendNewSearch (prompt){
  fs.appendFile('log.txt', prompt, function(error) {
    if (error) {
      return console.log(error)
    }
  });
}
//Set Default for spotify-this-song to The Sign
function spotifySong(song){
  if(!song){
    song = "The Sign";
    console.log();
  }
}
//Spotify Function
function spotifySong(song){
  spotify.search({ type: 'track', query: song}, function(error, data){
    if(!error){
      for(var i = 0; i < data.tracks.items.length; i++){
        var songData = data.tracks.items[i];
        console.log("Artist: " + songData.artists[0].name);
        console.log("Song: " + songData.name);
        console.log("Preview URL: " + songData.preview_url);
        console.log("Album: " + songData.album.name);
        console.log("-----------------------");
        
        //adds text to log.txt
        appendNewSearch(song + ", ");
        
      }
    } else{
      console.log('Error occurred: ' + error);
    }
  });
}


//OMDB Function 
function omdbData(movie){
  if(!movie){
    movie = "Mr Nobody";
    console.log(movie);
    console.log("-----------------------");
    console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
    console.log("It's on Netflix!");
  
  
  }
  var omdbURL = 'http://www.omdbapi.com/?apikey=trilogy&t=' + movie + '&plot=short&tomatoes=true';
  
    request(omdbURL, function (error, response, body){
      if(!error && response.statusCode == 200){
        var body = JSON.parse(body);
  
        console.log("Title: " + body.Title);
        console.log("Release Year: " + body.Year);
        console.log("IMdB Rating: " + body.imdbRating);
        console.log("Country: " + body.Country);
        console.log("Language: " + body.Language);
        console.log("Plot: " + body.Plot);
        console.log("Actors: " + body.Actors);
        console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
        console.log("Rotten Tomatoes URL: " + body.tomatoURL);

         //adds text to log.txt
         appendNewSearch(movie + ", ");
      
        
      } else{
        console.log('Error occurred:' + error)
      }
    });
  
};

 //Bands in Town Function
 function bands(artist){
   artist = artist.replace(/\s/g,'');
   if(!artist){
     artist = "JustinTimberlake";
   }

    var bandTownUrl ="https://rest.bandsintown.com/artists/"+artist+"/events?app_id=codingbootcamp";
   //console.log(bandTownUrl);
    request(bandTownUrl, function (error, response, body){
       if(!error && response.statusCode == 200){
        var bodyObject = JSON.parse(body);
  

        for(var i = 0; i< bodyObject.length; i++) {
          console.log("Venue Name: " + bodyObject[i].venue.name);
          console.log("Venue Region: " + bodyObject[i].venue.region);  
          console.log("Venue City: " + bodyObject[i].venue.city);  
          console.log("Show Date/Time: " + bodyObject[i].datetime);
          console.log("Show Info URL: " + bodyObject[i].url); 
          console.log("*************");
        }


         //adds text to log.txt
         appendNewSearch(artist + ", ");
      } 

       else{
        console.log('Error occurred:' + error)
      }
     });
  
 }


//Do what it says function (defaults to I want it that Way for spotify this song)
function doThing(){
    fs.readFile('random.txt', "utf8", function(error, data){
      var txt = data.split(',');
      
  //sending info to the text log for Spotify 
      spotifySong(txt[1]);
    });
  }

 

// spotify-this-song, do-what-it-says, movie-this working!!




  







