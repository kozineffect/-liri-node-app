var request = require('request');

var Twitter = require('twitter');
var spotify = require('spotify');
var client = require("./keys.js");

var to_do = process.argv[2];
var queryArr = [];

for (var i = 3; i < process.argv.length; i++) {

    queryArr.push(process.argv[i]);
}
var query = queryArr.toString();
var queryUrl = "http://www.omdbapi.com/?t=" + query + "&y=&plot=short&r=json";
console.log(client);
// var params = {screen_name: 'joseph_koz'};
// client.get('statuses/user_timeline', params, function(error, tweets, response) {
//   if (!error) {
//     console.log(tweets);
//   }
// });
if (to_do === "spotify-this-song") {
    spotify.search({
        type: 'track',
        query: query
    }, function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }
        console.log(JSON.stringify(data.tracks.items[0].artist, null, 2));
        console.log(query);
        console.log(JSON.stringify(data.tracks.items[0].album, null, 2));
        console.log(JSON.stringify(data.tracks.items[0].preview_url, null, 2));
        // console.log(JSON.stringify(data, null, 2));
        // Do something with 'data' 
    });
}
if (to_do === "movie-this") {

    request(queryUrl, function (error, response, body) {

        // If the request was successful...
        if (!error && response.statusCode === 200) {
            console.log(JSON.parse(body));
            // Then log the body from the site!
            console.log("The title of the movie is " + JSON.parse(body).Title);
            console.log("The year the movie was released was " + JSON.parse(body).Year);
            console.log("The movie rating is " + JSON.parse(body).imdbRating);
            console.log("The movie was produced in " + JSON.parse(body).Country);
            console.log("The language spoken in the movie is " + JSON.parse(body).Language);
            console.log("The movie plot: " + JSON.parse(body).Plot);
            console.log("The actors are " + JSON.parse(body).Actors);
            console.log("The Rotten Tomatoes score is " + JSON.parse(body).Ratings[1].Value);
            console.log("Poster URL " + JSON.parse(body).Poster);

            if (JSON.parse(body).imdbRating < 5) {
                console.log("This movie sucked!");
            }
        }
    });
}