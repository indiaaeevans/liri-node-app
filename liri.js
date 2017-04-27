// grab the data from keys.js. Then store the keys in a variable.
var keys = require("./keys.js");
// load the twitter, spotify, and request packages --- allows you to access all the functions and properties from the variable name
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');

// save the user input to a variable
let userRequest = process.argv[2],
	userQuery = "";

// Capture all the words in the user input (ignoring the first three Node arguments)
for (var i = 3; i < process.argv.length; i++) {

  // Build a string with the user input.
  userQuery = userQuery + " " + process.argv[i];

}

if (userRequest === "my-tweets"){
	tweets();
} else if (userRequest === "spotify-this-song"){
	if (userQuery){
		spotifySong(userQuery);
	} else {
	// If the user doesn't type a song in, output data for the song "The Sign" by Ace of Base
		spotifySong("The Sign");
	}
} else if (userRequest === "movie-this") {
	if (userQuery){
		movie(userQuery);
	} else {
	// If the user doesn't type a movie in, output data for the movie 'Mr. Nobody.'
		movie("Mr. Nobody");
	}
} else if (userRequest === "do-what-it-says") {
	doSomething();
} else {
	console.log("That is not a valid request.");
}

// show your last 20 tweets and when they were created
function tweets(){
	// Twitter developer credentials in the form of a set of consumer and access tokens/keys.
	var client = new Twitter({
	  consumer_key: keys.twitterKeys.consumer_key,
	  consumer_secret: keys.twitterKeys.consumer_secret,
	  access_token_key: keys.twitterKeys.access_token_key,
	  access_token_secret: keys.twitterKeys.access_token_secret
	});
	// sets the variable params to search the username moon_pie_castle
	// only return back the last 20 tweets
	// doesn't trim the username so the username information will come up instead of the twitter id#
	var params = {
		screen_name: 'moon_pie_castle', 
		count: 10,
		trim_user: false
	};
	// call to twitter to retrieve the user timeline
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	  	// for each tweet in the response object
	  	for(tweet in tweets){
	  		// creates a variable to store the date of each tweet
	  		var dateCreated = new Date(tweets[tweet].created_at);
	  		// display the tweet #, date created, and text
	  		console.log("Tweet " + (parseInt(tweet)+1) + " ");
	  		console.log(dateCreated.toString().slice(0, 24) + " ");
	    	console.log(tweets[tweet].text);
	    	console.log("\n");
	    }
	  }
	});
}

function spotifySong(song) {
	spotify.search({ type: 'track', query: song }, function(err, data) {
    	if ( err ) {
        	console.log('Error occurred: ' + err);
        	return;
    	}
    // grab the first track result
    var firstResult = data.tracks.items[0],
        // we want the: artist(s), song name, preview link, and album
    	artist = firstResult.artists[0].name,
    	name = firstResult.name,
    	link = firstResult.preview_url,
    	album = firstResult.album.name;
    // display the song information
 	console.log("Artist: " + artist + "\n" + "Album: " + album + "\n" + "Song: " + name + "\n" + "Preview: " + link);
	});
}

function movie(movie) {
	var options = {  
	  method: 'GET',
	  uri: 'http://www.omdbapi.com',
	  qs: {
	  	t: movie,
	  	tomatoes: true,
		},
	}
	// use Request to grab data from the OMDB API based off of movie searched
	request(options, function (error, response, body) {
		// if request successful
	  	if (response.statusCode === 200 && !error) {
	  		// Parse the body of the site
	  		var result = JSON.parse(body),
	  			title = result.Title,
	  			year = result.Year,
	  			rating = result.imdbRating,
	  			country = result.Country,
	  			language = result.Language,
	  			plot = result.Plot,
	  			cast = result.Actors
	  			tomatoes = result.tomatoURL;
	  			// show the movie information
	  			console.log("Title: " + title);
	  			console.log("Year: " + year);
	  			console.log("Rating: " + rating);
	  			console.log("Country: " + country);
	  			console.log("Language: " + language);
	  			console.log("Plot: " + plot);
	  			console.log("Cast: " + cast);
	  			console.log("Link: " + tomatoes);
	  	} else {
	  		console.log('error:', error); // Print the error if one occurred 
	  	}
	});
}
// Using the `fs` Node package, LIRI will take the text inside of random.txt 
// and then use it to call one of LIRI's commands.
function doSomething() {
	// first we read the file
	fs.readFile("./random.txt", "utf8", function(error, data) {
		// if there is an error, log to the console and stop running the function
		if (error) {
			console.log(error);
			return(error);
		}
		// if no error we will run processFile function
		processFile(data);
	});
	function processFile(content) {
		console.log("File reads: " + content);
		// split the data by comma so you can access *type of search* and *what to search for*
		var fileData = content.split(',');
		// pass this information into the function if the text instructs us to search through spotify
		if(fileData[0] === "spotify-this-song"){
    		spotifySong(fileData[1]);
		}
	}
}

// * In addition to logging the data to your terminal/bash window, output the data to a .txt file called `log.txt`.
// * Make sure you append each command you run to the `log.txt` file. 
// * Do not overwrite your file each time you run a command.