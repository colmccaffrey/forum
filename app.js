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

app.get('/forum', function(req, res){
	res.render('index.html.ejs');
});

app.get('/forum/topics', function(req, res){
	db.all("SELECT * FROM topics ORDER BY id DESC", function(err, topics){
		if(err){
			throw err;
		};		
		res.render('show.html.ejs', {topics : topics});
	});
});

app.get('/forum/popular', function(req, res){
	db.all("SELECT * FROM topics ORDER BY votes DESC", function(err, topics){
		if(err){
			throw err;
		};
		res.render('show.html.ejs', {topics: topics});
	});
});

app.get('/forum/topics/:title', function (req, res){
	var title = req.params.title;
	db.get("SELECT id FROM topics WHERE title= ?", title, function(err, topic){
		db.all("SELECT * FROM comments WHERE topic_id = ?", topic.id, function(err, comments){
			db.get("SELECT count(*) AS count FROM comments WHERE topic_id = ?", topic.id, function(err, number){
			if (err){
				throw err;
			};
				res.render('new.html.ejs', {comments: comments, title: title, number: number});
				});
		});
	});
});

app.post('/forum/users', function(req, res){
	db.run("INSERT INTO users (name, img) VALUES (?,?)", req.body.name, 'images/default_avatar.png', function(err){
		res.redirect('/forum/topics');
	})
})

app.post('/forum/topics/:title', function (req, res){
	var title = req.body.title;
	var userName = req.body.name;
	var comment = req.body.content;
	db.get("SELECT id FROM topics WHERE title= ?", title, function(err, topic){
		var topicId = topic.id;
		db.get("SELECT id FROM users WHERE name=?", userName, function(err, user){
			var userId = user.id;
				db.run("INSERT INTO comments (content, topic_id, user_id) VALUES (?,?,?)", comment, topicId, userId, function(err){
					if (err){
						throw err
					};
					res.redirect('/forum/topics/' + req.body.title);
				});
			});
		});
	});

app.post('/forum/topics', function(req, res){
	var title = req.body.title;
	var userName = req.body.name;
	db.get("SELECT * FROM users WHERE name = ?", userName, function(err, user){
		if (user === undefined){		
			db.run("INSERT INTO users (name, img) VALUES (?,?)", req.body.name, 'images/default_avatar.png', function(err){
			});
		} 
		db.get("SELECT * FROM users WHERE name = ?", userName, function(err, user){
		var id = user.id;
			db.run("INSERT INTO topics (title, votes, user_id) VALUES (?,?,?)", title, 0, id, function(err){
			res.redirect('/forum/topics');
			});
		});
	});
});

app.put('/forum/topics/:id', function(req, res){
	var id = parseInt(req.params.id);
		db.run("UPDATE topics SET votes= votes+1 WHERE id= ?", id, function(err){
			if (err){
				throw err;
			};
			res.redirect('/forum/topics');
	});
})

app.listen(3000, function(req, res){
	console.log("listening on port 3000");
})