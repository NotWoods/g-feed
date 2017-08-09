![](thumb.png)

G+ Feed
=======
Creates a group of articles on your website from a Google+ stream, using the API.

Setup
-----
Link the script to the webpage you want to run it on. The following variables 
should be altered to match your use-case.  These are located at the top of the
script.

* `outerDiv` The articles are placed in a div with this ID.  Defualt value is "news"
* `userId` Your Google+ user id.  The string of numbers after "https://plus.google.com/" on your profile page.  May be a readable string, such as "+TigerOakes"
* `key` Your Google+ API Key. The key can be generated or obtained from cloud.google.com/console

Posts
-----
At the bottom of the script, the 'loadPosts()' function creates the div that will
be insereted into the webpage.  The function first creates the div for linked 
articles, then the div for images or thumbnails.  These divs are inserted into 
the primary article container, along with the post body and date, as well as 
+1's, comments, and reshares, along with the post author.

Variables
---------
These variables can be used inside the 'loadPosts()' function.

* `entry.body` The HTML-formatted content of the post, which is suitable for display.
* `entry.url` The URL that points to the linked post.
* `entry.date` The time that the post was last updated, in JavaScript date format.
* `entry.plusones` The amount of +1's on the post.
* `entry.comments` The amount of comments on the post.
* `entry.reshares` The amount of times the post has been reshared.

#### Thumbnails
* `entry.thumbnails[].link` The link to the image, album, or video.
* `entry.thumbnails[].url` The source url for the image or video thumbnail.

If an image or video, only 1 item will be present in the array.  If an album,
then multiple items will be present.

#### Linked Article
* `entry.article.displayName` The title of the linked article.
* `entry.article.url` The url for the article.
* `entry.article.content` This property contains  a snippet of text from the article.

#### Author
* `entry.author.name` The post author's name, which is suitable for display
* `entry.author.url` A url to the post author's profile
* `entry.author.imageURL` A source url for the profile image of the post author

If the post was reshared from another user, that user's information will be used 
for the author.  Otherwise, the userId specified will be used as the author.

Styling
-------
The defualt `loadPosts()` function contains these classes, which can be styled 
with CSS3.  CSS3 selectors are also used, to show how thumbnails can be changed
on an individual use basis.  An example stylesheet is inside the git.

* `article` Contains the entire post
* `.attachments` Contains image or album thumbnails. Each `<img>` tag is wrapped in an `a` link tag.  It is an div element
* `.attachments a:only-child` Can be used to style individual images or video thumbnails seperate from album thumbnails.
* `.attachments a:not(only-child)` Can be used to style album thumbnails.
* `.link` Contains a linked article attachment, if present.  It is a div element
* `.title` The title of a linked article.  It is an a element.
* `.ar-footer` Contains the post date, +1's, comment count, and reshare count. It is an a element.
* `.date` The date the post was last updated.  It is a span element.
* `.plusone` The amount of +1's the post has received.  It is a span element.
* `.comments` The amount of comments the post has received.  It is a span element.
* `.reshares` The amount of reshares the post has received.  It is a span element.
* `.author` The name of the author, prefixed with "By".  No image is present by defualt. It is an a element.
