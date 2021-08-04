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

-- Database Triggers
-- SQL Statements that are automatically run when a specific table is changed
-- CREATE TRIGGER trigger_name
--  trigger_time trigger-event ON table_name FOR EACH ROW BEGIN ... END
--  trigger_time - BEFORE/AFTER, trigger_event - INSERT, UPDATE, DELETE, table_name - i.e. photos/users
-- Sample trigger to prevent self-follows
-- Triggers can make debugging hard i.e. not expecting more rows to be affected than expected after certain SQL queries
-- Not best practice to use so many triggers
DELIMITER $$

CREATE TRIGGER prevent_self_follows
  BEFORE INSERT ON follows FOR EACH ROW
  BEGIN
    IF NEW.follower_id = NEW.followee_id
    THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'You cannot follow yourself!';
    END IF;
  END;
$$

DELIMITER ;

-- Sample trigger to capture unfollows and add it to another table
CREATE TABLE unfollows(
  follower_id INTEGER NOT NULL,
  followee_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (follower_id) REFERENCES users(id),
  FOREIGN KEY (followee_id) REFERENCES users(id),
  PRIMARY KEY (follower_id, followee_id),
);

DELIMITER $$

CREATE TRIGGER capture_unfollows
  AFTER DELETE ON follows FOR EACH ROW
  BEGIN
    -- INSERT INTO unfollows(follower_id, followee_id)
    -- VALUES(OLD.follower_id, OLD.followee_id);
    INSERT INTO unfollows
    SET follower_id = OLD.follower_id,
        followee_id = OLD.followee_id;
  END;

$$

DELIMITER;

DELETE FROM follows WHERE follower_id=3;

SHOW TRIGGERS;

DROP TRIGGER prevent_self_follows;

-- Use INDEX to improve performance of SELECT operations
-- In MySQL, the Primary Key and any Foreign Key you create on a table is always an index automatically

-- MYSQL DOCS TRAINING
SELECT what_to_select -- list of columns
FROM which_table 
WHERE conditions_to_satify; -- conditions

-- SELECT ALL columns from pet
SELECT * from pet;

-- WHERE conditions
SELECT * FROM pet WHERE name = 'Bowser';
SELECT * FROM pet WHERE birth >= '1998-1-1';
SELECT * FROM pet WHERE species = 'dog' AND sex = 'f';
SELECT * FROM pet WHERE species = 'snake' OR species = 'bird'; 

-- Select specific columns
SELECT name, birth FROM pet;
-- Unique owners returned
SELECT DISTINCT owner FROM pet;
-- With conditions
SELECT name, species, birth FROM pet
WHERE species = 'dog' OR species = 'cat';

-- Sorting (default is ascending)
SELECT name, birth FROM pet ORDER BY birth;
SELECT name, birth FROM pet ORDER BY birth DESC;
-- Sort multiple columns in different orders (species ascending, birth descending)
SELECT name, species, birth FROM pet
ORDER BY species, birth DESC;

-- Date calculations
-- Determine how many years old each pet is with TIMESTAMPDIFF()
SELECT name, birth, CURDATE(), TIMESTAMPDIFF(YEAR, birth, CURDATE()) as age
FROM pet ORDER BY age;
-- Determine age of death for pets by checking whether death value is NULL
SELECT name, birth, death,
TIMESTAMPDIFF(YEAR,birth,death) AS age
FROM pet WHERE death IS NOT NULL ORDER BY age;
-- Which folks have birthdays next month? only care about month part of birth with MONTH()
SELECT name, birth, MONTH(birth) FROM pet;
SELECT name, birth FROM pet
WHERE MONTH(birth) = MONTH(DATE_ADD(CURDATE(), INTERVAL 1 MONTH));
SELECT name, birth FROM pet
WHERE MONTH(birth) = MOD(MONTH(CURDATE()), 12) + 1;

-- Working with NULL values
-- USING IS NULL OR IS NOT NULL operators (0 or NULL means false)
-- Two NULL values regarded as equal in GROUP BY
-- ORDER BY - NULL values presented first or last if DESC
-- Can place '' or 0 in a NOT NULL column since NULL means not having a value
SELECT 1 IS NULL, 1 IS NOT NULL;

-- Pattern Matching
-- _ to match any single character
-- % to match an arbitrary number of characters including zero characters
-- use LIKE or NOT LIKE operators
-- Find names beginning with b
SELECT * FROM pet WHERE name LIKE 'b%';
-- Find names ending with fy
SELECT * FROM pet WHERE name LIKE '%fy';
-- Find names containing a w
SELECT * FROM pet WHERE name LIKE '%w%';
-- Find names containing exactly five characters
SELECT * FROM pet WHERE name LIKE '_____';
-- REGEXP and NOT REGEXP or RLIKE AND NOT RLIKE
-- . matches any single character
-- [...] character class matches any character within brackets i.e. [abc] matches a,b,c or [a-z] for a range, [0-9]
-- * matches zero or more instances of thing preceding it i.e. x* matches any number of x characters, [0-9]* matches any number of digits, .* matches any number of anything
-- succeeds if pattern matches anywhere in value being tested vs. matching entire value for LIKE
-- anchor a pattern so it must match the beginning or end of value being tested, use ^ at beginning or $ at end of pattern
SELECT * FROM pet WHERE name REGEXP '^b'; -- names beginning with b
SELECT * FROM pet WHERE name REGEXP BINARY '^b'; -- forces lowercase b only
SELECT * FROM pet WHERE name REGEXP 'fy$'; -- ending in fy
SELECT * FROM pet WHERE name REGEXP 'w'; -- containing w
SELECT * FROM pet WHERE name REGEXP '^.....$'; -- exactly 5 characters
SELECT * FROM pet WHERE name REGEXP '^.{5}$'; -- {n} repeat n times operator

-- Counting Rows
-- COUNT(*) counts number of rows or animals
SELECT COUNT(*) FROM pet;
-- Count how many pets each owner has, need to group by owner and use count
SELECT owner, COUNT(*) FROM pet GROUP BY owner;
-- Count number of animals per species
SELECT species, COUNT(*) FROM pet GROUP BY species;
-- Count number of animals per combination of species and sex;
SELECT species, sex, COUNT(*) FROM pet GROUP BY species, sex;
-- Count for dogs/cats only
SELECT species, sex, COUNT(*) FROM pet
WHERE species = 'dog' OR species = 'cat'
GROUP BY species, sex;
-- GROUP BY needs to match all the named columns

-- Using more than one table
-- FROM clause joins two tables
-- ON specifies how records in one table match the other table i.e. the name column
-- INNER JOIN permits rows from either table to appear in the result if and only if both tables meet conditions
SELECT pet.name,
TIMESTAMPDIFF(YEAR,birth,date) as age,
remark
FROM pet INNER JOIN event
  ON pet.name = event.name
WHERE event.type = 'litter';
-- Can join a table with itself to compare records in a table to other records in same table
-- Find breeding pairs among pets
SELECT p1.name, p1.sex, p2.name, p2.sex, p1.species
FROM pet as p1 INNER JOIN pet as p2
  ON p1.species = p2.species
  AND p1.sex = 'f' and p1.death IS NULL
  AND p2.sex = 'm' and p2.death IS NULL;

-- Getting information about databases and tables
SHOW DATABASES;
-- Which database is selected? NULL if none selected
SELECT DATABASE();
SHOW TABLES;
DESCRIBE TABLE;
-- SHOW CREATE TABLE;
-- SHOW INDEX FROM TABLE;

