var express = require('express');
var app = express();
var sqlite3= require('sqlite3');
var fs = require('fs');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var urlencoderBodyParser = bodyParser.urlencoded({extended:false});
var request = require('request');
var db = new sqlite3.Database('forums.db');

app.set('view_engine', 'ejs');
app.use(urlencoderBodyParser);
app.use(express.static('css'));
app.use(methodOverride('_method'));


app.get('/', function(req,res){ //gets landing page-redirect to RESTFUL route /forums
	res.redirect('/forum');
});

app.get('/forum', function(req, res){ //renders index  with navigation options
	res.render('index.html.ejs');
});

app.get('/forum/topics', function(req, res){ //renders page with a list of all topics by latest first- option to input new topic
	db.all("SELECT topics.title AS title, topics.user_id AS user_id, topics.id AS id, topics.votes AS votes, users.name AS user_name, users.img AS image FROM topics INNER JOIN users ON topics.user_id = users.id ORDER BY topics.id DESC", function(err, topics){
		if(err){
			throw err;
		};
		var type="Latest";		
		res.render('show.html.ejs', {topics : topics, type: type});
	});
});

app.get('/forum/users', function(req, res){ //test function to track users
	db.all("SELECT * FROM users ORDER BY id DESC", function(err, users){
		if(err){
			throw err;
		};
		res.render('users.html.ejs', {users: users});
	});
});

app.get('/forum/topics/popular', function(req, res){ //renders page with a list of all topics by vote count, popular first- option to input new topic
	db.all("SELECT topics.title AS title, topics.user_id AS user_id, topics.id AS id, topics.votes AS votes, users.name AS user_name, users.img AS image FROM topics INNER JOIN users ON topics.user_id = users.id ORDER BY topics.votes DESC", function(err, topics){
		if(err){
			throw err;
		};
		var type="Popular";
		res.render('show.html.ejs', {topics: topics, type: type});
	});
});

app.get('/forum/comments/recent', function(req, res){ //renders page with a list of the most recent  comments and links topic page (list of comments by topic) the comment is posted in are posted in - optiont o add new topic
	db.all("SELECT comments.content AS content, comments.user_id AS user_id, users.name AS user_name, users.id AS id, topics.title AS topic FROM comments INNER JOIN topics INNER JOIN users ON comments.topic_id = topics.id and comments.user_id = users.id ORDER BY comments.id DESC", function(err, recent){ 
		if(err){
			throw err;
		};
		res.render('recent.html.ejs', {recent: recent});
	});
});

app.get('/forum/topics/:title', function (req, res){  //renders page with comments from a specific topic and lists how many comments there are in that topic- option to add new comment to topic 
	var title = req.params.title;
	console.log("title " + title)
	db.get("SELECT id FROM topics WHERE title= ?", req.params.title, function(err, topic){
		if (err){
			var error="Please create a username first.";
			res.render('error.html.ejs', {error: error});
		}else{
		console.log("topicid" +topic.id);
		db.all("SELECT comments.content AS content, comments.user_id AS user_id, comments.id AS id, users.name AS user_name, users.img AS image, users.id AS userId FROM comments INNER JOIN users ON comments.user_id = users.id WHERE topic_id = ?  ORDER BY id DESC", topic.id, function(err, comments){
			db.get("SELECT count(*) AS count FROM comments WHERE topic_id = ?", topic.id, function(err, number){
			if (err){
				throw err;
			};
				res.render('new.html.ejs', {comments: comments, title: title, number: number, topic: topic});
				});
			});
			};
		});
	});

app.post('/', function(req, res){ //inserts new user data into users table when user selects join from homepage (/forums)
	if (req.body.img === ""){
		var image = "http://127.0.0.1:3000/images/default.png";
	} else{
		image = req.body.img;
	}
	db.run("INSERT INTO users (name, img) VALUES (?,?)", req.body.name, image, function(err){
		if (err){
			var error="That name is already taken";
			res.render('error.html.ejs', {error: error});
		} else{
		res.redirect('/forum/topics');
		};
	});
});

app.post('/forum/topics/:title', function (req, res){ //inserts new comments into database by username and topic whenever user selects add comment anywhere in the app- redirect to list of all comments by topic
	var title = req.body.title;
	var userName = req.body.name;
	var comment = req.body.content;
	db.get("SELECT id FROM topics WHERE title= ?", title, function(err, topic){
		var topicId = topic.id;
		db.get("SELECT id FROM users WHERE name=?", userName, function(err, user){
			if (user === undefined){
			var error="Please create a username to leave comments.";
			res.render('error.html.ejs', {error: error});
			}else{
			var userId = user.id;
				db.run("INSERT INTO comments (content, topic_id, user_id) VALUES (?,?,?)", comment, topicId, userId, function(err){
					if (err){
						throw err
					};
					res.redirect('/forum/topics/' + req.body.title);
				});
				};
			});
		});
	});

app.post('/forum/topics', function(req, res){ //inserts data for new topic and username into tables topics and users, if a username does not already exist the one entered with be added to users by default -redirect to list of all topics
	var title = req.body.title;
	var userName = req.body.name;
	db.get("SELECT * FROM users WHERE name = ?", userName, function(err, user){
		if (user === undefined){		
			db.run("INSERT INTO users (name, img) VALUES (?,?)", req.body.name, 'http://127.0.0.1:3000/images/default.png', function(err){
			});
		} 
		db.get("SELECT * FROM users WHERE name = ?", userName, function(err, user){
		var id = user.id;
			db.run("INSERT INTO topics (title, votes, user_id) VALUES (?,?,?)", title, 0, id, function(err){
			res.redirect('/forum/topics/' + req.body.title);
			});
		});
	});
});

app.put('/forum/topics/:id', function(req, res){ //inserts new vote tally for each topic when a user clicks on vote
	var id = parseInt(req.params.id);
		db.run("UPDATE topics SET votes= votes+1 WHERE id= ?", id, function(err){
			if (err){
				throw err;
			};
			res.redirect('/forum/topics' +  '#' + req.body.id);
	});
})

app.listen(3000, function(req, res){ //listens
	console.log("listening on port 3000");
})