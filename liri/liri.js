require("dotenv").config();

var fs = require("fs");

var Spotify= require("node-spotify-api")

// var axios = require("axios")

var moment = require("moment")

var command = process.argv[2]

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

var value = process.argv.slice(3).join(" ")

var request = require('request')

function userInput(command, value){
    switch(command){
        case "concert-this":
        concertThis();
        break;

        case"spotify-this":
        spotifyThis();
        break;

        case"movie-this":
        movieThis();
        break;

        case "do-this":
        doThis(value);
        break;
    }
}

userInput(command,value)

function spotifyThis(){
    console.log("Searching for " +  value);
    if(!value){
      value="Waterfalls"
    }
    spotify.search({ type: 'track', query: value, limit: 1 },function(error,data){
      if(error){
        console.log(error);
      }
      var spotArr= data.tracks.items;
      for(var i=0; i<spotArr.length;i++){
        console.log("\nArtist: " + data.tracks.items[i].album.artists[0].name + "\nSong: " + data.tracks.items[i].name + "\nSample Link: " + data.tracks.items[i].external_urls.spotify + "\nAlbum: " + data.tracks.items[i].album.name + "\n")
      }
    })
  }


  function movieThis(){
      if(!value){
          value="The Matrix"
      }
      request("http://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=trilogy", function(error,response,body){
          var movie=JSON.parse(body)

          if(!error && response.statusCode === 200){
              console.log("\nTitle: " + movie.Title + "\nCast: " + movie.Cast + "\nRelease Year: " + movie.Year + "\nIMDB Rating: " + movie.imdbRating +  "\nCountry: " + movie.Country + "\nLanguage: " + movie.Language + "\nPlot: " + movie.Plot + "\n")
              
          }
          else{
              console.log(error)
          }
      })
  }
function doThis(){
    fs.readFile("random.txt", "utf8", function(error,data){
        if(error){
            console.log(error)
        }
        var dataArr = data.split(",");
        command=dataArr[0]
        value=dataArr[1]

        userInput(command,value)
    })
}

function concertThis(){
    if(!value){
        value="Queen"
    }

    var queryUrl = "https://rest.bandsintown.com/artists/" + value + "/events?app_id=codingbootcamp";

    console.log(queryUrl);


    request(queryUrl,function(err,response,body){
        if(!err && response.statusCode === 200){

        var concerts = JSON.parse(body) 
        for(var i = 0; i<concerts.length; i++){
            
            console.log("\n\nArtist: " + concerts[i].lineup[0] + "\nVenue: " + concerts[i].venue.name + "\nVenue Location: " + concerts[i].venue.city + "\n")

            var concertDate = moment(concerts[i].datetime).format("MM/DD/YYYY hh:00 A")
            console.log("Concert Date: " + concertDate + "\n-------------------")
        }
       }  
    })
}

  
      