CREATE DATABASE student_clubs;

USE student_clubs;

CREATE TABLE users (
    id int NOT NULL AUTO_INCREMENT,
    username varchar(255),
    phone varchar(255),
    mobile varchar(255),
    first_name varchar(255),
    last_name varchar(255),
    email varchar(255),
    password varchar(255),
    created_at datetime,
    updated_at datetime,
    is_admin boolean,
    student_id varchar(255),
    PRIMARY KEY (id)
);

CREATE TABLE clubs (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255),
    description text,
    logo_url varchar(255),
    created_at datetime,
    updated_at datetime,
    PRIMARY KEY (id)
);

CREATE TABLE events (
    id int NOT NULL AUTO_INCREMENT,
    club_id int,
    title varchar(255),
    description varchar(255),
    event_time datetime,
    created_at datetime,
    updated_at datetime,
    PRIMARY KEY (id),
    FOREIGN KEY (club_id) REFERENCES clubs(id)
);

CREATE TABLE user_clubs (
    user_id int NOT NULL,
    club_id int NOT NULL,
    is_manager boolean,
    created_at datetime,
    updated_at datetime,
    notify_updates boolean,
    notify_events boolean,
    PRIMARY KEY (user_id, club_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (club_id) REFERENCES clubs(id)
);

CREATE TABLE club_posts (
    user_id int,
    club_id int,
    title varchar(255),
    description text,
    is_private boolean,
    created_at datetime,
    updated_at datetime,
    id int NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (club_id) REFERENCES clubs(id)
);

CREATE TABLE user_event_rsvps (
    user_id int,
    event_id int,
    created_at datetime,
    updated_at datetime,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (event_id) REFERENCES events(id)
);

CREATE TABLE feedback (
    name varchar(255),
    email varchar(255),
    text varchar(255)
);

INSERT INTO users VALUES (1,'admin1',NULL,NULL,NULL,NULL,'admin@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$S8h8DAKdJEi7jdxpXPA+XA$CfB6t0+vS+uQEoSfVTfJqkmJU8srj1w1Iol4ifWDVdA','2023-05-21 03:49:30','2023-05-21 03:49:30',1,NULL),(2,'test1',NULL,NULL,'test','test','test@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$S8h8DAKdJEi7jdxpXPA+XA$CfB6t0+vS+uQEoSfVTfJqkmJU8srj1w1Iol4ifWDVdA','2023-05-21 03:49:30','2023-05-21 03:49:30',0,NULL);

INSERT INTO clubs VALUES (1,'Japanese club','The Japanese Club is a dynamic community that celebrates Japanese culture through language, art, and traditions. Join us for exciting events, language exchange sessions, and cultural activities as we delve into the fascinating world of Japan together. Discover the beauty and richness of Japanese traditions in our inclusive club','image/clubsi/c1.png',NULL,NULL),(2,'Penguin Logistic club','The Logistic Club is a vibrant community that explores the intricacies of logistics and supply chain management. Join us for engaging discussions, industry insights, and networking opportunities. Discover the latest trends, share knowledge, and expand your professional network in this dynamic club dedicated to the logistics field','image/clubsi/c2.png',NULL,NULL),(3,'Student club','The Student Club is a dynamic community for students to connect, learn, and thrive. Join us for engaging activities, workshops, and events that foster personal growth, leadership development, and networking opportunities. Discover new passions, make lifelong friendships, and enhance your university experience in this inclusive and supportive student club.','image/clubsi/c3.png',NULL,NULL),(4,'Gaming club','The Gaming Club is a lively community that brings together gamers of all levels and interests. Join us for fun-filled gaming sessions, tournaments, and social events where you can connect with fellow gamers, discover new games, and showcase your skills. Immerse yourself in the exciting world of gaming in our inclusive and welcoming club.','image/clubsi/c4.png',NULL,NULL),(5,'Book club','The Book Club is a captivating community that celebrates the joy of reading and meaningful discussions. Join us as we explore diverse genres, share literary insights, and delve into thought-provoking narratives. Expand your reading horizons, connect with fellow book enthusiasts, and indulge in the pleasures of storytelling in our inclusive book club.','image/clubsi/c5.png',NULL,NULL),(6,'Chess club','The Chess Club is an engaging community that brings together chess enthusiasts of all skill levels. Join us for strategic battles, friendly matches, and chess workshops to enhance your skills. Connect with fellow chess lovers, participate in tournaments, and embrace the intellectual challenges of the game in our welcoming club.','image/clubsi/c6.png',NULL,NULL);

INSERT INTO events VALUES (1,1,'Welcome Party','A simple welcome party','2023-06-05 00:00:00',NULL,NULL),(2,2,'Welcome Party','A simple welcome party','2023-07-05 00:00:00',NULL,NULL),(3,3,'Welcome Party','A simple welcome party','2023-08-05 00:00:00',NULL,NULL),(4,4,'Welcome Party','A simple welcome party','2023-09-05 00:00:00',NULL,NULL),(5,5,'Welcome Party','A simple welcome party','2023-10-05 00:00:00',NULL,NULL),(6,6,'Welcome Party','A simple welcome party','2023-11-05 00:00:00',NULL,NULL),(7,1,'Welcome Party','A simple welcome party','2023-06-08 00:00:00',NULL,NULL),(8,2,'Welcome Party','A simple welcome party','2023-06-08 00:00:00',NULL,NULL),(9,2,'Welcome Party','A simple welcome party','2023-06-08 00:00:00',NULL,NULL),(10,3,'Welcome Party','A simple welcome party','2023-06-09 00:00:00',NULL,NULL),(11,5,'Welcome Party','A simple welcome party','2023-06-09 00:00:00',NULL,NULL),(12,6,'Welcome Party','A simple welcome party','2023-06-07 00:00:00',NULL,NULL),(13,2,'Welcome Party','A simple welcome party','2023-06-10 00:00:00',NULL,NULL),(14,3,'Welcome Party','A simple welcome party','2023-06-10 00:00:00',NULL,NULL);

INSERT INTO user_clubs VALUES (2,2,1,NULL,NULL,0,0),(2,3,1,NULL,NULL,0,0),(2,4,1,NULL,NULL,0,0),(2,5,1,NULL,NULL,0,0),(2,6,1,NULL,NULL,0,0);

INSERT INTO club_posts VALUES (2,1,'Welcome Event','Welcome Party',0,NULL,NULL,1),(2,2,'Welcome Event','Welcome Party',0,NULL,NULL,2),(2,3,'Welcome Event','Welcome Party',0,NULL,NULL,3),(2,4,'Welcome Event','Welcome Party',0,NULL,NULL,4),(2,5,'Welcome Event','Welcome Party',0,NULL,NULL,5),(2,6,'Welcome Event','Welcome Party',0,NULL,NULL,6);

INSERT INTO user_event_rsvps VALUES (2,2,NULL,NULL),(2,1,NULL,NULL),(2,3,NULL,NULL),(2,5,NULL,NULL),(2,4,NULL,NULL);
