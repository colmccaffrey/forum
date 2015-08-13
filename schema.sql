DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS topics;
DROP TABLE IF EXISTS comments;

CREATE TABLE users (
	id INTEGER PRIMARY KEY autoincrement,
	name TEXT not null unique,
	img TEXT
);

PRAGMA foreign_keys = ON;

CREATE TABLE topics (
	id INTEGER PRIMARY KEY autoincrement,
	title TEXT,
	votes INTEGER,
	user_id INTEGER,
	FOREIGN KEY(user_id) REFERENCES users(id)
);

PRAGMA foreign_keys = ON;
CREATE TABLE comments (
	id INTEGER PRIMARY KEY autoincrement,
	content TEXT,
	topic_id INTEGER,
	user_id INTEGER,
	FOREIGN KEY(topic_id) REFERENCES topics(id),
	FOREIGN KEY(user_id) REFERENCES users(id)
);