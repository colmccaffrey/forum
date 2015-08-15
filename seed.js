var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('forums.db');

db.run("INSERT INTO users (name, img) VALUES (?,?), (?,?)",
	'User1', 'http://pixel.nymag.com/imgs/daily/vulture/2015/04/28/28-avatar.w529.h529.2x.jpg',
	'User2', 'http://www.bostonherald.com/sites/default/files/blog_posts/1jonstewart.jpg',
	function(err){
		if(err){
			throw err;
		}
	}
);