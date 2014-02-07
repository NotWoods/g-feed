// Change these three variables!
var outerDiv = "news"; //The articles are placed in a div with this ID
var userId = "ID_HERE"; //Your G+ user id.  The string of numbers after "https://plus.google.com/", or a string that begins with a "+"
var key = "KEY_HERE"; //Your Google+ API Key. Can be obtained from cloud.google.com/console

/* Google+ Feed
 * 	Creates a group of articles on your website from a Google+ stream, using the API
 * 
 * by Tiger Oakes
 * 	tigeroakes@gmail.com
 * 	+TigerOakes
 *  @Not_Woods
 */
var collection = "public"; 
var url = "https://www.googleapis.com/plus/v1/people/" + userId + "/activities/" + collection + 
	'?key=' + key; 
	
console.assert(userId != "ID_HERE", "userId has not been entered, get it from your Google+ profile");
console.assert(key != "KEY_HERE", "API key has not been entered, get it from cloud.google.com/console");

//Make a request
var xhr = new XMLHttpRequest();
xhr.open(
	"GET",	//DOMString method
	url,	//DOMString url
	true
);

xhr.onload = function() {
	var feed = JSON.parse(xhr.responseText);
	var entries = [];
	
	if (feed.error) {
		if (console && console.error) {
			console.error('Error loading Google+ stream.', feed.error);
		}
		return;
	}
	
	for (var i = 0; i < feed.items.length; i++) {
		var item = feed.items[i];
		var object = item.object;
		
		//Add any thumbnails
		var thumbs = [];
		var article = {};
		if (object.attachments) {
			for (var j = 0; j < object.attachments.length; j++) {
				var attachment = object.attachments[j];
				switch (attachment.objectType) {
				// If just one photo, get the link and source
				case 'photo':
					thumbs.push({
						url: attachment.image.url,
						link: attachment.fullImage.url
					});
					break;
				// If a full album, get link and individual source
				case 'album':
					for (var m = 0; m < attachment.thumbnails.length; m++) {
						thumbs.push({
							url: attachment.thumbnails[m].image.url,
							link: attachment.url
						});
					}
					break;
				// If a video, get a link and thumbnail to display
				case 'video':
					thumbs.push({
						url: attachment.image.url,
						link: attachment.url
					});
					break;
				// If an article, get the title, link, and preview test
				case 'article':
					article["displayName"] = attachment.displayName;
					article["url"] = attachment.url;
					if (attachment.content) {
						article["content"] = attachment.content;
					}
					break;
				}
			}
		}
		
		//Set the post author, depending if the post is reshared
		var author = {
			name: "",
			url: "",
			imageURL: ""
		}
		// If a reshared post
		if (object.actor) {
			author.name = object.actor.displayName;
			author.url = object.actor.url;
			author.imageURL = object.actor.image.url;
		} else { 
			//Use the profile's name and image
			author.name = item.actor.displayName;
			author.url = item.actor.url;
			author.imageURL = item.actor.image.url;
		}
		
		//Set up the entry object
		var entry = {
			url: object.url,
			body: object.content,
			date: parseRfc3339Date(item.updated),
			thumbnails: thumbs,
			comments: object.replies.totalItems,
			plusones: object.plusoners.totalItems,
			reshares: object.resharers.totalItems,
			article: article,
			author: author
		}
		
		entries.push(entry);
	}
	
	loadPosts(entries);
}
//Send the request!
xhr.send();
// Changes the RFC 3339 date into a JavaScript date.
function parseRfc3339Date(dateStr) {
  var match = parseRfc3339Date._RFC_3339_DATE_RE.exec(dateStr || '');
  if (!match)
    return null;

  var d = {
    year: parseInt(match[1], 10),
    month: parseInt(match[2], 10),
    day: parseInt(match[3], 10),
    hour: parseInt(match[4], 10),
    minute: parseInt(match[5], 10),
    second: parseInt(match[6] || 0, 10),
    tz: {
      exists: !!(match[7] || match[8]),
      Z: match[7],
      hrs: parseInt(match[8] || 0, 10),
      mins: parseInt(match[9] || 0, 10)
    }
  };

  var date = new Date(d.year, d.month - 1, d.day, d.hour, d.minute, d.second);

  if (d.tz.exists) {
    var numericDate = date.getTime();
    numericDate -= date.getTimezoneOffset() * 60000;
    if (d.tz.hrs)
      numericDate += (d.tz.hrs * 60 + d.tz.mins) * 60000;

    date = new Date(numericDate);
  }
  window.foo = d;
  return date;
}
parseRfc3339Date._RFC_3339_DATE_RE = new RegExp(
    '^(\\d{4})-(\\d{2})-(\\d{2})' + // date
    'T(\\d{2})\\:(\\d{2})' + // hours, minutes
    '(?:\\:(\\d{2}(?:\\.\\d+)?))?' + // seconds, milliseconds
    '(?:(Z)|([+-]\\d{2})(\\d{2}))?' + // timezone
    '$', 'i');
	
// This function turns the post data into an article div on the site
function loadPosts(array) {
	var container = document.getElementById(outerDiv);
	
	for (var i = 0; i < array.length; i++) {
		var entry = array[i];
		var article = "";
		var thumbs = "";
		
		//Checks if an article is present
		if (entry.article.displayName) {
			article = '<div class="link"><a class="title" href="' + 
				entry.article.url + '">' +
				entry.article.displayName + '</a><p>' +
				entry.article.content + '</p></div>';
		}
		
		//Checks if a image, album, or video is present
		if (entry.thumbnails.length > 0) {
			console.log(i);
			thumbs = '<div class="attachments">';
			for (var k = 0; k < entry.thumbnails.length; k++) {
				thumbs += '<a href="' + entry.thumbnails[k].link +
				'"><img src="' + entry.thumbnails[k].url + '">';
			}
			thumbs += '</div>';
		}
		
		// If you would like to use abbreviated month names, change the array to:
		// [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
		//	"Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
		var monthNames = [ "January", "February", "March", "April", "May", "June", 
			"July", "August", "September", "October", "November", "December" ];
		
		//Turns the data into an article div.  You can change this if you want a different output
		container.innerHTML += '<article>' +
			entry.body + article + thumbs +
			'<a class="ar-footer" href="' + entry.url + '">' + '<span class="date">' + 
			monthNames[entry.date.getMonth()] + ' ' + entry.date.getDate() + ', ' +
			entry.date.getFullYear() + '</span> <span class="plusone">+' + entry.plusones + 
			'</span> <span class="comments">' + entry.comments + 
			' Comments</span> <span class="reshares">' + entry.reshares + ' Reshares</span></a>' + 
			'<a class="author" href="' + entry.author.url + '">By ' + entry.author.name + '</a>';
	}
}