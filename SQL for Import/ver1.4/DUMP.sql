CREATE DATABASE  IF NOT EXISTS `team4` /*!40100 DEFAULT CHARACTER SET utf8 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `team4`;
-- MySQL dump 10.13  Distrib 8.0.28, for macos11 (x86_64)
--
-- Host: localhost    Database: team4
-- ------------------------------------------------------
-- Server version	8.0.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `apply_admin`
--

DROP TABLE IF EXISTS `apply_admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `apply_admin` (
  `apply_admin_id` int unsigned NOT NULL AUTO_INCREMENT,
  `applicant_id` int unsigned NOT NULL,
  `project_id` int unsigned NOT NULL,
  `apply_dept_id` int unsigned NOT NULL,
  `apply_status` enum('NEW','ACC','REJ') NOT NULL DEFAULT 'NEW',
  `insert_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`apply_admin_id`),
  KEY `fk_applicant_id_idx` (`applicant_id`),
  KEY `fk_project_id_idx` (`project_id`),
  CONSTRAINT `fk_admin_project_id` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`),
  CONSTRAINT `fk_applicant_id` FOREIGN KEY (`applicant_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apply_admin`
--

LOCK TABLES `apply_admin` WRITE;
/*!40000 ALTER TABLE `apply_admin` DISABLE KEYS */;
INSERT INTO `apply_admin` VALUES (1,1,1,1,'NEW','2022-06-17 00:00:00'),(2,2,1,1,'NEW','2022-06-17 00:00:00'),(3,4,1,1,'NEW','2022-06-17 00:00:00'),(4,5,1,1,'NEW','2022-06-17 00:00:00'),(5,6,1,1,'NEW','2022-06-17 00:00:00'),(6,7,1,1,'NEW','2022-06-17 00:00:00'),(7,8,1,1,'NEW','2022-06-17 00:00:00'),(8,8,1,1,'ACC','2022-06-19 00:00:00'),(9,9,1,2,'NEW','2022-06-17 00:00:00'),(10,10,1,2,'NEW','2022-06-17 00:00:00'),(11,10,1,2,'ACC','2022-06-19 00:00:00'),(12,11,1,2,'NEW','2022-06-17 00:00:00'),(13,1,4,5,'NEW','2022-01-19 03:00:00'),(14,2,4,5,'NEW','2022-01-19 04:00:00'),(15,3,4,5,'NEW','2022-01-19 05:00:00'),(16,9,4,5,'NEW','2022-01-19 07:00:00'),(17,3,4,5,'ACC','2022-01-21 07:00:00'),(18,1,4,5,'REJ','2022-01-21 08:00:00'),(19,2,4,5,'REJ','2022-01-21 09:00:00'),(20,9,4,5,'REJ','2022-01-21 10:00:00'),(21,6,4,6,'NEW','2022-01-19 10:00:00'),(22,7,4,6,'NEW','2022-01-19 10:00:00'),(23,8,4,6,'NEW','2022-01-19 10:00:00'),(24,6,4,6,'ACC','2022-01-22 10:00:00'),(25,7,4,6,'ACC','2022-01-22 10:00:00'),(26,8,4,6,'REJ','2022-01-22 10:00:00');
/*!40000 ALTER TABLE `apply_admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `apply_dept`
--

DROP TABLE IF EXISTS `apply_dept`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `apply_dept` (
  `apply_dept_id` int unsigned NOT NULL AUTO_INCREMENT,
  `project_id` int unsigned NOT NULL,
  `to` int unsigned NOT NULL,
  `apply_dept_code` varchar(10) NOT NULL,
  PRIMARY KEY (`apply_dept_id`),
  KEY `fk_dept_project_id_idx` (`project_id`),
  CONSTRAINT `fk_dept_project_id` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COMMENT='지원 분야 테이블. 모집 생성시  프로젝트에 맵핑될  지원 분야 및 TO 값들이 INSERT 된다';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apply_dept`
--

LOCK TABLES `apply_dept` WRITE;
/*!40000 ALTER TABLE `apply_dept` DISABLE KEYS */;
INSERT INTO `apply_dept` VALUES (1,1,2,'BE'),(2,1,2,'FE'),(3,2,1,'BE'),(4,2,2,'FE'),(5,4,1,'BE'),(6,4,2,'FE');
/*!40000 ALTER TABLE `apply_dept` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `like_count`
--

DROP TABLE IF EXISTS `like_count`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `like_count` (
  `like_count_id` int NOT NULL AUTO_INCREMENT,
  `post_category` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `post_id` int NOT NULL,
  `like_userid` int NOT NULL,
  `like_time` datetime NOT NULL,
  `like_yn` enum('Y','N') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`like_count_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `like_count`
--

LOCK TABLES `like_count` WRITE;
/*!40000 ALTER TABLE `like_count` DISABLE KEYS */;
/*!40000 ALTER TABLE `like_count` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mentor_info`
--

DROP TABLE IF EXISTS `mentor_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mentor_info` (
  `mentor_info_id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `mentoring_title` varchar(45) NOT NULL,
  `mentoring_intro` varchar(500) NOT NULL,
  `mentor_email` varchar(30) NOT NULL,
  `mentoring_price` int unsigned NOT NULL,
  `mentoring_time` int NOT NULL,
  `mentoring_dept_code` varchar(200) NOT NULL COMMENT '다중 값 받는 부분 /  comma 로 파싱 예정  / 200자로 통일함 ',
  `mentoring_availability` enum('Y','N') NOT NULL DEFAULT 'Y',
  `mentor_approval` enum('Y','N') NOT NULL DEFAULT 'Y',
  `mentor_register_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`mentor_info_id`),
  KEY `fk_mentor_user_id_idx` (`user_id`),
  CONSTRAINT `fk_mentor_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mentor_info`
--

LOCK TABLES `mentor_info` WRITE;
/*!40000 ALTER TABLE `mentor_info` DISABLE KEYS */;
INSERT INTO `mentor_info` VALUES (1,2,'NodeJS프로젝트 멘토링 해요','멘토소개글멘토소개글멘토소개글멘토소개글','username2@gmail.com',20000,2,'FE,BE','Y','Y','2022-06-15 15:47:09'),(2,18,'자바백엔드 멘토링 해요','멘토소개글멘토소개글멘토소개글멘토소개글','mentoryong2@gmail.com',40000,3,'BE','Y','Y','2022-01-15 15:47:09'),(3,10,'vue멘토링 해요 ','멘토소개글멘토소개글멘토소개글멘토소개글','mentor33333@gmail.com',18000,2,'FE','Y','Y','2022-03-15 15:47:09'),(4,19,'javascript 멘토링합니다','멘토소개글멘토소개글멘토소개글멘토소개글','mentor44444@gmail.com',25000,3,'FE','Y','Y','2022-04-15 15:47:09');
/*!40000 ALTER TABLE `mentor_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mentor_reply`
--

DROP TABLE IF EXISTS `mentor_reply`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mentor_reply` (
  `mentor_reply_id` int unsigned NOT NULL AUTO_INCREMENT,
  `mentor_info_id` int unsigned NOT NULL,
  `reply_writer_id` int unsigned NOT NULL,
  `comment` varchar(2000) NOT NULL COMMENT '댓글은 2000자 통일 ',
  `secret_yn` enum('Y','N') NOT NULL DEFAULT 'N',
  `parent_id` int DEFAULT NULL,
  `target_id` int DEFAULT NULL,
  `sequence` int DEFAULT NULL,
  `del_yn` enum('Y','N') NOT NULL DEFAULT 'N',
  `insert_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`mentor_reply_id`),
  KEY `fk_reply_info_id_idx` (`mentor_info_id`),
  KEY `fk_writer_id_idx` (`reply_writer_id`),
  CONSTRAINT `fk_reply_info_id` FOREIGN KEY (`mentor_info_id`) REFERENCES `mentor_info` (`mentor_info_id`),
  CONSTRAINT `fk_writer_id` FOREIGN KEY (`reply_writer_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mentor_reply`
--

LOCK TABLES `mentor_reply` WRITE;
/*!40000 ALTER TABLE `mentor_reply` DISABLE KEYS */;
/*!40000 ALTER TABLE `mentor_reply` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mentoring`
--

DROP TABLE IF EXISTS `mentoring`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mentoring` (
  `mentoring_id` int unsigned NOT NULL AUTO_INCREMENT,
  `mentor_info_id` int unsigned NOT NULL,
  `req_user` int unsigned NOT NULL,
  `project_id` int unsigned NOT NULL,
  `status_code` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '멘토''링'' 의 상태값을 담은 컬럼. update 수행됨',
  `req_dept_code` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `req_desc` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `req_user_contact` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `total_count` int unsigned NOT NULL,
  `week_count` int unsigned NOT NULL,
  `created_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`mentoring_id`),
  KEY `fk_mentor_info_id_idx` (`mentor_info_id`),
  KEY `fk_req_user_idx` (`req_user`),
  KEY `fk_project_id_idx` (`project_id`),
  KEY `fk_metoring_project_id_idx` (`project_id`),
  CONSTRAINT `fk_mentor_info_id` FOREIGN KEY (`mentor_info_id`) REFERENCES `mentor_info` (`mentor_info_id`),
  CONSTRAINT `fk_metoring_project_id` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`),
  CONSTRAINT `fk_req_user` FOREIGN KEY (`req_user`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mentoring`
--

LOCK TABLES `mentoring` WRITE;
/*!40000 ALTER TABLE `mentoring` DISABLE KEYS */;
INSERT INTO `mentoring` VALUES (1,2,3,1,'FIN','BE','2222멘토링요오오오오오오오오오청글멘토링요오오오오오오오오오청글','user1@gmail.com',5,1,'2022-07-15 15:47:09'),(2,1,3,1,'ING','BE','11111멘토링요오오오오오오오오오청글멘토링요오오오오오오오오오청글','user1@gmail.com',3,1,'2022-06-15 15:47:09'),(3,4,3,1,'REJ','FE','4444멘토링요오오오오오오오오오청글멘토링요오오오오오오오오오청글','user2@gmail.com',4,1,'2022-05-15 15:47:09'),(4,3,3,1,'FIN','FE','33333멘토링요오오오오오오오오오청글멘토링요오오오오오오오오오청글','user3@gmail.com',2,1,'2022-04-15 15:47:09');
/*!40000 ALTER TABLE `mentoring` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mentoring_admin`
--

DROP TABLE IF EXISTS `mentoring_admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mentoring_admin` (
  `mentoring_admin_id` int unsigned NOT NULL AUTO_INCREMENT,
  `mentoring_id` int unsigned NOT NULL,
  `mentoring_status` enum('NEW','REJ','ING','FIN','CMP') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'NEW' COMMENT '신청- 승인(진행중)- 완료 - 종결(종료)  또는 신청-반려 흐름으로 갈라진다',
  `created_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`mentoring_admin_id`,`mentoring_status`),
  KEY `metoring_id_idx` (`mentoring_id`),
  CONSTRAINT `metoring_id` FOREIGN KEY (`mentoring_id`) REFERENCES `mentoring` (`mentoring_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mentoring_admin`
--

LOCK TABLES `mentoring_admin` WRITE;
/*!40000 ALTER TABLE `mentoring_admin` DISABLE KEYS */;
INSERT INTO `mentoring_admin` VALUES (11,2,'NEW','2022-06-19 00:00:00'),(12,1,'NEW','2022-06-19 00:00:00'),(13,4,'NEW','2022-06-18 00:00:00'),(14,3,'NEW','2022-06-17 00:00:00'),(15,2,'ACC','2022-06-21 00:00:00'),(16,2,'ING','2022-06-22 00:00:00'),(17,1,'ACC','2022-06-23 00:00:00'),(18,1,'ING','2022-06-24 00:00:00'),(19,4,'REJ','2022-06-25 00:00:00'),(20,3,'ACC','2022-06-26 00:00:00'),(21,3,'ING','2022-06-27 00:00:00'),(22,3,'FIN','2022-07-05 00:00:00'),(23,2,'FIN','2022-06-30 00:00:00');
/*!40000 ALTER TABLE `mentoring_admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project`
--

DROP TABLE IF EXISTS `project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project` (
  `project_id` int unsigned NOT NULL AUTO_INCREMENT,
  `leader_user` int unsigned NOT NULL,
  `title` varchar(45) NOT NULL,
  `exp_start_date` datetime NOT NULL,
  `exp_period` int unsigned NOT NULL,
  `progress_method` enum('ON','OFF') NOT NULL,
  `status_code` varchar(10) NOT NULL COMMENT '프로젝트 상태 이력값에 새 상태 INSERT 시마다 UPDATE 되는 컬럼 ',
  `main_area_code` varchar(10) DEFAULT NULL,
  `sub_area_code` varchar(10) DEFAULT NULL,
  `stack_code` varchar(200) NOT NULL,
  `project_contact` varchar(200) NOT NULL,
  `project_desc` varchar(2000) NOT NULL,
  `warranty` int unsigned NOT NULL,
  `meeting_url` varchar(200) DEFAULT NULL,
  `created_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`project_id`),
  KEY `fk_leader_user_idx` (`leader_user`),
  CONSTRAINT `fk_leader_user` FOREIGN KEY (`leader_user`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project`
--

LOCK TABLES `project` WRITE;
/*!40000 ALTER TABLE `project` DISABLE KEYS */;
INSERT INTO `project` VALUES (1,3,'자바스크립트 따라잡기','2022-06-19 00:00:00',4,'OFF','REC','M09','S01','T01,R01','test1Leader@google.com','test프로젝트설명test프로젝트설명test프로젝트설명test프로젝트설명test프로젝트설명test프로젝트설명test프로젝트설명',30000,'https://discord.gg/jRqYDKNH','2022-06-17 00:00:00'),(2,3,'파이썬으로 만드는 TODO LIST','2022-02-19 00:00:00',3,'OFF','FIN','M08','S125','J02,R01','test2Leader@google.com','기종료기종료기종료test프로젝트설명test프로젝트설명test프로젝트설명test프로젝트설명test프로젝트설명test프로젝트설명test프로젝트설명',20000,'https://discord.gg/jRqYDKNH','2022-01-17 00:00:00'),(3,3,'자바로 게임만들기','2022-02-19 00:00:00',3,'OFF','FIN','M08','S125','T01,R01','test3Leader@google.com','기종료기종료기종료test프로젝트설명test프로젝트설명test프로젝트설명test프로젝트설명test프로젝트설명test프로젝트설명test프로젝트설명',40000,'https://discord.gg/jRqYDKNH','2022-01-25 00:00:00'),(4,10,'파이썬 프로젝트','2022-01-19 00:00:00',2,'ON','FIN',NULL,NULL,'P01','test4Leader@google.com','기종료기종료기종료test프로젝트설명test프로젝트설명test프로젝트설명test프로젝트설명test프로젝트설명test프로젝트설명test프로젝트설명',60000,'https://discord.gg/jRqYDKNH','2022-01-15 00:00:00'),  (5,2,'포트폴리오 2달 끝내기','2022-07-04 00:00:00',2,'ON','FIN',NULL,NULL,'P01','test5Leader@google.com','Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',60000,'https://discord.gg/jRqYDKNH','2022-06-05 00:00:00'),
  (6,1,'영화 추천 서비스','2022-07-05 00:00:00',2,'ON','FIN',NULL,NULL,'P01','test6Leader@google.com','Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',60000,'https://discord.gg/jRqYDKNH','2022-06-06 00:00:00'),
  (7,5,'공용주차장 왓칭 서비스','2022-07-05 00:00:00',2,'ON','REC',NULL,NULL,'P01','test7Leader@google.com','Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',60000,'https://discord.gg/jRqYDKNH','2022-06-07 00:00:00'),
  (8,7,'최신 IT 동향 메일링 서비스','2022-07-06 00:00:00',2,'ON','FIN',NULL,NULL,'P01','test8Leader@google.com','Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',60000,'https://discord.gg/jRqYDKNH','2022-06-08 00:00:00'),
  (9,7,'하하하하하하하하 웃어요','2022-07-07 00:00:00',2,'ON','REC',NULL,NULL,'P01','test9Leader@google.com','Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',60000,'https://discord.gg/jRqYDKNH','2022-06-09 00:00:00');/*!40000 ALTER TABLE `project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_reply`
--

DROP TABLE IF EXISTS `project_reply`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_reply` (
  `project_reply_id` int unsigned NOT NULL AUTO_INCREMENT,
  `project_id` int unsigned NOT NULL,
  `writer_id` int unsigned NOT NULL,
  `comment` varchar(2000) NOT NULL,
  `secret_yn` enum('Y','N') DEFAULT NULL,
  `target_id` int DEFAULT NULL COMMENT '대댓글일 경우 그 상위(타겟) ID, 네이버 카페처럼 이중 대댓글 구현시 @작성자 보여주기 위해 필요',
  `sequence` int DEFAULT NULL,
  `del_yn` enum('Y','N') DEFAULT NULL,
  `created_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `parent_id` int DEFAULT NULL COMMENT '최상위 parent 댓글 ID',
  PRIMARY KEY (`project_reply_id`),
  KEY `fk_reply_project_id_idx` (`project_id`),
  KEY `fk_writer_id_idx` (`writer_id`),
  KEY `fk_reply_writer_id_idx` (`writer_id`),
  CONSTRAINT `fk_reply_project_id` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`),
  CONSTRAINT `fk_reply_writer_id` FOREIGN KEY (`writer_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_reply`
--

LOCK TABLES `project_reply` WRITE;
/*!40000 ALTER TABLE `project_reply` DISABLE KEYS */;
INSERT INTO `project_reply` VALUES (5,1,1,'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eusem tempor, varius quam at, luctus dui. Mauris magna metus,dapibus nec turpis vel, semper malesuada ante. Idac bibendumscelerisque non non purus.',NULL,NULL,1,NULL,'2022-07-09 18:34:39',NULL),(6,1,1,'댓글 테스트 데이터',NULL,NULL,1,NULL,'2022-07-09 18:34:39',NULL);
/*!40000 ALTER TABLE `project_reply` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_status`
--

DROP TABLE IF EXISTS `project_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_status` (
  `project_status_id` int unsigned NOT NULL AUTO_INCREMENT,
  `project_id` int unsigned NOT NULL,
  `project_status` enum('REC','ING','ADD','FIN') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'REC',
  `changer` int unsigned NOT NULL,
  `created_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`project_status_id`),
  KEY `fk_project_id_status_idx` (`project_id`),
  KEY `fk_changer_idx` (`changer`),
  CONSTRAINT `fk_changer` FOREIGN KEY (`changer`) REFERENCES `user` (`user_id`),
  CONSTRAINT `fk_project_id_status` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_status`
--

LOCK TABLES `project_status` WRITE;
/*!40000 ALTER TABLE `project_status` DISABLE KEYS */;
/*!40000 ALTER TABLE `project_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rate`
--

DROP TABLE IF EXISTS `rate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rate` (
  `rate_id` int unsigned NOT NULL AUTO_INCREMENT,
  `rate_user_id` int unsigned NOT NULL,
  `rated_user_id` int unsigned NOT NULL,
  `rate` float unsigned NOT NULL,
  `rate_target` enum('USER','MENTOR') NOT NULL DEFAULT 'USER',
  `rate_comment` varchar(200) NOT NULL,
  `project_id` int unsigned NOT NULL,
  `rate_register_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`rate_id`),
  KEY `fk_user_id_idx` (`rate_user_id`),
  KEY `fk_rated_user_Id_idx` (`rated_user_id`),
  KEY `fk_project_id_idx` (`project_id`),
  CONSTRAINT `fk_project_id` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`),
  CONSTRAINT `fk_rate_user_id` FOREIGN KEY (`rate_user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `fk_rated_user_Id` FOREIGN KEY (`rated_user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rate`
--

LOCK TABLES `rate` WRITE;
/*!40000 ALTER TABLE `rate` DISABLE KEYS */;
INSERT INTO `rate` VALUES (1,10,6,4,'USER','평가메시지1',4,'2022-04-19 12:40:20'),(2,7,6,4,'USER','평가메시지2',4,'2022-04-19 12:40:20'),(3,3,6,3,'USER','평가메시지3',4,'2022-04-19 12:40:20'),(4,6,10,5,'USER','평가메시지4',4,'2022-04-19 12:40:20'),(5,7,10,5,'USER','평가메시지5',4,'2022-04-19 12:40:20'),(6,3,10,4,'USER','평가메시지6',4,'2022-04-19 12:40:20'),(7,6,3,3,'USER','평가메시지7',4,'2022-04-19 12:40:20'),(8,7,3,4,'USER','평가메시지8',4,'2022-04-19 12:40:20'),(9,10,3,5,'USER','평가메시지9',4,'2022-04-19 12:40:20'),(10,3,7,5,'USER','평가메시지10',4,'2022-04-19 12:40:20'),(11,6,7,5,'USER','평가메시지11',4,'2022-04-19 12:40:20'),(12,10,7,4,'USER','평가메시지12',4,'2022-04-19 12:40:20');
/*!40000 ALTER TABLE `rate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ref_url`
--

DROP TABLE IF EXISTS `ref_url`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ref_url` (
  `ref_url_id` int NOT NULL AUTO_INCREMENT,
  `post_category` varchar(10) NOT NULL COMMENT '( 유저 소셜정보 / 프로젝트 모집 /  팀개요 /  멘토정보 참고링크 /  )  유형코드 입력받음 ',
  `post_id` int NOT NULL COMMENT '여러 테이블과 동시에 연결되기에 포린키 붙을 수 X ',
  `url_title` varchar(20) NOT NULL,
  `url_address` varchar(200) NOT NULL,
  PRIMARY KEY (`ref_url_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8 COMMENT='참고링크 모두 모여있는 테이블. ( 유저 소셜정보 / 프로젝트 모집 /  팀개요 /  멘토정보 참고링크 /  ) ';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ref_url`
--

LOCK TABLES `ref_url` WRITE;
/*!40000 ALTER TABLE `ref_url` DISABLE KEYS */;
INSERT INTO `ref_url` VALUES (1,'RCB',1,'링크1','www.naver.com'),(2,'RCB',2,'링크2','www.naver.com'),(3,'RCB',3,'링크3','www.naver.com'),(4,'RCB',4,'링크4','www.naver.com'),(5,'MTB',1,'멘토링크1','www.naver.com'),(6,'MTB',1,'멘토링크2','www.naver.com'),(7,'MTB',2,'멘토링크3','www.naver.com'),(8,'MTB',2,'멘토링크4','www.naver.com'),(9,'MTB',2,'멘토링크5','www.naver.com'),(10,'USB',1,'유저소셜1','www.naver.com'),(11,'USB',2,'유저소셜2','www.naver.com'),(12,'USB',3,'유저소셜3','www.naver.com'),(13,'USB',4,'유저소셜4','www.naver.com'),(14,'USB',5,'유저소셜5','www.naver.com'),(15,'USB',6,'유저소셜6','www.naver.com'),(16,'USB',6,'유저소셜62','www.naver.com'),(17,'USB',2,'유저소셜22','www.naver.com'),(18,'USB',3,'유저소셜32','www.naver.com'),(19,'RVB',1,'후기참고링1','www.naver.com'),(20,'RVB',2,'후기참고링2','www.naver.com'),(21,'RVB',3,'후기참고링3','www.naver.com'),(22,'RVB',4,'후기참고링4','www.naver.com'),(23,'RVB',5,'후기참고링5','www.naver.com'),(24,'TMB',1,'팀개요링크1','www.naver.com'),(25,'TMB',1,'팀개요링크12','www.naver.com'),(26,'TMB',1,'팀개요링크13','www.naver.com'),(27,'TMB',2,'팀개요링크21','www.naver.com'),(28,'TMB',2,'팀개요링크22','www.naver.com'),(29,'TMB',3,'팀개요링크3','www.naver.com'),(30,'TMB',4,'팀개요링크4','www.naver.com');
/*!40000 ALTER TABLE `ref_url` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `review_id` int unsigned NOT NULL AUTO_INCREMENT,
  `writer_id` int unsigned NOT NULL,
  `title` varchar(20) NOT NULL,
  `thumbnail_image` varchar(200) NOT NULL,
  `desc` varchar(2000) NOT NULL COMMENT '후기글은 이미지 포함이고 글이 커질수있어서 글자수 2000',
  `project_id` int unsigned NOT NULL,
  `del_yn` enum('Y','N') DEFAULT NULL,
  `created_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`review_id`),
  KEY `fk_review_writer_idx` (`writer_id`),
  KEY `fk_review_project_id_idx` (`project_id`),
  CONSTRAINT `fk_review_project_id` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`),
  CONSTRAINT `fk_review_writer` FOREIGN KEY (`writer_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
INSERT INTO `review` VALUES (1,10,'프젝4후기 111','img1.jpg','후기글 내용후기글 내용후기글 내용후기글 내용후기글 내용후기글 내용후기글 내용후기글 내용후기글 내용후기글 내용후기글 내용후기글 내용',4,'N','2022-04-19 12:40:20'),(2,3,'프젝4후기2','img1.jpg','후기글 내용후기글 내용후기글 내용후기글 내용후기글 내용후기글 내용후기글 내용후기글 내용',4,'N','2022-04-19 12:40:20'),(3,6,'프젝4후기3','img1.jpg','후기글 내용후기글 내용후기글 내용후기글 내용후기글 내용후기글 내용후기글 내용후기글 내용후기글 내용후기글 내용',4,'N','2022-04-19 12:40:20'),(4,7,'프젝4후기4','img1.jpg','후기글 내용후기글 내용후기글 내용후기글 내용후기글 내용후기글 내용후기글 내용후기글 내용',4,'N','2022-04-19 12:40:20');
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review_reply`
--

DROP TABLE IF EXISTS `review_reply`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review_reply` (
  `review_reply_id` int unsigned NOT NULL AUTO_INCREMENT,
  `review_id` int unsigned NOT NULL,
  `writer_id` int unsigned NOT NULL,
  `comment` varchar(2000) NOT NULL,
  `secret_yn` enum('Y','N') DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  `target_id` int DEFAULT NULL COMMENT 'target 댓글은 있을수도 없을수도 있기에   Not Null 사용불가 ',
  `sequence` int DEFAULT NULL,
  `del_yn` enum('Y','N') DEFAULT NULL,
  `created_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`review_reply_id`),
  KEY `fk_review_reply_id_idx` (`review_id`),
  KEY `fk_review_writer_id_idx` (`writer_id`),
  CONSTRAINT `fk_review_reply_id` FOREIGN KEY (`review_id`) REFERENCES `review` (`review_id`),
  CONSTRAINT `fk_review_writer_id` FOREIGN KEY (`writer_id`) REFERENCES `review` (`review_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review_reply`
--

LOCK TABLES `review_reply` WRITE;
/*!40000 ALTER TABLE `review_reply` DISABLE KEYS */;
/*!40000 ALTER TABLE `review_reply` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sb_class_code`
--

DROP TABLE IF EXISTS `sb_class_code`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sb_class_code` (
  `code_class_id` int unsigned NOT NULL AUTO_INCREMENT,
  `code_class_name` varchar(45) NOT NULL,
  `code_class_desc` varchar(45) NOT NULL COMMENT '코드 클래스설명 ( 뭔 분류인지 정보 담는 컬럼 ) ',
  PRIMARY KEY (`code_class_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sb_class_code`
--

LOCK TABLES `sb_class_code` WRITE;
/*!40000 ALTER TABLE `sb_class_code` DISABLE KEYS */;
INSERT INTO `sb_class_code` VALUES (1,'DM001','분야'),(2,'ST001','언어스택'),(3,'MA001','대지역'),(4,'SA001','서브지역'),(5,'MS001','멘토링단계'),(6,'TS001','팀상태분류'),(7,'AS001','지원상태분류'),(8,'BT001','글종류');
/*!40000 ALTER TABLE `sb_class_code` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sb_code_data`
--

DROP TABLE IF EXISTS `sb_code_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sb_code_data` (
  `sb_code_data_id` int unsigned NOT NULL AUTO_INCREMENT,
  `code_class_id` int unsigned NOT NULL,
  `code_data_name` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `code_data_desc` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `attribute1` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '속성값1  ( NULLABLE ) ',
  PRIMARY KEY (`sb_code_data_id`),
  KEY `code_class_id_idx` (`code_class_id`),
  CONSTRAINT `code_class_id` FOREIGN KEY (`code_class_id`) REFERENCES `sb_class_code` (`code_class_id`)
) ENGINE=InnoDB AUTO_INCREMENT=347 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sb_code_data`
--

LOCK TABLES `sb_code_data` WRITE;
/*!40000 ALTER TABLE `sb_code_data` DISABLE KEYS */;
INSERT INTO `sb_code_data` VALUES (1,1,'FE','프론트엔드',NULL),(2,1,'BE','백엔드',NULL),(3,1,'FS','풀스택',NULL),(4,1,'DE','디자인',NULL),(5,1,'UU','UI/UX',NULL),(6,1,'PL','기획',NULL),(7,1,'PM','PM',NULL),(8,1,'DB','데이터베이스',NULL),(9,1,'AL','알고리즘,자료구조',NULL),(10,1,'PB','퍼블리싱',NULL),(11,1,'DO','데브옵스',NULL),(12,1,'DA','데이터 사이언스',NULL),(46,2,'T01','typescript',NULL),(47,2,'R01','react',NULL),(48,2,'V01','vue',NULL),(49,2,'J02','java',NULL),(50,2,'G01','go',NULL),(51,2,'P01','python',NULL),(52,2,'R02','ruby',NULL),(53,2,'S01','swift',NULL),(54,2,'C01','C',NULL),(55,2,'C02','C++',NULL),(56,2,'C03','C#',NULL),(57,2,'J01','javascript',NULL),(58,3,'M01','강원도',NULL),(59,3,'M02','경기도',NULL),(60,3,'M03','경상남도',NULL),(61,3,'M04','경상북도',NULL),(62,3,'M05','광주광역시',NULL),(63,3,'M06','대구광역시',NULL),(64,3,'M07','대전광역시',NULL),(65,3,'M08','부산광역시',NULL),(66,3,'M09','서울특별시',NULL),(67,3,'M10','울산광역시',NULL),(68,3,'M11','세종특별자치시',NULL),(69,3,'M12','인천광역시',NULL),(70,3,'M13','전라남도',NULL),(71,3,'M14','전라북도',NULL),(72,3,'M15','제주특별자치시',NULL),(73,3,'M16','충청남도',NULL),(74,3,'M17','충청북도',NULL),(75,5,'NEW','신청중',NULL),(76,5,'ACC','승인',NULL),(77,5,'REJ','반려',NULL),(78,5,'ING','멘토링중',NULL),(79,5,'FIN','멘토링완료',NULL),(80,6,'REC','모집중',NULL),(81,6,'ING','모집완료',NULL),(82,6,'ADD','추가모집',NULL),(83,6,'FIN','활동종료',NULL),(84,7,'NEW','신규지원',NULL),(85,7,'ACC','승인',NULL),(86,7,'REJ','거절',NULL),(87,7,'RAP','추가모집지원',NULL),(88,8,'RCB','모집글',NULL),(89,8,'MTB','멘토정보글',NULL),(90,8,'USB','유저정보',NULL),(91,8,'RVB','후기글',NULL),(92,8,'TMB','팀개요글',NULL),(93,4,'S001','정선군','M01'),(94,4,'S002','삼척시','M01'),(95,4,'S003','홍천군','M01'),(96,4,'S004','속초시','M01'),(97,4,'S005','양양군','M01'),(98,4,'S006','양구군','M01'),(99,4,'S007','고성군','M01'),(100,4,'S008','평창군','M01'),(101,4,'S009','춘천시','M01'),(102,4,'S010','강릉시','M01'),(103,4,'S011','인제군','M01'),(104,4,'S012','동해시','M01'),(105,4,'S013','횡성군','M01'),(106,4,'S014','원주시','M01'),(107,4,'S015','화천군','M01'),(108,4,'S016','태백시','M01'),(109,4,'S017','영월군','M01'),(110,4,'S018','철원군','M01'),(111,4,'S019','군포시','M02'),(112,4,'S020','시흥시','M02'),(113,4,'S021','이천시','M02'),(114,4,'S022','구리시','M02'),(115,4,'S023','수원시','M02'),(116,4,'S024','연천군','M02'),(117,4,'S025','안성시','M02'),(118,4,'S026','안산시','M02'),(119,4,'S027','가평군','M02'),(120,4,'S028','성남시','M02'),(121,4,'S029','화성시','M02'),(122,4,'S030','광명시','M02'),(123,4,'S031','평택시','M02'),(124,4,'S032','고양시','M02'),(125,4,'S033','수원시','M02'),(126,4,'S034','오산시','M02'),(127,4,'S035','의왕시','M02'),(128,4,'S036','용인시','M02'),(129,4,'S037','과천시','M02'),(130,4,'S038','양평군','M02'),(131,4,'S039','파주시','M02'),(132,4,'S040','동두천시','M02'),(133,4,'S041','여주시','M02'),(134,4,'S042','고양시','M02'),(135,4,'S043','안산시','M02'),(136,4,'S044','안양시','M02'),(137,4,'S045','성남시','M02'),(138,4,'S046','광주시','M02'),(139,4,'S047','의정부','M02'),(140,4,'S048','용인시','M02'),(141,4,'S049','포천시','M02'),(142,4,'S050','남양주','M02'),(143,4,'S051','안양시','M02'),(144,4,'S052','성남시','M02'),(145,4,'S053','용인시','M02'),(146,4,'S054','수원시','M02'),(147,4,'S055','수원시','M02'),(148,4,'S056','하남시','M02'),(149,4,'S057','고양시','M02'),(150,4,'S058','부천시','M02'),(151,4,'S059','김포시','M02'),(152,4,'S060','양주시','M02'),(153,4,'S061','김해시','M03'),(154,4,'S062','창원시','M03'),(155,4,'S063','하동군','M03'),(156,4,'S064','거창군','M03'),(157,4,'S065','창원시','M03'),(158,4,'S066','사천시','M03'),(159,4,'S067','함양군','M03'),(160,4,'S068','창원시','M03'),(161,4,'S069','남해군','M03'),(162,4,'S070','고성군','M03'),(163,4,'S071','창원시','M03'),(164,4,'S072','산청군','M03'),(165,4,'S073','통영시','M03'),(166,4,'S074','함안군','M03'),(167,4,'S075','진주시','M03'),(168,4,'S076','거제시','M03'),(169,4,'S077','양산시','M03'),(170,4,'S078','합천군','M03'),(171,4,'S079','의령군','M03'),(172,4,'S080','창녕군','M03'),(173,4,'S081','창원시','M03'),(174,4,'S082','밀양시','M03'),(175,4,'S083','고령군','M04'),(176,4,'S084','영양군','M04'),(177,4,'S085','칠곡군','M04'),(178,4,'S086','영천시','M04'),(179,4,'S087','영덕군','M04'),(180,4,'S088','성주군','M04'),(181,4,'S089','봉화군','M04'),(182,4,'S090','청송군','M04'),(183,4,'S091','군위군','M04'),(184,4,'S092','경주시','M04'),(185,4,'S093','의성군','M04'),(186,4,'S094','김천시','M04'),(187,4,'S095','포항시','M04'),(188,4,'S096','경산시','M04'),(189,4,'S097','울릉군','M04'),(190,4,'S098','구미시','M04'),(191,4,'S099','포항시','M04'),(192,4,'S100','안동시','M04'),(193,4,'S101','울진군','M04'),(194,4,'S102','청도군','M04'),(195,4,'S103','문경시','M04'),(196,4,'S104','상주시','M04'),(197,4,'S105','예천군','M04'),(198,4,'S106','영주시','M04'),(199,4,'S107','광산구','M05'),(200,4,'S108','남구','M05'),(201,4,'S109','서구','M05'),(202,4,'S110','북구','M05'),(203,4,'S111','동구','M05'),(204,4,'S112','달서구','M06'),(205,4,'S113','남구','M06'),(206,4,'S114','수성','M06'),(207,4,'S115','중구','M06'),(208,4,'S116','서구','M06'),(209,4,'S117','북구','M06'),(210,4,'S118','달성군','M06'),(211,4,'S119','동구','M06'),(212,4,'S120','중구','M07'),(213,4,'S121','서구','M07'),(214,4,'S122','대덕구','M07'),(215,4,'S123','유성구','M07'),(216,4,'S124','동구','M07'),(217,4,'S125','남구','M08'),(218,4,'S126','영도구','M08'),(219,4,'S127','중구','M08'),(220,4,'S128','금정구','M08'),(221,4,'S129','서구','M08'),(222,4,'S130','수영구','M08'),(223,4,'S131','북구','M08'),(224,4,'S132','해운대구','M08'),(225,4,'S133','사상구','M08'),(226,4,'S134','강서구','M08'),(227,4,'S135','부산진구','M08'),(228,4,'S136','동래구','M08'),(229,4,'S137','동구','M08'),(230,4,'S138','기장군','M08'),(231,4,'S139','사하구','M08'),(232,4,'S140','연제구','M08'),(233,4,'S141','송파구','M09'),(234,4,'S142','동작구','M09'),(235,4,'S143','서대문구','M09'),(236,4,'S144','중구','M09'),(237,4,'S145','용산구','M09'),(238,4,'S146','은평구','M09'),(239,4,'S147','종로구','M09'),(240,4,'S148','구로구','M09'),(241,4,'S149','강동구','M09'),(242,4,'S150','금천구','M09'),(243,4,'S151','양천구','M09'),(244,4,'S152','강서구','M09'),(245,4,'S153','중랑구','M09'),(246,4,'S154','마포구','M09'),(247,4,'S155','성동구','M09'),(248,4,'S156','강남구','M09'),(249,4,'S157','성북구','M09'),(250,4,'S158','강북구','M09'),(251,4,'S159','서초구','M09'),(252,4,'S160','도봉구','M09'),(253,4,'S161','영등포구','M09'),(254,4,'S162','광진구','M09'),(255,4,'S163','노원구','M09'),(256,4,'S164','관악구','M09'),(257,4,'S165','동대문구','M09'),(258,4,'S166','남구','M10'),(259,4,'S167','중구','M10'),(260,4,'S168','북구','M10'),(261,4,'S169','울주군','M10'),(262,4,'S170','동구','M10'),(263,4,'S171','남동','M12'),(264,4,'S172','부평구','M12'),(265,4,'S173','남구','M12'),(266,4,'S174','중구','M12'),(267,4,'S175','연수구','M12'),(268,4,'S176','계양구','M12'),(269,4,'S177','강화군','M12'),(270,4,'S178','옹진군','M12'),(271,4,'S179','서구','M12'),(272,4,'S180','미추홀구','M12'),(273,4,'S181','동구','M12'),(274,4,'S182','장흥군','M13'),(275,4,'S183','신안군','M13'),(276,4,'S184','영암군','M13'),(277,4,'S185','나주시','M13'),(278,4,'S186','구례군','M13'),(279,4,'S187','담양군','M13'),(280,4,'S188','무안군','M13'),(281,4,'S189','보성군','M13'),(282,4,'S190','화순군','M13'),(283,4,'S191','함평군','M13'),(284,4,'S192','순천시','M13'),(285,4,'S193','완도군','M13'),(286,4,'S194','장성군','M13'),(287,4,'S195','영광군','M13'),(288,4,'S196','광양시','M13'),(289,4,'S197','여수시','M13'),(290,4,'S198','고흥군','M13'),(291,4,'S199','진도군','M13'),(292,4,'S200','목포시','M13'),(293,4,'S201','해남군','M13'),(294,4,'S202','강진군','M13'),(295,4,'S203','곡성군','M13'),(296,4,'S204','전주시 완산구','M14'),(297,4,'S205','순창군','M14'),(298,4,'S206','장수군','M14'),(299,4,'S207','진안군','M14'),(300,4,'S208','무주군','M14'),(301,4,'S209','김제시','M14'),(302,4,'S210','익산시','M14'),(303,4,'S211','임실군','M14'),(304,4,'S212','군산시','M14'),(305,4,'S213','고창군','M14'),(306,4,'S214','정읍시','M14'),(307,4,'S215','부안군','M14'),(308,4,'S216','남원시','M14'),(309,4,'S217','완주군','M14'),(310,4,'S218','전주시 덕진구','M14'),(311,4,'S219','제주시','M15'),(312,4,'S220','서귀포시','M15'),(313,4,'S221','예산군','M16'),(314,4,'S222','부여군','M16'),(315,4,'S223','서산시','M16'),(316,4,'S224','아산시','M16'),(317,4,'S225','서천군','M16'),(318,4,'S226','금산군','M16'),(319,4,'S227','계룡시','M16'),(320,4,'S228','천안시','M16'),(321,4,'S229','홍성군','M16'),(322,4,'S230','태안군','M16'),(323,4,'S231','청양군','M16'),(324,4,'S232','논산시','M16'),(325,4,'S233','당진시','M16'),(326,4,'S234','보령시','M16'),(327,4,'S235','공주시','M16'),(328,4,'S236','영동군','M17'),(329,4,'S237','제천시','M17'),(330,4,'S238','청주시','M17'),(331,4,'S239','충주시','M17'),(332,4,'S240','진천군','M17'),(333,4,'S241','보은군','M17'),(334,4,'S242','청주시','M17'),(335,4,'S243','청주시','M17'),(336,4,'S244','단양군','M17'),(337,4,'S245','옥천군','M17'),(338,4,'S246','괴산군','M17'),(339,4,'S247','청주시','M17'),(340,4,'S248','음성군','M17'),(341,4,'S249','증평군','M17');
/*!40000 ALTER TABLE `sb_code_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_nickname` varchar(10) NOT NULL,
  `user_intro` varchar(500) DEFAULT NULL,
  `user_account` varchar(30) NOT NULL,
  `user_image` varchar(200) DEFAULT NULL,
  `user_mento_authority` enum('Y','N') NOT NULL DEFAULT 'N',
  `like_dept_code` varchar(200) DEFAULT NULL,
  `like_stack_code` varchar(200) DEFAULT NULL,
  `user_register_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  KEY `fk_code_idx` (`like_dept_code`,`like_stack_code`),
  KEY `fk_ddddd_idx` (`like_stack_code`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'username1','<div class=\"ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred\" lang=\"en\" dir=\"ltr\" role=\"textbox\" aria-label=\"Rich Text Editor, main\" contenteditable=\"true\"><h2>The three greatest things you learn from traveling</h2><p>Like all the great things on earth traveling teaches us by example. Here are some of the most precious lessons I’ve learned over the years of traveling.</p><figure class=\"image ck-widget image_resized image-style-align-right ck-widget_with-','googleId','url/url/url.jpg','N','','J01','2022-06-15 14:20:33'),(2,'username2','<div class=\"ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred\" lang=\"en\" dir=\"ltr\" role=\"textbox\" aria-label=\"Rich Text Editor, main\" contenteditable=\"true\"><h2>The three greatest things you learn from traveling</h2><p>Like all the great things on earth traveling teaches us by example. Here are some of the most precious lessons I’ve learned over the years of traveling.</p><figure class=\"image ck-widget image_resized image-style-align-right ck-widget_with-','googleId2','url/url/url2.jpg','Y','','V01,J01','2022-06-15 15:20:33'),(3,'teamjang1','<div class=\"ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred\" lang=\"en\" dir=\"ltr\" role=\"textbox\" aria-label=\"Rich Text Editor, main\" contenteditable=\"true\"><h2>The three greatest things you learn from traveling</h2><p>Like all the great things on earth traveling teaches us by example. Here are some of the most precious lessons I’ve learned over the years of traveling.</p><figure class=\"image ck-widget image_resized image-style-align-right ck-widget_with-','googleId3','url/url/url3.jpg','N','','V01,J01','2022-06-16 15:20:33'),(4,'teamwon1','<div class=\"ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred\" lang=\"en\" dir=\"ltr\" role=\"textbox\" aria-label=\"Rich Text Editor, main\" contenteditable=\"true\"><h2>The three greatest things you learn from traveling</h2><p>Like all the great things on earth traveling teaches us by example. Here are some of the most precious lessons I’ve learned over the years of traveling.</p><figure class=\"image ck-widget image_resized image-style-align-right ck-widget_with-','googleId4',NULL,'N','','V01,J01','2022-06-16 15:20:33'),(5,'jiwnoja1','<div class=\"ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred\" lang=\"en\" dir=\"ltr\" role=\"textbox\" aria-label=\"Rich Text Editor, main\" contenteditable=\"true\"><h2>The three greatest things you learn from traveling</h2><p>Like all the great things on earth traveling teaches us by example. Here are some of the most precious lessons I’ve learned over the years of traveling.</p><figure class=\"image ck-widget image_resized image-style-align-right ck-widget_with-','googleId5',NULL,'N','','V01,J01','2022-06-16 15:20:33'),(6,'teamwon2','<div class=\"ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred\" lang=\"en\" dir=\"ltr\" role=\"textbox\" aria-label=\"Rich Text Editor, main\" contenteditable=\"true\"><h2>The three greatest things you learn from traveling</h2><p>Like all the great things on earth traveling teaches us by example. Here are some of the most precious lessons I’ve learned over the years of traveling.</p><figure class=\"image ck-widget image_resized image-style-align-right ck-widget_with-','googleId6',NULL,'N','','S01,T01','2022-06-16 15:20:33'),(7,'jiwnoja2','<div class=\"ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred\" lang=\"en\" dir=\"ltr\" role=\"textbox\" aria-label=\"Rich Text Editor, main\" contenteditable=\"true\"><h2>The three greatest things you learn from traveling</h2><p>Like all the great things on earth traveling teaches us by example. Here are some of the most precious lessons I’ve learned over the years of traveling.</p><figure class=\"image ck-widget image_resized image-style-align-right ck-widget_with-','googleId7',NULL,'N','','R01,V01','2022-06-16 15:20:33'),(8,'jiwnoja3','<div class=\"ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred\" lang=\"en\" dir=\"ltr\" role=\"textbox\" aria-label=\"Rich Text Editor, main\" contenteditable=\"true\"><h2>The three greatest things you learn from traveling</h2><p>Like all the great things on earth traveling teaches us by example. Here are some of the most precious lessons I’ve learned over the years of traveling.</p><figure class=\"image ck-widget image_resized image-style-align-right ck-widget_with-','googleId8',NULL,'N','','J01,V01','2022-06-16 15:20:33'),(9,'jiwnoja4','<div class=\"ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred\" lang=\"en\" dir=\"ltr\" role=\"textbox\" aria-label=\"Rich Text Editor, main\" contenteditable=\"true\"><h2>The three greatest things you learn from traveling</h2><p>Like all the great things on earth traveling teaches us by example. Here are some of the most precious lessons I’ve learned over the years of traveling.</p><figure class=\"image ck-widget image_resized image-style-align-right ck-widget_with-','googleId9',NULL,'N','','J01,V01','2022-06-16 15:20:33'),(10,'teamwon3','<div class=\"ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred\" lang=\"en\" dir=\"ltr\" role=\"textbox\" aria-label=\"Rich Text Editor, main\" contenteditable=\"true\"><h2>The three greatest things you learn from traveling</h2><p>Like all the great things on earth traveling teaches us by example. Here are some of the most precious lessons I’ve learned over the years of traveling.</p><figure class=\"image ck-widget image_resized image-style-align-right ck-widget_with-','googleId10',NULL,'N','','J01,V01','2022-06-16 15:20:33'),(11,'teamwon4','<div class=\"ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred\" lang=\"en\" dir=\"ltr\" role=\"textbox\" aria-label=\"Rich Text Editor, main\" contenteditable=\"true\"><h2>The three greatest things you learn from traveling</h2><p>Like all the great things on earth traveling teaches us by example. Here are some of the most precious lessons I’ve learned over the years of traveling.</p><figure class=\"image ck-widget image_resized image-style-align-right ck-widget_with-','googleId11',NULL,'N','','R01,V01','2022-06-16 15:20:33'),(12,'teamwon5','<div class=\"ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred\" lang=\"en\" dir=\"ltr\" role=\"textbox\" aria-label=\"Rich Text Editor, main\" contenteditable=\"true\"><h2>The three greatest things you learn from traveling</h2><p>Like all the great things on earth traveling teaches us by example. Here are some of the most precious lessons I’ve learned over the years of traveling.</p><figure class=\"image ck-widget image_resized image-style-align-right ck-widget_with-','googleId12',NULL,'N','','V01,J01','2022-06-16 15:20:33'),(13,'teamwon6','<div class=\"ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred\" lang=\"en\" dir=\"ltr\" role=\"textbox\" aria-label=\"Rich Text Editor, main\" contenteditable=\"true\"><h2>The three greatest things you learn from traveling</h2><p>Like all the great things on earth traveling teaches us by example. Here are some of the most precious lessons I’ve learned over the years of traveling.</p><figure class=\"image ck-widget image_resized image-style-align-right ck-widget_with-','googleId13',NULL,'N','','R01,J02','2022-06-16 15:20:33'),(14,'teamwon7','<div class=\"ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred\" lang=\"en\" dir=\"ltr\" role=\"textbox\" aria-label=\"Rich Text Editor, main\" contenteditable=\"true\"><h2>The three greatest things you learn from traveling</h2><p>Like all the great things on earth traveling teaches us by example. Here are some of the most precious lessons I’ve learned over the years of traveling.</p><figure class=\"image ck-widget image_resized image-style-align-right ck-widget_with-','googleId14','url/url/url14.jpg','N',NULL,'J01,V01','2022-01-16 15:20:33'),(15,'teamwon8','<div class=\"ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred\" lang=\"en\" dir=\"ltr\" role=\"textbox\" aria-label=\"Rich Text Editor, main\" contenteditable=\"true\"><h2>The three greatest things you learn from traveling</h2><p>Like all the great things on earth traveling teaches us by example. Here are some of the most precious lessons I’ve learned over the years of traveling.</p><figure class=\"image ck-widget image_resized image-style-align-right ck-widget_with-','googleId15','url/url/url15.jpg','N',NULL,'R01,J02','2022-01-16 15:20:33'),(16,'teamwon9','<div class=\"ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred\" lang=\"en\" dir=\"ltr\" role=\"textbox\" aria-label=\"Rich Text Editor, main\" contenteditable=\"true\"><h2>The three greatest things you learn from traveling</h2><p>Like all the great things on earth traveling teaches us by example. Here are some of the most precious lessons I’ve learned over the years of traveling.</p><figure class=\"image ck-widget image_resized image-style-align-right ck-widget_with-','googleId16','url/url/url16.jpg','N',NULL,'R01,V01','2022-01-16 15:20:33'),(17,'teamwon10','<div class=\"ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred\" lang=\"en\" dir=\"ltr\" role=\"textbox\" aria-label=\"Rich Text Editor, main\" contenteditable=\"true\"><h2>The three greatest things you learn from traveling</h2><p>Like all the great things on earth traveling teaches us by example. Here are some of the most precious lessons I’ve learned over the years of traveling.</p><figure class=\"image ck-widget image_resized image-style-align-right ck-widget_with-','googleId17','url/url/url17.jpg','N',NULL,'S01,T01','2022-01-16 15:20:33'),(18,'mentos1','<div class=\"ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred\" lang=\"en\" dir=\"ltr\" role=\"textbox\" aria-label=\"Rich Text Editor, main\" contenteditable=\"true\"><h2>The three greatest things you learn from traveling</h2><p>Like all the great things on earth traveling teaches us by example. Here are some of the most precious lessons I’ve learned over the years of traveling.</p><figure class=\"image ck-widget image_resized image-style-align-right ck-widget_with-','googleId18','url/url/url18.jpg','Y',NULL,'J01,V01','2022-01-16 15:20:33'),(19,'mentos2','<div class=\"ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred\" lang=\"en\" dir=\"ltr\" role=\"textbox\" aria-label=\"Rich Text Editor, main\" contenteditable=\"true\"><h2>The three greatest things you learn from traveling</h2><p>Like all the great things on earth traveling teaches us by example. Here are some of the most precious lessons I’ve learned over the years of traveling.</p><figure class=\"image ck-widget image_resized image-style-align-right ck-widget_with-','googleId19','url/url/url19.jpg','Y',NULL,'V01,J01','2022-01-16 15:20:33');/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `view_count`
--

DROP TABLE IF EXISTS `view_count`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `view_count` (
  `view_count_id` int NOT NULL AUTO_INCREMENT,
  `post_category` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `post_id` int NOT NULL,
  `view_userid` int DEFAULT NULL,
  `view_time` datetime DEFAULT NULL,
  PRIMARY KEY (`view_count_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `view_count`
--

LOCK TABLES `view_count` WRITE;
/*!40000 ALTER TABLE `view_count` DISABLE KEYS */;
INSERT INTO `view_count` VALUES (1,'RCB',1,1,'2022-06-16 00:00:00'),(2,'RCB',1,2,'2022-06-16 00:00:00'),(3,'RCB',1,1,'2022-06-17 00:00:00');
/*!40000 ALTER TABLE `view_count` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'team4'
--
/*!50003 DROP FUNCTION IF EXISTS `fn_apply_dept_desc` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`dev`@`%` FUNCTION `fn_apply_dept_desc`(
  apply_dept_id int
 
 ) RETURNS varchar(20) CHARSET utf8
BEGIN
 DECLARE apply_dept_desc varchar(20);
 SELECT fn_code_data_desc(t.apply_dept_code)
	from  apply_dept t
		where t.apply_dept_id = apply_dept_id
 into apply_dept_desc;
RETURN apply_dept_desc;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;


/*!50003 DROP FUNCTION IF EXISTS `fn_apply_status` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`dev`@`%` FUNCTION `fn_apply_status`(
  applicant_id int
 , project_id int 
 
 ) RETURNS varchar(20) CHARSET utf8
BEGIN
 DECLARE apply_status varchar(20);
 SELECT t.apply_status
	from  apply_admin t
		where t.applicant_id = applicant_id
		and t.project_id = project_id 
        order by insert_date desc
        limit 1        
 into apply_status;
RETURN apply_status;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_board_likecount` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`dev`@`%` FUNCTION `fn_board_likecount`(
  category varchar(20) 
 , id int(10) 
 
 ) RETURNS int
BEGIN
 DECLARE like_cnt INT(10);
 SELECT count(t.like_time) 
	from  like_count t
		where t.post_category = category
		and t.post_id = id
        and t.like_yn ='Y'
 into like_cnt;
RETURN like_cnt;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_board_viewcnt` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`dev`@`%` FUNCTION `fn_board_viewcnt`(
  category varchar(20) 
 , id int(10) 
 
 ) RETURNS int
BEGIN
 DECLARE VIEW_CNT INT(10);
 SELECT count(t.view_time) 
	from  view_count t
		where t.post_category = category
		and t.post_id = id
 into view_cnt;
RETURN view_cnt;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_code_class` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`dev`@`%` FUNCTION `fn_code_class`(
  class_title varchar(20)  
 ) RETURNS int
BEGIN
 DECLARE code_class_id varchar(20);
 SELECT t.code_class_id
	from  sb_class_code t
		where t.code_class_desc = class_title
 into code_class_id;
RETURN code_class_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_code_data_desc` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`dev`@`%` FUNCTION `fn_code_data_desc`(
  code_name varchar(20)  
 ) RETURNS varchar(20) CHARSET utf8
BEGIN
 DECLARE code_data_desc varchar(20);
 SELECT t.code_data_desc
	from  sb_code_data t
		where t.code_data_name = code_name
 into code_data_desc;
RETURN code_data_desc;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_getMentorinfo` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`dev`@`%` FUNCTION `fn_getMentorinfo`(
  mentoring_id int 
 
 ) RETURNS int
BEGIN
 DECLARE mentor_info_id int;
 SELECT t.mentor_info_id
	from  mentoring t
		where t.mentoring_id = mentoring_id
 into mentor_info_id;
RETURN mentor_info_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_getMentorname` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`dev`@`%` FUNCTION `fn_getMentorname`(
  mentor_info_id int 
 
 ) RETURNS varchar(50) CHARSET utf8
BEGIN
 DECLARE mentor_name  varchar(50);
 SELECT t.user_nickname
	from  user t
		where t.user_Id = (select v.user_id from mentor_info v where v.mentor_info_id =  mentor_info_id)
 into mentor_name;
RETURN mentor_name;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_get_curr_mentoringstatus` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`dev`@`%` FUNCTION `fn_get_curr_mentoringstatus`(
  param_mentoring_id int 
 ) RETURNS varchar(30) CHARSET utf8
BEGIN
 DECLARE mentoring_status varchar(30);
 SELECT t.status_code
	from  mentoring t
		where t.mentoring_id = param_mentoring_id
 into mentoring_status;
RETURN mentoring_status;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_get_mentorinfo` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`dev`@`%` FUNCTION `fn_get_mentorinfo`(
  param_user_id int 
 ) RETURNS int
BEGIN
 DECLARE mentor_info_id int;
 SELECT t.mentor_info_id
	from  mentor_info t
		where t.user_id = param_user_id
 into mentor_info_id;
RETURN mentor_info_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_get_mentorStatusNum` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`dev`@`%` FUNCTION `fn_get_mentorStatusNum`(
  mentoring_status varchar(50)  
 ) RETURNS varchar(50) CHARSET utf8
BEGIN
 DECLARE result_number  varchar(50);
 SELECT 
   case
    when ( mentoring_status = 'REJ' ) THEN '-1'
	when ( mentoring_status = 'NEW' ) THEN '1'
    when ( mentoring_status = 'ACC' ) THEN '2'    
  /*  when ( mentoring_status = 'PAY' ) THEN '3' 결제 진행은 없음. */
    when ( mentoring_status = 'ING' ) THEN '4'
    when ( mentoring_status = 'FIN' ) THEN '5'
   
   end as result
   
   
   
 into result_number;
