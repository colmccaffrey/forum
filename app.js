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
	db.get("SELECT comments FROM comments, topics INNER JOIN topics WHERE ON topics.title = ? WHERE comments.topic_id = topics.id", title, function(err, comments){
		console.log(comments)
		res.render('new.html.ejs', {comments: comments, title: title});
	});
});

// db.get('forum/topics/:title', function (req, res){

// })
// 		res.render('new.html.ejs', {comments: comments, title: title});


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