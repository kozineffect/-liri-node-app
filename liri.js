var request = require('request');
var Twitter = require('twitter');
var spotify = require('spotify');
var fs = require("fs");
var client = require("./keys.js").twitterkeys;

var to_do = process.argv[2];
var queryArr = [];

for (var i = 3; i < process.argv.length; i++) {

    queryArr.push(process.argv[i]);
}
var query = queryArr.toString();
for (var n = 0; n < query.length; n++) {
    query = query.replace(",", " ");
}
var params = {
    screen_name: 'joseph_koz'
};


function performFunction() {
    if (to_do === "my-tweets") {
        client.get('statuses/user_timeline', params, function (error, tweets, response) {
            if (!error) {
                console.log("Here are your tweets!");
                for (var x = 0; x < tweets.length; x++) {
                    console.log(tweets[x].text);
                }
            }
        });
    }

    if (to_do === "spotify-this-song") {
        if (process.argv.length < 4) {
            query = "The Sign";
        }

        spotify.search({
            type: 'track',
            query: query
        }, function (err, data) {
            if (err) {
                console.log('Error occurred: ' + err);
                return;
            }

            console.log("The song you searched for is " + query);
            console.log("The name of the Artist found is " + data.tracks.items[0].album.artists[0].name);
            console.log("The name of the album it is found on is " + data.tracks.items[0].album.name);
            console.log("The link to the url to find this at is:");
            console.log(data.tracks.items[0].album.external_urls.spotify);


        });
    }

    if (to_do === "movie-this") {
        if (process.argv.length < 4) {
            query = "Mr. Nobody";
        }
        var queryUrl = "http://www.omdbapi.com/?t=" + query + "&y=&plot=short&r=json";
        request(queryUrl, function (error, response, body) {

            // If the request was successful...
            if (!error && response.statusCode === 200) {
                console.log(JSON.parse(body));
                console.log("The title of the movie is " + JSON.parse(body).Title);
                console.log("The year the movie was released was " + JSON.parse(body).Year);
                console.log("The movie rating is " + JSON.parse(body).imdbRating);
                console.log("The movie was produced in " + JSON.parse(body).Country);
                console.log("The language spoken in the movie is " + JSON.parse(body).Language);
                console.log("The movie plot: " + JSON.parse(body).Plot);
                console.log("The actors are " + JSON.parse(body).Actors);
                console.log("The Rotten Tomatoes score is " + JSON.parse(body).Ratings[1].Value);
                console.log("Poster URL " + JSON.parse(body).Poster);

            }
        });
    }
}

if (to_do === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (error, data) {
        var split = data.split(",");
        to_do = split[0].toString();
        if (split.length > 1) {
            query = split[1].toString();
        }
    });
    performFunction();
} else {
    performFunction();
}