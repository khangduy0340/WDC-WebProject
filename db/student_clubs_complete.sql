-- MySQL dump 10.13  Distrib 8.0.32, for Linux (x86_64)
--
-- Host: localhost    Database: student_clubs
-- ------------------------------------------------------
-- Server version	8.0.32-0ubuntu0.22.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `student_clubs`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `student_clubs` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `student_clubs`;

--
-- Table structure for table `club_posts`
--

DROP TABLE IF EXISTS `club_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `club_posts` (
  `user_id` int DEFAULT NULL,
  `club_id` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `is_private` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `club_id` (`club_id`),
  CONSTRAINT `club_posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `club_posts_ibfk_2` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `club_posts`
--

LOCK TABLES `club_posts` WRITE;
/*!40000 ALTER TABLE `club_posts` DISABLE KEYS */;
INSERT INTO `club_posts` VALUES (2,1,'Welcome Event','Welcome Party',0,NULL,NULL,1),(2,2,'Welcome Event','Welcome Party',0,NULL,NULL,2),(2,3,'Welcome Event','Welcome Party',0,NULL,NULL,3),(2,4,'Welcome Event','Welcome Party',0,NULL,NULL,4),(2,5,'Welcome Event','Welcome Party',0,NULL,NULL,5),(2,6,'Welcome Event','Welcome Party',0,NULL,NULL,6);
/*!40000 ALTER TABLE `club_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clubs`
--

DROP TABLE IF EXISTS `clubs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clubs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `logo_url` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clubs`
--

LOCK TABLES `clubs` WRITE;
/*!40000 ALTER TABLE `clubs` DISABLE KEYS */;
INSERT INTO `clubs` VALUES (1,'Japanese club','The Japanese Club is a dynamic community that celebrates Japanese culture through language, art, and traditions. Join us for exciting events, language exchange sessions, and cultural activities as we delve into the fascinating world of Japan together. Discover the beauty and richness of Japanese traditions in our inclusive club','image/clubsi/c1.png',NULL,NULL),(2,'Penguin Logistic club','The Logistic Club is a vibrant community that explores the intricacies of logistics and supply chain management. Join us for engaging discussions, industry insights, and networking opportunities. Discover the latest trends, share knowledge, and expand your professional network in this dynamic club dedicated to the logistics field','image/clubsi/c2.png',NULL,NULL),(3,'Student club','The Student Club is a dynamic community for students to connect, learn, and thrive. Join us for engaging activities, workshops, and events that foster personal growth, leadership development, and networking opportunities. Discover new passions, make lifelong friendships, and enhance your university experience in this inclusive and supportive student club.','image/clubsi/c3.png',NULL,NULL),(4,'Gaming club','The Gaming Club is a lively community that brings together gamers of all levels and interests. Join us for fun-filled gaming sessions, tournaments, and social events where you can connect with fellow gamers, discover new games, and showcase your skills. Immerse yourself in the exciting world of gaming in our inclusive and welcoming club.','image/clubsi/c4.png',NULL,NULL),(5,'Book club','The Book Club is a captivating community that celebrates the joy of reading and meaningful discussions. Join us as we explore diverse genres, share literary insights, and delve into thought-provoking narratives. Expand your reading horizons, connect with fellow book enthusiasts, and indulge in the pleasures of storytelling in our inclusive book club.','image/clubsi/c5.png',NULL,NULL),(6,'Chess club','The Chess Club is an engaging community that brings together chess enthusiasts of all skill levels. Join us for strategic battles, friendly matches, and chess workshops to enhance your skills. Connect with fellow chess lovers, participate in tournaments, and embrace the intellectual challenges of the game in our welcoming club.','image/clubsi/c6.png',NULL,NULL);
/*!40000 ALTER TABLE `clubs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `club_id` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `event_time` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `club_id` (`club_id`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,1,'Welcome Party','A simple welcome party','2023-06-05 00:00:00',NULL,NULL),(2,2,'Welcome Party','A simple welcome party','2023-07-05 00:00:00',NULL,NULL),(3,3,'Welcome Party','A simple welcome party','2023-08-05 00:00:00',NULL,NULL),(4,4,'Welcome Party','A simple welcome party','2023-09-05 00:00:00',NULL,NULL),(5,5,'Welcome Party','A simple welcome party','2023-10-05 00:00:00',NULL,NULL),(6,6,'Welcome Party','A simple welcome party','2023-11-05 00:00:00',NULL,NULL),(7,1,'Welcome Party','A simple welcome party','2023-06-08 00:00:00',NULL,NULL),(8,2,'Welcome Party','A simple welcome party','2023-06-08 00:00:00',NULL,NULL),(9,2,'Welcome Party','A simple welcome party','2023-06-08 00:00:00',NULL,NULL),(10,3,'Welcome Party','A simple welcome party','2023-06-09 00:00:00',NULL,NULL),(11,5,'Welcome Party','A simple welcome party','2023-06-09 00:00:00',NULL,NULL),(12,6,'Welcome Party','A simple welcome party','2023-06-07 00:00:00',NULL,NULL),(13,2,'Welcome Party','A simple welcome party','2023-06-10 00:00:00',NULL,NULL),(14,3,'Welcome Party','A simple welcome party','2023-06-10 00:00:00',NULL,NULL);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `text` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_clubs`
--

DROP TABLE IF EXISTS `user_clubs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_clubs` (
  `user_id` int NOT NULL,
  `club_id` int NOT NULL,
  `is_manager` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `notify_updates` tinyint(1) DEFAULT '0',
  `notify_events` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`user_id`,`club_id`),
  KEY `user_id` (`user_id`),
  KEY `club_id` (`club_id`),
  CONSTRAINT `user_clubs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `user_clubs_ibfk_2` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_clubs`
--

LOCK TABLES `user_clubs` WRITE;
/*!40000 ALTER TABLE `user_clubs` DISABLE KEYS */;
INSERT INTO `user_clubs` VALUES (2,2,1,NULL,NULL,0,0),(2,3,1,NULL,NULL,0,0),(2,4,1,NULL,NULL,0,0),(2,5,1,NULL,NULL,0,0),(2,6,1,NULL,NULL,0,0);
/*!40000 ALTER TABLE `user_clubs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_event_rsvps`
--

DROP TABLE IF EXISTS `user_event_rsvps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_event_rsvps` (
  `user_id` int DEFAULT NULL,
  `event_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  KEY `user_id` (`user_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `user_event_rsvps_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `user_event_rsvps_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_event_rsvps`
--

LOCK TABLES `user_event_rsvps` WRITE;
/*!40000 ALTER TABLE `user_event_rsvps` DISABLE KEYS */;
INSERT INTO `user_event_rsvps` VALUES (2,2,NULL,NULL),(2,1,NULL,NULL),(2,3,NULL,NULL),(2,5,NULL,NULL),(2,4,NULL,NULL);
/*!40000 ALTER TABLE `user_event_rsvps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `is_admin` tinyint(1) DEFAULT NULL,
  `student_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin1',NULL,NULL,NULL,NULL,'admin@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$S8h8DAKdJEi7jdxpXPA+XA$CfB6t0+vS+uQEoSfVTfJqkmJU8srj1w1Iol4ifWDVdA','2023-05-21 03:49:30','2023-05-21 03:49:30',1,NULL),(2,'test1',NULL,NULL,'test','test','test@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$S8h8DAKdJEi7jdxpXPA+XA$CfB6t0+vS+uQEoSfVTfJqkmJU8srj1w1Iol4ifWDVdA','2023-05-21 03:49:30','2023-05-21 03:49:30',0,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-08  8:19:24