RETURN result_number;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_get_username` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`dev`@`%` FUNCTION `fn_get_username`(
  param_user_id int 
 ) RETURNS varchar(30) CHARSET utf8
BEGIN
 DECLARE user_nickname varchar(30);
 SELECT t.user_nickname
	from  user t
		where t.user_id = param_user_id
 into user_nickname;
RETURN user_nickname;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_user_dept_code` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`dev`@`%` FUNCTION `fn_user_dept_code`(
  user_id int
 
 ) RETURNS varchar(60) CHARSET utf8
BEGIN
 DECLARE user_dept_code varchar(60);
 SELECT  t.like_dept_code
	from  user t
		where t.user_id = user_id
 into user_dept_code;
RETURN user_dept_code;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_user_email` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`dev`@`%` FUNCTION `fn_user_email`(
  user_id int
 
 ) RETURNS varchar(60) CHARSET utf8
BEGIN
 DECLARE user_email varchar(60);
 SELECT  concat(t.user_account , '@gmail.com') 
	from  user t
		where t.user_id = user_id
 into user_email;
RETURN user_email;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_user_nickname` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`dev`@`%` FUNCTION `fn_user_nickname`(
  user_id int
 
 ) RETURNS varchar(60) CHARSET utf8
BEGIN
 DECLARE user_nickname varchar(60);
 SELECT  t.user_nickname
	from  user t
		where t.user_id = user_id
 into user_nickname;
RETURN user_nickname;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `fn_user_stack_code` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`dev`@`%` FUNCTION `fn_user_stack_code`(
  user_id  int
 ) RETURNS varchar(50) CHARSET utf8
BEGIN
 DECLARE like_stack_code varchar(50);
 SELECT t.like_stack_code
	from  user t
		where t.user_id = user_id
 into like_stack_code;
RETURN like_stack_code;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `template1` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`dev`@`%` FUNCTION `template1`() RETURNS int
BEGIN
/*
 #1   한글로 코드분류명 검색해서 코드 뭐 있나 찾기 ( 작업용 ) by김인호 
 SELECT b.code_class_desc,a.* FROM team44.sb_code_data a,team44.sb_class_code b where b.code_class_id = a.code_class_id
and b.code_class_desc
 like '%상태%';
 
 
 #2 


apply_admin





*/

RETURN 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-07-10  1:09:17
