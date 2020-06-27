-- Instagram Clone Sample Schema
-- Users, Photos, Comments, Likes, Hashtags, Followers/Followees

CREATE DATABASE ig_clone;
USE ig_clone;

CREATE TABLE users (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
)

INSERT INTO users (username) VALUES
('alfredlucero'),
('regine');

DESCRIBE users;

-- Photos references Users table
CREATE TABLE photos (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  image_url VARCHAR(255) NOT NULL,
  caption VARCHAR(255) NOT NULL,
  user_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY(user_id) REFERENCES users(id)
);

INSERT INTO photos (image_url, caption, user_id) VALUES
('blah.com', 'photo caption', 1),
('image.com', 'photo caption again', 2);

-- Inner Join to get photo and user details
SELECT * FROM photos
JOIN users
  ON photos.user_id = users.id;

DESCRIBE photos;

-- Comments references Photos and Users table
CREATE TABLE comments (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  comment_text VARCHAR(255) NOT NULL,
  user_id INTEGER NOT NULL,
  photo_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (photo_id) REFERENCES photos(id)
);

INSERT INTO comments(comment_text, user_id, photo_id) VALUES
('Some photo comment', 1, 1),
('Another awesome photo', 2, 2),

DESCRIBE comments;

-- Likes
-- No id like the others since we aren't referring to this table anywhere else
-- Need to be sure there aren't duplicates with the same user id and photo id for a like so we make a combination primary key
CREATE TABLE likes (
  user_id INTEGER NOT NULL,
  photo_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (photo_id) REFERNECES photos(id),
  PRIMARY KEY(user_id, photo_id)
);

INSERT INTO likes(user_id, photo_id) VALUES
(1,1),
(2,1),
(2,2),
(1,2);

-- Followers
-- Keep track of one way relationship of following
-- Want to enforce one of a given relationship with a combination primary key
CREATE TABLE follows(
  follower_id INTEGER NOT NULL,
  followee_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (follower_id) REFERENCES users(id),
  FOREIGN KEY (followee_id) REFERENCES users(id),
  PRIMARY KEY(follower_id, followee_id)
);

INSERT INTO follows(follower_id, followee_id) VALUES
(1, 2),
(2, 1);

DESCRIBE follows;

-- Hashtags/Tags
-- Solution 1: add a tags column in photos table i.e. '#hash#tag#cat'
-- has limitied number of tags stroed and cannot store additional information, have to be careful with searching
-- Solution 2a: can have a photos and tags table i.e. tag_name, photo_id
-- unlimited number of tags and slower than previous solution
-- Solution 2b: Can also have a photos, photo_tags (photo, tag_id) and tags table (id, tag_name) for unlimited number of tags, can add additional information but more work for inserting/updating and have to worry about orphans
CREATE TABLE tags (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  tag_name VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
);

CREATE TABLE photo_tags (
  photo_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  FOREIGN KEY (photo_id) REFERENCES photos(id),
  FOREIGN KEY (tag_id) REFERENCES tags(id),
  -- Prevents multiple instances of the same tag on the same photo
  PRIMARY KEY(photo_id, tag_id)
);

INSERT INTO tags(tag_name) VALUES
('flex'),
('cute');

INSERT INTO photo_tags(photo_id, tag_id) VALUES
(1,1),
(1,2),
(2,1);
