require("dotenv").config();
var axios = require("axios");
var moment = require("moment");
var inquirer = require("inquirer");
var Spotify = require("node-spotify-api");
var fs = require("fs");

var keysFile = require("./keys.js");
var spotify = new Spotify(keysFile.spotify);


inquirer.prompt([
    {
        type: 'list',

        message: 'What would you like to do?',
        choices: [
            'concert-this',
            'spotify-this-song',
            'movie-this',
            'do-what-it-says'
        ],
        name: 'list'
    }

]).then(function (response) {

        switch (response.list) {
            case 'concert-this':
                concertThis();
                break;
            case 'spotify-this-song':
                spotifyThisSong();
                break;
            case 'movie-this':
                movieThis();
                break;
            case 'do-what-it-says':
                doWhatItSays();
        }

});

function concertThis() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Enter the artist/band name: ',
            name: 'input'
        }

    ]).then(function (response) {
        var artist = response.input;
        if (artist === "" || artist === " ") {
            console.log("\nSorry, that returned 0 results.");
        } else {
        axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=bb4c8814320b726f2b5e8e9f45cde226")
            .then(function (response) {
                if (response.data[0] !== undefined) {
                    var venue = response.data[0].venue;
                    var dateTime = response.data[0].datetime;
                    var date = moment(dateTime).format('MM/DD/YYYY');
                    console.log("\nVenue: " + venue.name + "\nCity: ", venue.city + ", " + venue.region + "\nDate: ", date + "\n");
                } else {
                    console.log("\nSorry, that returned 0 results.");
                }
            });
        }

    });
}

function spotifyThisSong() {

    inquirer.prompt([
        {
            type: 'input',
            message: 'Enter the song name: ',
            name: 'input'
        }

    ]).then(function (response) {
        var song = response.input;
        if (song === '' || song === ' ') {

            spotify.search({ type: 'track', query: 'The Sign Ace of Base' }, function (err, response) {
                var data = response.tracks.items[0];
                if (err) {
                    console.log(err);
                }

                console.log("\nArtist: " + data.artists[0].name);
                console.log("Song: " + data.name);
                console.log("Preview: " + data.preview_url);
                console.log("Album: " + data.album.name);
            });

        } else if (response === undefined || response === null) {
            console.log("\nSorry, that returned 0 results.");
        } else {
            spotify.search({ type: 'track', query: song }, function (err, response) {
                var data = response.tracks.items[0];
                if (err) {
                    console.log(err);
                }
                console.log("\nArtist: " + data.artists[0].name);
                console.log("Song: " + data.name);
                console.log("Preview: " + data.preview_url);
                console.log("Album: " + data.album.name);
            });
        }

    });

}

function movieThis() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Enter the movie name: ',
            name: 'input'
        }
    ]).then(function (response) {
        var movie = response.input;
        if (movie === "" || movie === " ") {
            movie = "Mr.Nobody";
        } else if (movie === undefined || movie === null) {
            console.log("\nSorry, that returned 0 results.");
        }
        axios.get("http://www.omdbapi.com/?apikey=trilogy&t=" + movie).then(function (response) {
            var info = response.data;
            console.log("\nTitle: " + info.Title);
            console.log("Release Year: " + info.Year);
            console.log("IMDB Rating: " + info.imdbRating);
            console.log("Rotten Tomatoes Rating: " + info.Ratings[1].Value);
            console.log("Produced in: " + info.Country);
            console.log("Language: " + info.Language);
            console.log("Plot: " + info.Plot);
            console.log("Cast: " + info.Actors);
        });


    });


}

function doWhatItSays() {

    fs.readFile("random.txt", "utf8", function (err, response) {

        if (err) {
            console.log(err);
        }

        var splitArray = response.split(',');

        switch (splitArray[0]) {
            case 'concert-this':
                concertThis();
                break;
            case 'spotify-this-song':
            song = splitArray[1]
            console.log(song.trim('"'));
            (song) => {
                if (song === '' || song === ' ') {
        
                    spotify.search({ type: 'track', query: 'The Sign Ace of Base' }, function (err, response) {
                        var data = response.tracks.items[0];
                        if (err) {
                            console.log(err);
                        }
        
                        console.log("\nArtist: " + data.artists[0].name);
                        console.log("Song: " + data.name);
                        console.log("Preview: " + data.preview_url);
                        console.log("Album: " + data.album.name);
                    });
        
                } else if (response === undefined || response === null) {
                    console.log("\nSorry, that returned 0 results.");
                } else {
                    spotify.search({ type: 'track', query: song }, function (err, response) {
                        var data = response.tracks.items[0];
                        if (err) {
                            console.log(err);
                        }
                        console.log("\nArtist: " + data.artists[0].name);
                        console.log("Song: " + data.name);
                        console.log("Preview: " + data.preview_url);
                        console.log("Album: " + data.album.name);
                    });
                }
        
            }
                break;
            case 'movie-this':
                movieThis();
                break;
            case 'do-what-it-says':
                doWhatItSays();
                break;
        }



    });


}