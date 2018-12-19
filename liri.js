require("dotenv").config();
var axios = require("axios");
var moment = require("moment");
var inquirer = require("inquirer");
var Spotify = require("node-spotify-api");

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

    function concertThis() {
        inquirer.prompt([
            {
                type: 'input',
                message: 'Enter the artist/band name: ',
                name: 'input'
            }

        ]).then(function (response) {
            var artist = response.input;
            axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=bb4c8814320b726f2b5e8e9f45cde226")
                .then(function (response) {
                    if (response.data[0] !== undefined) {
                        var venue = response.data[0].venue;
                        var dateTime = response.data[0].datetime;
                        var date = moment(dateTime).format('MM/DD/YYYY');
                        console.log("\n " + venue.name + "\n", venue.city + ", " + venue.region + "\n", date + "\n");
                    } else {
                        console.log("\n Sorry, that returned 0 results.");
                    }
                });

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
                    if (err) {
                        console.log(err);
                    }

                    console.log(response.tracks.items[0].name);

                });

            } else {
                console.log(song);
                spotify.search({ type: 'track', query: song }, function (err, response) {
                    if (err) {
                        console.log(err);
                    }
                    console.log(response.tracks.items[0].name);

            });
        }

    });

    }

function movieThis() {

}

function doWhatItSays() {

}

});