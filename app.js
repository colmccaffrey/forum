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

app.get('/', function(req,res){
	res.redirect('/forum');
});
//list of content from comments where comments.topic_id = topics.id where topics.title = req.params.title
// var topicId = 1;
// 	db.get("SELECT content FROM comments WHERE topic_id = ?", topic.id, function(err, comments){

// db.get("SELECT authors.hometown FROM authors INNER JOIN books ON books.title= 'Fahrenheit 451' WHERE author_id = authors.id", function(err, author){
// 	console.log('------------Hometown author of Fahrenheit 451--------------')
// 	console.log(author);
// });

app.get('/forum', function(req, res){
	res.render('index.html.ejs');
});

app.get('/forum/topics', function(req, res){
	db.all("SELECT * FROM topics", function(err, topics){
		console.log("topics" + topics);
		if(err){
			throw err;
		};
		res.render('show.html.ejs', {topics : topics});
	});
});



app.get('/forum/topics/:title', function (req, res){
	var title = req.params.title;
	console.log(title + req.body)
	db.get("SELECT id FROM topics WHERE title= ?", title, function(err, topic){
		db.all("SELECT * FROM comments WHERE topic_id = ?", topic.id, function(err, comments){
			if (err){
				throw err;
			};
				console.log(topic.id + comments.content );
				console.log("comments.content "+ comments);
				res.render('new.html.ejs', {comments: comments, title: title});

		});
	});
});

app.post('/forum/topics/:title', function (req, res){
	var title = req.body.title;
	var userName = req.body.name;
	var comment = req.body.content;
	db.get("SELECT id FROM topics WHERE title= ?", title, function(err, topic){
		var topicId = topic.id;
		console.log("topic id" + topic.id);
		db.get("SELECT id FROM users WHERE name=?", userName, function(err, user){
			var userId = user.id;
				console.log("topic id" + topic.id);
				db.run("INSERT INTO comments (content, topic_id, user_id) VALUES (?,?,?)", comment, topicId, userId, function(err){
					if (err){
						throw err
					};
					console.log("title -userName - comment- topic id- user id" + title + userName + comment + topic.id + user.id);
					res.redirect('/forum/topics/' + req.body.title);
				});
			});
		});
	});


app.post('/forum/topics', function(req, res){
	var title = req.body.title;
	console.log('title' + title);
	var userName = req.body.name;
	console.log("req.body " +userName );
db.get("SELECT * FROM users WHERE name= ?", userName, function(err, user){
	var id = user.id;
	console.log('id ' + id);
	db.run("INSERT INTO topics (title, votes, user_id) VALUES (?,?,?)", title, 0, id, function(err){
			res.redirect('/forum/topics');
		});
	});
});

app.listen(3000, function(req, res){
	console.log("listening on port 3000");
})