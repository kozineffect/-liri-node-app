var fs = require("fs");
var request = require('request');
var Twitter = require('twitter');
var spotify = require('spotify');
var client = require("./keys.js").twitterkeys;

var to_do = process.argv[2]; //Grabs the argument that tells the program what process to accomplish
var queryArr = [];
var skip_Default = false; //Variable to make sure the default if statement is triggered when random.txt is used

//Loops through all the search for arguments passed and stores them into an array
for (var i = 3; i < process.argv.length; i++) {

    queryArr.push(process.argv[i]);
}

//Takes search for array arguments and converts them to string
var query = queryArr.toString(); 

//Replaces all commas with spaces to clean up string used for searching apis
for (var n = 0; n < query.length; n++) {
    query = query.replace(",", " ");
}

//Declaring user name for Twitter function
var params = {
    screen_name: 'joseph_koz'
};

//Calling the function to trigger functionality of program
check_it();

//Function used to check if reading off of random.txt or performing other functions
function check_it() {
    if (to_do === "do-what-it-says") {
        var data = fs.readFileSync("random.txt", "utf8");
        var split = data.split(",");
        to_do = split[0].toString();
        //Grabs other arguments grabbed from random.txt if they are there
        if (split.length > 1) { 
            query = split[1].toString();
            skip_Default = true; //used to stop default search of other functions from being triggered
        }
        //Calls function to perform process specified in random.txt
        performFunction(to_do, query); 
    } 
    //Runs function to perform process specified that does not include random.txt
    else { 
        performFunction(to_do, query);
    }
}

//Function made to perform process specfied in to_do
function performFunction(to_do, query) {
    //Grabs all tweets and displays them
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

    //Searches Spotify with user provided input
    if (to_do === "spotify-this-song") {
        //Default process if no user input specified
        if (process.argv.length < 4 && skip_Default === false) {
            query = "Ace of Base The Sign";
        }

        //Searched Spotify
        spotify.search({
            type: 'track',
            query: query
        }, function (err, data) {
            if (err) {
                console.log('Error occurred: ' + err);
                return;
            }

            console.log("You searched Spotify for: " + query);
            console.log("The name of the Artist found is " + data.tracks.items[0].album.artists[0].name);
            console.log("The name of the album it is found on is " + data.tracks.items[0].album.name);
            console.log("The link to the url to find this at is:");
            console.log(data.tracks.items[0].album.external_urls.spotify);


        });
    }

    //Searched imdb if specified to
    if (to_do === "movie-this") {
        //Default process if no user input specified
        if (process.argv.length < 4 && skip_Default === false) {
            query = "Mr. Nobody";
        }
        var queryUrl = "http://www.omdbapi.com/?t=" + query + "&y=&plot=short&r=json";
        //Searches imdb
        request(queryUrl, function (error, response, body) {

            if (!error && response.statusCode === 200) {
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