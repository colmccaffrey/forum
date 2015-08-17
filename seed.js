var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('forums.db');

db.run("INSERT INTO users (name, img) VALUES (?,?), (?,?), (?,?), (?,?), (?,?), (?,?), (?,?)",
	'Stewie', 'http://www.kansascity.com/entertainment/ent-columns-blogs/stargazing/ef0n7z/picture2632808/ALTERNATES/LANDSCAPE_1140/jon%20stewart.jpg',
	'Maddog', 'http://princevega.com/wp-content/uploads/2013/04/Rachel-Maddow-20906341-1-402.jpg',
	'Coldbeer', 'http://elpasodiocese.org/diocese/images/PressReleases/838-495_StephenColbert.jpg',
	'Amurca', 'http://skepchick.org/wp-content/uploads/2015/03/amy-schumer.jpg',
	'Willdo', 'https://pbs.twimg.com/profile_images/527572312699068416/n9NHZzjm_400x400.jpeg',
	'Louie', 'http://www.vanyaland.com/wp-content/uploads/2014/11/Louis-ck-1.jpg',
	'Biebs', 'http://www.eonline.com/eol_images/Entire_Site/2014725/rs_560x415-140825163306-1024.justin-bieber-kate-mckinnon.jpg',
	function(err){
		if(err){
			throw err;
		}
	}
);