-- Adminer 4.8.1 MySQL 8.0.27-0ubuntu0.20.04.1 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP DATABASE IF EXISTS `smart_medicare`;
CREATE DATABASE `smart_medicare` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `smart_medicare`;

DROP TABLE IF EXISTS `address`;
CREATE TABLE `address` (
  `registration_no` char(10) NOT NULL,
  `address` text NOT NULL,
  `phone_no` char(14) DEFAULT NULL,
  `mobile_no` char(14) DEFAULT NULL,
  `latitude` decimal(10,5) DEFAULT NULL,
  `longitude` decimal(10,5) DEFAULT NULL,
  PRIMARY KEY (`registration_no`),
  CONSTRAINT `address_fk0` FOREIGN KEY (`registration_no`) REFERENCES `hospital` (`registration_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `address` (`registration_no`, `address`, `phone_no`, `mobile_no`, `latitude`, `longitude`) VALUES
('0476608341',	'64/C, Rampura, Second Noakhali, Khulna',	'+88082923211',	'+8801965914699',	-15.05265,	20.36600),
('2836314655',	'941/B, South Banani, Milton Faridpur, Dhaka',	'+880621011',	'+8801171441088',	53.85689,	-55.53099),
('3360052309',	'201, South Rampura, Cowley Tangail, Rangpur',	'+880685447',	'+8801837141746',	-62.77822,	-101.07198),
('3613266758',	'21, West Banani, Cowley Rangpur, Sylhet',	'+880663721',	'+8801171135331',	75.34928,	-3.99436),
('3701043663',	'78, East Banani, Old Faridpur, Khulna',	'+880313582',	'+8801471508871',	-27.57331,	-52.36123),
('3875193242',	'46, North Rampura, Old Dinajpur, Rangpur',	'+880650554',	NULL,	-14.32456,	83.35069),
('6895047952',	'26/A, West Rampura, Milton Comilla , Chittagong',	'+880686527',	'+8801171326872',	64.59571,	-42.63265),
('7503214296',	'86, West Banani, Second Rangpur, Rangpur',	'+880764459',	'+8801823387117',	-89.39147,	-100.07942),
('7531726902',	'24, Badda, Cowley Sherpur, Rajshahi',	'+880921790',	'+8801107918959',	73.36258,	-116.42325),
('7722788763',	'78/B, North Banani, Milton Comilla ,  Barishal',	'+880652867',	'+8801124355433',	-38.79916,	117.47151)
ON DUPLICATE KEY UPDATE `registration_no` = VALUES(`registration_no`), `address` = VALUES(`address`), `phone_no` = VALUES(`phone_no`), `mobile_no` = VALUES(`mobile_no`), `latitude` = VALUES(`latitude`), `longitude` = VALUES(`longitude`);

DROP TABLE IF EXISTS `amenity`;
CREATE TABLE `amenity` (
  `registration_no` char(10) NOT NULL,
  `atm` tinyint(1) DEFAULT NULL,
  `baby_corner` tinyint(1) DEFAULT NULL,
  `cafeteria` tinyint(1) DEFAULT NULL,
  `gift_shop` tinyint(1) DEFAULT NULL,
  `locker` tinyint(1) DEFAULT NULL,
  `parking` tinyint(1) DEFAULT NULL,
  `pharmacy` tinyint(1) DEFAULT NULL,
  `prayer_area` tinyint(1) DEFAULT NULL,
  `wheelchair` tinyint(1) DEFAULT NULL,
  `wifi` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`registration_no`),
  CONSTRAINT `amenity_fk0` FOREIGN KEY (`registration_no`) REFERENCES `hospital` (`registration_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `amenity` (`registration_no`, `atm`, `baby_corner`, `cafeteria`, `gift_shop`, `locker`, `parking`, `pharmacy`, `prayer_area`, `wheelchair`, `wifi`) VALUES
('0476608341',	1,	1,	1,	1,	1,	1,	0,	0,	1,	1),
('2836314655',	1,	0,	1,	0,	0,	0,	0,	1,	1,	0),
('3360052309',	0,	1,	0,	1,	0,	1,	1,	1,	1,	1),
('3613266758',	1,	NULL,	1,	0,	0,	0,	NULL,	NULL,	1,	1),
('3701043663',	1,	1,	0,	0,	0,	0,	1,	0,	1,	0),
('3875193242',	1,	NULL,	0,	0,	0,	0,	NULL,	1,	0,	1),
('6895047952',	0,	0,	1,	0,	0,	0,	1,	0,	1,	0),
('7503214296',	1,	0,	0,	1,	0,	0,	0,	1,	1,	0),
('7531726902',	1,	1,	0,	0,	0,	1,	1,	0,	1,	0),
('7722788763',	0,	0,	0,	0,	0,	1,	1,	1,	0,	0)
ON DUPLICATE KEY UPDATE `registration_no` = VALUES(`registration_no`), `atm` = VALUES(`atm`), `baby_corner` = VALUES(`baby_corner`), `cafeteria` = VALUES(`cafeteria`), `gift_shop` = VALUES(`gift_shop`), `locker` = VALUES(`locker`), `parking` = VALUES(`parking`), `pharmacy` = VALUES(`pharmacy`), `prayer_area` = VALUES(`prayer_area`), `wheelchair` = VALUES(`wheelchair`), `wifi` = VALUES(`wifi`);

DROP TABLE IF EXISTS `blood_analytical_service`;
CREATE TABLE `blood_analytical_service` (
  `registration_no` char(10) NOT NULL,
  `antibody_analysis` tinyint(1) DEFAULT NULL,
  `cbc` tinyint(1) DEFAULT NULL,
  `creatinine_analysis` tinyint(1) DEFAULT NULL,
  `crp` tinyint(1) DEFAULT NULL,
  `esr` tinyint(1) DEFAULT NULL,
  `fobt` tinyint(1) DEFAULT NULL,
  `hematocrit` tinyint(1) DEFAULT NULL,
  `kidney_function_analysis` tinyint(1) DEFAULT NULL,
  `lipid_profile` tinyint(1) DEFAULT NULL,
  `liver_function_analysis` tinyint(1) DEFAULT NULL,
  `rf` tinyint(1) DEFAULT NULL,
  `serum_analysis` tinyint(1) DEFAULT NULL,
  `sr` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`registration_no`),
  CONSTRAINT `blood_analytical_service_fk0` FOREIGN KEY (`registration_no`) REFERENCES `hospital` (`registration_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `blood_analytical_service` (`registration_no`, `antibody_analysis`, `cbc`, `creatinine_analysis`, `crp`, `esr`, `fobt`, `hematocrit`, `kidney_function_analysis`, `lipid_profile`, `liver_function_analysis`, `rf`, `serum_analysis`, `sr`) VALUES
('0476608341',	1,	1,	1,	1,	1,	0,	1,	1,	1,	1,	1,	0,	1),
('2836314655',	1,	0,	1,	0,	1,	0,	0,	1,	0,	0,	NULL,	1,	0),
('3360052309',	0,	1,	0,	1,	1,	1,	0,	0,	1,	1,	1,	0,	0),
('3613266758',	1,	NULL,	1,	0,	1,	0,	NULL,	NULL,	0,	1,	0,	1,	NULL),
('3701043663',	0,	1,	0,	1,	1,	1,	0,	0,	0,	0,	NULL,	1,	0),
('3875193242',	1,	NULL,	0,	1,	0,	0,	NULL,	1,	0,	1,	0,	0,	1),
('6895047952',	0,	1,	1,	0,	1,	0,	0,	0,	1,	0,	0,	1,	0),
('7503214296',	1,	0,	0,	1,	1,	0,	0,	1,	1,	1,	0,	0,	0),
('7531726902',	1,	1,	0,	0,	1,	1,	0,	0,	1,	1,	0,	1,	1),
('7722788763',	0,	0,	0,	1,	0,	1,	1,	1,	0,	1,	NULL,	0,	NULL)
ON DUPLICATE KEY UPDATE `registration_no` = VALUES(`registration_no`), `antibody_analysis` = VALUES(`antibody_analysis`), `cbc` = VALUES(`cbc`), `creatinine_analysis` = VALUES(`creatinine_analysis`), `crp` = VALUES(`crp`), `esr` = VALUES(`esr`), `fobt` = VALUES(`fobt`), `hematocrit` = VALUES(`hematocrit`), `kidney_function_analysis` = VALUES(`kidney_function_analysis`), `lipid_profile` = VALUES(`lipid_profile`), `liver_function_analysis` = VALUES(`liver_function_analysis`), `rf` = VALUES(`rf`), `serum_analysis` = VALUES(`serum_analysis`), `sr` = VALUES(`sr`);

DROP TABLE IF EXISTS `booking`;
CREATE TABLE `booking` (
  `id` char(10) NOT NULL,
  `registration_no` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `mobile_no` char(14) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `sex` enum('M','F','T','S') NOT NULL,
  `bed_type` enum('Ward','Special Ward','Cabin','VIP Cabin','ICU','CCU','HDU','HFNCU','Emergency','COVID','Extra') NOT NULL,
  `booked_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `booked_for` enum('Self','Father','Mother','Brother','Sister','Relative','Friend','Stranger') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `cancelled_at` datetime DEFAULT NULL,
  `status` enum('Requested','Booked','Served','Cancelled') NOT NULL,
  `remarks` tinytext,
  `last_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `booking_fk0` (`mobile_no`),
  KEY `booking_fk1` (`registration_no`),
  CONSTRAINT `booking_fk0` FOREIGN KEY (`mobile_no`) REFERENCES `user` (`mobile_no`),
  CONSTRAINT `booking_fk1` FOREIGN KEY (`registration_no`) REFERENCES `hospital` (`registration_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `booking` (`id`, `registration_no`, `mobile_no`, `name`, `sex`, `bed_type`, `booked_at`, `booked_for`, `cancelled_at`, `status`, `remarks`, `last_updated`) VALUES
('06fhm22ue8',	'7722788763',	'+8801165675284',	'Emily Matthews',	'T',	'HDU',	'2017-08-12 13:22:04',	'Brother',	NULL,	'Served',	'Tony bought new car. Anne bought new car. John bought new car. Tony is shopping. John bought new car. ',	'2021-12-15 09:24:21'),
('0kt66bxim1',	'7503214296',	'+8801593470482',	'Erich Ingram',	'F',	'VIP Cabin',	'2015-03-28 20:38:01',	NULL,	NULL,	'Served',	'Tony is shopping. Tony is shopping. Tony has free time. Tony has free time. Tony is walking. ',	'2021-12-15 09:24:21'),
('0x1pvj475y',	'2836314655',	'+8801563376983',	'Kendall Ryan',	'F',	'ICU',	'2018-03-16 16:59:34',	'Sister',	NULL,	'Booked',	'Tony bought new car. Anne bought new car. Anne has free time. ',	'2021-12-15 09:24:21'),
('2662b2tphq',	'3613266758',	'+8801870206523',	'Charlotte Lara',	'M',	'Cabin',	'2015-01-12 19:55:51',	'Friend',	'2018-12-06 19:14:20',	'Booked',	'Tony bought new car. Anne is walking. John is walking. ',	'2021-12-15 09:24:21'),
('27e39k7e6w',	'3613266758',	'+8801563376983',	'Audrey Beltran',	'M',	'Ward',	'2016-01-12 13:40:01',	'Brother',	NULL,	'Booked',	'Tony has free time. Anne is walking. Anne has free time. ',	'2021-12-15 09:24:21'),
('286x6m73u1',	'0476608341',	'+8801870206523',	'Manuel Mcfarland',	'F',	'HFNCU',	'2020-08-10 13:37:27',	'Relative',	NULL,	'Served',	'Anne bought new car. Anne is walking. ',	'2021-12-15 09:24:21'),
('2e66se97zx',	'2836314655',	'+8801165675284',	NULL,	'M',	'HFNCU',	'2015-12-02 17:44:44',	'Mother',	NULL,	'Cancelled',	'John bought new car. Tony bought new car. Tony bought new car. ',	'2021-12-15 09:24:21'),
('2rh1o2y7nq',	'7503214296',	'+8801636637722',	'Abraham Gates',	'M',	'Ward',	'2015-02-26 01:07:31',	'Father',	NULL,	'Booked',	'John is shopping. Tony has free time. ',	'2021-12-15 09:24:21'),
('3360ao2h0y',	'0476608341',	'+8801596047660',	'Abraham Blackburn',	'T',	'Emergency',	'2015-08-30 06:53:59',	'Relative',	NULL,	'Booked',	'John bought new car. Tony has free time. Anne bought new car. John is walking. Tony has free time. ',	'2021-12-15 09:24:21'),
('35f29ttm51',	'7531726902',	'+8801836314655',	NULL,	'T',	'Ward',	'2015-01-15 10:56:09',	'Relative',	NULL,	'Cancelled',	'Tony bought new car. John bought new car. Anne has free time. Anne has free time. Tony is shopping. ',	'2021-12-15 09:24:21'),
('37010mjsq3',	'6895047952',	'+8801165675284',	NULL,	'S',	'Extra',	'2019-05-03 16:00:07',	'Brother',	NULL,	'Cancelled',	'Anne bought new car. John is shopping. John has free time. ',	'2021-12-15 09:24:21'),
('37q37v5t21',	'3613266758',	'+8801125816591',	'Ramona Hess',	'M',	'HDU',	'2018-05-02 08:04:44',	'Mother',	NULL,	'Served',	'Tony bought new car. Tony is shopping. John has free time. Tony bought new car. John bought new car. ',	'2021-12-15 09:24:21'),
('3865ru5g84',	'0476608341',	'+8801596047660',	'Randall Morrison',	'M',	'HDU',	'2020-09-08 22:03:16',	'Relative',	NULL,	'Booked',	'Anne has free time. John bought new car. Tony is walking. ',	'2021-12-15 09:24:21'),
('40th24fpwd',	'7503214296',	'+8801422081583',	'Damien Newman',	'S',	'Emergency',	'2021-01-05 21:59:58',	'Relative',	NULL,	'Cancelled',	'Anne bought new car. Tony is walking. John has free time. Anne has free time. John has free time. ',	'2021-12-15 09:24:21'),
('56lx6183um',	'3875193242',	'+8801636637722',	'Chester Hutchinson',	'F',	'Ward',	'2015-04-12 10:26:37',	'Stranger',	NULL,	'Cancelled',	'Anne bought new car. Tony has free time. Tony bought new car. John is walking. Anne has free time. ',	'2021-12-15 09:24:21'),
('5wur4m4420',	'7722788763',	'+8801836314655',	'Tracey Mcgrath',	'M',	'COVID',	'2019-11-24 06:55:42',	NULL,	NULL,	'Cancelled',	'Anne bought new car. Anne is walking. Tony is shopping. Tony bought new car. Tony is shopping. ',	'2021-12-15 09:24:21'),
('627gndp34v',	'3875193242',	'+8801836314655',	NULL,	'T',	'Extra',	'2019-05-06 03:10:07',	'Brother',	NULL,	'Cancelled',	'Anne bought new car. Tony has free time. ',	'2021-12-15 09:24:21'),
('652i2441d6',	'3875193242',	'+8801197745135',	'Shelley Garrett',	'F',	'HDU',	'2018-08-24 17:45:11',	'Father',	NULL,	'Booked',	'Anne is shopping. Tony bought new car. John is walking. ',	'2021-12-15 09:24:21'),
('65ye9uvyo6',	'3613266758',	'+8801636637722',	'Owen George',	'S',	'Extra',	'2017-04-15 04:24:00',	NULL,	NULL,	'Cancelled',	'Anne bought new car. Anne has free time. ',	'2021-12-15 09:24:21'),
('6sgqd1113p',	'7503214296',	'+8801123422718',	'Esmeralda Mejia',	'M',	'HFNCU',	'2017-06-27 22:44:37',	'Brother',	NULL,	'Cancelled',	'John has free time. Anne is walking. Tony bought new car. John is shopping. Tony has free time. ',	'2021-12-15 09:24:21'),
('73uhj9ap25',	'2836314655',	'+8801169023360',	'Jim Hoffman',	'S',	'ICU',	'2016-01-18 19:15:16',	'Brother',	NULL,	'Cancelled',	'Tony bought new car. John is walking. Tony bought new car. Tony has free time. Tony has free time. ',	'2021-12-15 09:24:21'),
('7p82ol1lbj',	'3701043663',	'+8801603376378',	'Tonya Combs',	'F',	'Special Ward',	'2017-06-05 19:58:13',	'Sister',	NULL,	'Cancelled',	'Anne is shopping. Anne has free time. John is shopping. ',	'2021-12-15 09:24:21'),
('7s2278v76i',	'3875193242',	'+8801593470482',	NULL,	'F',	'HFNCU',	'2021-05-15 05:38:36',	'Brother',	NULL,	'Served',	'John bought new car. Anne is walking. ',	'2021-12-15 09:24:21'),
('7sy7s29w8a',	'6895047952',	'+8801562388006',	'Otis Rodgers',	'M',	'Ward',	'2021-03-26 19:21:19',	'Father',	NULL,	'Cancelled',	'Tony bought new car. John is shopping. ',	'2021-12-15 09:24:21'),
('8388ro4d22',	'0476608341',	'+8801968950479',	'Roxanne Ellison',	'M',	'ICU',	'2021-03-02 11:53:21',	'Relative',	NULL,	'Cancelled',	'Anne is shopping. Anne is walking. Anne bought new car. Anne bought new car. ',	'2021-12-15 09:24:21'),
('bp2jq3j76y',	'7503214296',	'+8801870206523',	'Rose Moreno',	'S',	'VIP Cabin',	'2020-12-29 16:11:49',	'Father',	'2015-09-20 12:39:44',	'Cancelled',	'Anne has free time. Anne bought new car. John is walking. Anne has free time. Tony bought new car. ',	'2021-12-15 09:24:21'),
('cp8c776bv3',	'7531726902',	'+8801126675875',	'Darren Sanford',	'M',	'Cabin',	'2017-12-18 01:48:04',	'Mother',	NULL,	'Booked',	'John is shopping. John is shopping. Anne bought new car. Tony is walking. Anne has free time. ',	'2021-12-15 09:24:21'),
('d218274k38',	'3360052309',	'+8801593470482',	'Dwight Hayes',	'M',	'VIP Cabin',	'2016-12-07 15:54:51',	'Stranger',	NULL,	'Booked',	'Anne bought new car. John bought new car. John bought new car. Tony bought new car. Tony bought new car. ',	'2021-12-15 09:24:21'),
('em76j1fo7a',	'7503214296',	'+8801173733906',	'Dena Mack',	'S',	'ICU',	'2015-10-06 12:50:03',	'Relative',	NULL,	'Booked',	'John has free time. John is walking. Tony has free time. John is shopping. Anne bought new car. ',	'2021-12-15 09:24:21'),
('fxhq31msoo',	'3613266758',	'+8801836314655',	'Dominick Neal',	'M',	'Cabin',	'2017-03-10 14:26:27',	'Stranger',	NULL,	'Served',	'Tony bought new car. Anne has free time. Tony has free time. John has free time. Tony has free time. ',	'2021-12-15 09:24:21'),
('g84i52yil1',	'3701043663',	'+8801126675875',	'Clyde Flowers',	'M',	'Emergency',	'2018-06-11 08:48:18',	'Relative',	NULL,	'Served',	'Tony bought new car. John bought new car. John has free time. John has free time. Anne bought new car. ',	'2021-12-15 09:24:21'),
('h63i565e3f',	'3701043663',	'+8801127433875',	'Marlon Newton',	'F',	'ICU',	'2020-01-05 19:34:44',	'Mother',	NULL,	'Cancelled',	'Tony has free time. John is shopping. Tony has free time. John has free time. Tony is walking. ',	'2021-12-15 09:24:21'),
('i551t23j62',	'6895047952',	'+8801123422718',	'Ebony Daniels',	'F',	'Special Ward',	'2016-01-02 22:16:01',	'Mother',	'2015-10-17 23:59:04',	'Cancelled',	'Anne is walking. Anne has free time. John bought new car. ',	'2021-12-15 09:24:21'),
('i8toe9i2mf',	'7722788763',	'+8801968950479',	'Cherie White',	'S',	'Emergency',	'2019-09-05 08:50:07',	'Relative',	NULL,	'Served',	'Anne is shopping. Tony is walking. John is shopping. Tony bought new car. Tony has free time. ',	'2021-12-15 09:24:21'),
('irc326675x',	'3701043663',	'+8801165675284',	'Charlotte Byrd',	'M',	'Ward',	'2017-09-06 05:38:41',	'Brother',	NULL,	'Cancelled',	'Tony is shopping. Tony is shopping. ',	'2021-12-15 09:24:21'),
('j225o7gym4',	'7531726902',	'+8801538751932',	'Clarissa Dunlap',	'M',	'ICU',	'2018-11-03 03:10:56',	'Friend',	NULL,	'Cancelled',	'Anne bought new car. John bought new car. John is walking. Tony has free time. Anne has free time. ',	'2021-12-15 09:24:21'),
('jvvab6pbk8',	'3701043663',	'+8801870206523',	'Arthur Barrera',	'M',	'HFNCU',	'2021-05-05 11:54:43',	'Brother',	NULL,	'Booked',	'Anne bought new car. Anne is walking. John is shopping. ',	'2021-12-15 09:24:21'),
('oa6e6b7m26',	'6895047952',	'+8801603376378',	'Derrick Huffman',	'M',	'Ward',	'2020-01-27 02:50:13',	'Mother',	NULL,	'Cancelled',	'Anne bought new car. Tony is shopping. Tony has free time. John has free time. ',	'2021-12-15 09:24:21'),
('q5b53u7bgb',	'2836314655',	'+8801125816591',	'Lara Haynes',	'S',	'ICU',	'2021-03-09 04:28:14',	NULL,	NULL,	'Booked',	'Anne bought new car. Anne has free time. Anne bought new car. John has free time. Tony has free time. ',	'2021-12-15 09:24:21'),
('qml2w3hg47',	'2836314655',	'+8801563376983',	'Sharon O\'Neal',	'T',	'Ward',	'2019-07-29 09:43:00',	'Friend',	NULL,	'Served',	'John is walking. Anne has free time. Tony is shopping. John has free time. Anne has free time. ',	'2021-12-15 09:24:21'),
('r53r4d7u6s',	'7503214296',	'+8801126675875',	'Bobbi Larson',	'M',	'Emergency',	'2020-10-14 11:57:24',	'Relative',	'2017-11-26 10:29:31',	'Cancelled',	'John bought new car. Anne is walking. Tony is walking. John is walking. John has free time. ',	'2021-12-15 09:24:21'),
('r8zoaksz52',	'3875193242',	'+8801968950479',	NULL,	'S',	'HFNCU',	'2017-09-12 14:01:14',	'Mother',	NULL,	'Served',	'Anne bought new car. John is walking. John bought new car. John has free time. ',	'2021-12-15 09:24:21'),
('riyik7b48g',	'0476608341',	'+8801538751932',	'Debra Middleton',	'S',	'Cabin',	'2016-01-19 09:00:49',	'Brother',	NULL,	'Cancelled',	'John has free time. Anne has free time. Tony is shopping. Tony is shopping. Anne has free time. ',	'2021-12-15 09:24:21'),
('sfcfp342qq',	'3613266758',	'+8801169023360',	'Stephan Park',	'S',	'Special Ward',	'2019-02-08 18:43:12',	NULL,	NULL,	'Booked',	'Anne bought new car. Anne has free time. Tony bought new car. Tony has free time. John has free time. ',	'2021-12-15 09:24:21'),
('tnb32c4gyr',	'7503214296',	'+8801123422718',	'Lynn Miles',	'F',	'Special Ward',	'2016-05-14 02:18:48',	'Relative',	NULL,	'Booked',	'Anne is shopping. Anne bought new car. Tony bought new car. John is shopping. John has free time. ',	'2021-12-15 09:24:21'),
('tt82283776',	'7722788763',	'+8801968950479',	'Randal Patterson',	'M',	'Special Ward',	'2018-07-20 03:07:21',	NULL,	NULL,	'Booked',	'Anne bought new car. Anne is shopping. John bought new car. ',	'2021-12-15 09:24:21'),
('v30f74i036',	'0476608341',	'+8801563376983',	'Deanna Hicks',	'M',	'ICU',	'2015-01-12 09:58:18',	'Mother',	NULL,	'Cancelled',	'John bought new car. Tony bought new car. ',	'2021-12-15 09:24:21'),
('v5idu26zbe',	'7531726902',	'+8801562388006',	'Stephen Cisneros',	'M',	'ICU',	'2019-10-23 18:44:52',	'Brother',	NULL,	'Cancelled',	'Anne bought new car. Anne is walking. John bought new car. ',	'2021-12-15 09:24:21'),
('w8k36lpm2s',	'3701043663',	'+8801593470482',	'Tammy Fletcher',	'M',	'ICU',	'2020-04-19 12:25:13',	'Father',	NULL,	'Served',	'John bought new car. Anne has free time. John bought new car. ',	'2021-12-15 09:24:21'),
('x5c7b429n2',	'3875193242',	'+8801176877298',	'Joyce Carlson',	'M',	'VIP Cabin',	'2019-08-22 14:15:06',	'Stranger',	NULL,	'Cancelled',	'Anne has free time. John is walking. Tony bought new car. John has free time. Anne is walking. ',	'2021-12-15 09:24:21')
ON DUPLICATE KEY UPDATE `id` = VALUES(`id`), `registration_no` = VALUES(`registration_no`), `mobile_no` = VALUES(`mobile_no`), `name` = VALUES(`name`), `sex` = VALUES(`sex`), `bed_type` = VALUES(`bed_type`), `booked_at` = VALUES(`booked_at`), `booked_for` = VALUES(`booked_for`), `cancelled_at` = VALUES(`cancelled_at`), `status` = VALUES(`status`), `remarks` = VALUES(`remarks`), `last_updated` = VALUES(`last_updated`);

DROP TABLE IF EXISTS `capacity`;
CREATE TABLE `capacity` (
  `registration_no` char(10) NOT NULL,
  `total_capacity` mediumint NOT NULL,
  `ward` smallint DEFAULT NULL,
  `special_ward` smallint DEFAULT NULL,
  `cabin` tinyint DEFAULT NULL,
  `vip_cabin` tinyint DEFAULT NULL,
  `icu` tinyint DEFAULT NULL,
  `ccu` tinyint DEFAULT NULL,
  `hdu` smallint DEFAULT NULL,
  `hfncu` smallint DEFAULT NULL,
  `emergency` smallint DEFAULT NULL,
  `covid` smallint DEFAULT NULL,
  `extra` smallint DEFAULT NULL,
  PRIMARY KEY (`registration_no`),
  CONSTRAINT `capacity_fk0` FOREIGN KEY (`registration_no`) REFERENCES `hospital` (`registration_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `capacity` (`registration_no`, `total_capacity`, `ward`, `special_ward`, `cabin`, `vip_cabin`, `icu`, `ccu`, `hdu`, `hfncu`, `emergency`, `covid`, `extra`) VALUES
('0476608341',	125860,	26111,	30351,	53,	NULL,	18,	88,	23796,	NULL,	8524,	9655,	27265),
('2836314655',	31711,	30249,	2179,	102,	44,	90,	122,	14808,	NULL,	29239,	NULL,	5621),
('3360052309',	200,	7476,	26580,	19,	28,	2,	109,	NULL,	NULL,	9413,	14247,	22785),
('3613266758',	13438,	NULL,	2199,	118,	63,	100,	NULL,	NULL,	25234,	1940,	20627,	15761),
('3701043663',	5136,	5020,	17556,	44,	45,	56,	76,	22411,	3379,	21551,	NULL,	15613),
('3875193242',	31579,	NULL,	28340,	54,	94,	102,	NULL,	14826,	NULL,	1397,	32165,	29796),
('6895047952',	31911,	13720,	8038,	110,	49,	97,	108,	12698,	NULL,	29632,	23477,	1329),
('7503214296',	30798,	24352,	29828,	0,	28,	72,	119,	20481,	NULL,	14438,	29887,	24653),
('7531726902',	23949,	9613,	18429,	116,	23,	47,	82,	32234,	8281,	14603,	23418,	1960),
('7722788763',	6806,	28006,	18846,	36,	106,	26,	63,	NULL,	NULL,	12064,	NULL,	20294)
ON DUPLICATE KEY UPDATE `registration_no` = VALUES(`registration_no`), `total_capacity` = VALUES(`total_capacity`), `ward` = VALUES(`ward`), `special_ward` = VALUES(`special_ward`), `cabin` = VALUES(`cabin`), `vip_cabin` = VALUES(`vip_cabin`), `icu` = VALUES(`icu`), `ccu` = VALUES(`ccu`), `hdu` = VALUES(`hdu`), `hfncu` = VALUES(`hfncu`), `emergency` = VALUES(`emergency`), `covid` = VALUES(`covid`), `extra` = VALUES(`extra`);

DROP TABLE IF EXISTS `diagnostic_imaging_service`;
CREATE TABLE `diagnostic_imaging_service` (
  `registration_no` char(10) NOT NULL,
  `angiocardiography` tinyint(1) DEFAULT NULL,
  `angiography` tinyint(1) DEFAULT NULL,
  `cta` tinyint(1) DEFAULT NULL,
  `ct` tinyint(1) DEFAULT NULL,
  `coloscopy` tinyint(1) DEFAULT NULL,
  `cystoscopy` tinyint(1) DEFAULT NULL,
  `echocardiography` tinyint(1) DEFAULT NULL,
  `endoscopy` tinyint(1) DEFAULT NULL,
  `fluoroscopy` tinyint(1) DEFAULT NULL,
  `mra` tinyint(1) DEFAULT NULL,
  `mri` tinyint(1) DEFAULT NULL,
  `mrs` tinyint(1) DEFAULT NULL,
  `mammography` tinyint(1) DEFAULT NULL,
  `pet` tinyint(1) DEFAULT NULL,
  `pet_ct` tinyint(1) DEFAULT NULL,
  `spect` tinyint(1) DEFAULT NULL,
  `ultrasound` tinyint(1) DEFAULT NULL,
  `x_ray` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`registration_no`),
  CONSTRAINT `diagnostic_imaging_service_fk0` FOREIGN KEY (`registration_no`) REFERENCES `hospital` (`registration_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `diagnostic_imaging_service` (`registration_no`, `angiocardiography`, `angiography`, `cta`, `ct`, `coloscopy`, `cystoscopy`, `echocardiography`, `endoscopy`, `fluoroscopy`, `mra`, `mri`, `mrs`, `mammography`, `pet`, `pet_ct`, `spect`, `ultrasound`, `x_ray`) VALUES
('0476608341',	1,	0,	1,	1,	1,	1,	0,	0,	0,	0,	1,	0,	1,	1,	0,	0,	0,	1),
('2836314655',	1,	0,	1,	0,	1,	0,	0,	1,	0,	0,	NULL,	1,	0,	NULL,	1,	0,	1,	1),
('3360052309',	0,	1,	0,	1,	1,	1,	0,	0,	1,	1,	1,	0,	0,	1,	1,	0,	0,	0),
('3613266758',	1,	NULL,	1,	0,	1,	0,	NULL,	NULL,	0,	1,	0,	1,	NULL,	1,	0,	0,	1,	1),
('3701043663',	0,	1,	0,	1,	1,	1,	0,	0,	0,	0,	NULL,	1,	0,	0,	1,	0,	0,	0),
('3875193242',	1,	NULL,	0,	1,	0,	0,	NULL,	1,	0,	1,	0,	0,	1,	0,	0,	0,	NULL,	1),
('6895047952',	0,	1,	1,	0,	1,	0,	0,	0,	1,	0,	0,	1,	0,	1,	1,	1,	0,	1),
('7503214296',	1,	0,	0,	1,	1,	0,	0,	1,	1,	1,	0,	0,	0,	0,	0,	1,	1,	1),
('7531726902',	1,	1,	0,	0,	1,	1,	0,	0,	1,	1,	0,	1,	1,	0,	0,	0,	0,	0),
('7722788763',	0,	0,	0,	1,	0,	1,	1,	1,	0,	1,	NULL,	0,	NULL,	0,	1,	NULL,	0,	1)
ON DUPLICATE KEY UPDATE `registration_no` = VALUES(`registration_no`), `angiocardiography` = VALUES(`angiocardiography`), `angiography` = VALUES(`angiography`), `cta` = VALUES(`cta`), `ct` = VALUES(`ct`), `coloscopy` = VALUES(`coloscopy`), `cystoscopy` = VALUES(`cystoscopy`), `echocardiography` = VALUES(`echocardiography`), `endoscopy` = VALUES(`endoscopy`), `fluoroscopy` = VALUES(`fluoroscopy`), `mra` = VALUES(`mra`), `mri` = VALUES(`mri`), `mrs` = VALUES(`mrs`), `mammography` = VALUES(`mammography`), `pet` = VALUES(`pet`), `pet_ct` = VALUES(`pet_ct`), `spect` = VALUES(`spect`), `ultrasound` = VALUES(`ultrasound`), `x_ray` = VALUES(`x_ray`);

DROP TABLE IF EXISTS `doctor`;
CREATE TABLE `doctor` (
  `id` char(10) NOT NULL,
  `registration_no` char(10) NOT NULL,
  `name` varchar(50) NOT NULL,
  `designation` tinytext NOT NULL,
  `chamber` varchar(10) DEFAULT NULL,
  `bio` text,
  `joined_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`,`registration_no`,`joined_on`),
  KEY `doctor_fk0` (`registration_no`),
  CONSTRAINT `doctor_fk0` FOREIGN KEY (`registration_no`) REFERENCES `hospital` (`registration_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `doctor` (`id`, `registration_no`, `name`, `designation`, `chamber`, `bio`, `joined_on`) VALUES
('0476608341',	'3701043663',	'Dominick Neal',	'MBBS  Anesthesiology, Phd.  Gastrology, ',	'N10',	'Anne bought new car. Anne has free time. John bought new car. Tony has free time. John has free time. Tony has free time. John has free time. ',	'2018-07-19 01:04:13'),
('0523633769',	'0476608341',	'Damien Newman',	'Phd.  Nuclear Medicine, MSc.  Nuclear Medicine, Phd.  Dermatology, Phd.  Pediatrics, Phd.  Medicine, ',	NULL,	'John bought new car. Anne is walking. John has free time. Tony bought new car. ',	'2012-06-22 01:15:23'),
('0623422718',	'3360052309',	'Dwight Hayes',	'Phd.  Anesthesiology, Phd.  Anesthesiology, MBBS  Nuclear Medicine, Phd.  Neurology, Phd.  Gastrology, ',	'LK 813',	'Anne bought new car. Anne has free time. ',	'2010-04-22 04:25:24'),
('0815834759',	'6895047952',	'Jim Hoffman',	'MBBS  Dermatology, Phd.  Neurology, ',	NULL,	'John has free time. Tony has free time. John is shopping. John has free time. Tony has free time. ',	'2015-07-16 01:34:29'),
('1218274338',	'7722788763',	'Dena Mack',	'Phd.  Dermatology, MBBS  Dermatology, Phd.  Gastrology, Phd.  Immunology, ',	NULL,	'John has free time. Tony is shopping. John bought new car. Tony is shopping. Anne has free time. ',	'2018-07-08 03:00:13'),
('1581776073',	'6895047952',	'Abraham Gates',	'MSc.  Neurology, MSc.  Gastrology, MSc.  Anesthesiology, Phd.  Neurology, Phd.  Immunology, ',	'F85',	'John is walking. Anne has free time. Tony has free time. John has free time. Tony has free time. Tony has free time. Anne bought new car. Anne has free time. Anne is walking. ',	'2011-08-23 15:38:53'),
('2166619798',	'7503214296',	'Charlotte Lara',	'MBBS  Immunology, Phd.  Medicine, Phd.  Gastrology, ',	'L775',	'Anne has free time. John is shopping. Tony bought new car. John bought new car. Tony is walking. ',	'2010-06-30 04:49:01'),
('2476312570',	'7503214296',	'Chester Hutchinson',	'Phd.  Medicine, Phd.  Immunology, Phd.  Immunology, MSc.  Immunology, ',	'S15',	'Anne bought new car. Anne bought new car. Tony is shopping. John bought new car. Anne bought new car. John has free time. Tony is shopping. Tony bought new car. ',	'2014-01-30 19:22:14'),
('2621529756',	'3701043663',	'Milton Hatfield',	'Phd.  Gastrology, MSc.  Gastrology, Phd.  Pediatrics, ',	'T27',	'Anne bought new car. Anne bought new car. ',	'2016-08-19 00:00:33'),
('2633565232',	'7531726902',	'Darren Sanford',	'MSc.  Gastrology, MBBS  Gastrology, ',	'U526',	'Anne bought new car. Anne is walking. Tony has free time. John bought new car. John bought new car. John has free time. Tony is shopping. ',	'2013-05-05 20:25:13'),
('2662027526',	'3701043663',	'Esmeralda Vincent',	'Phd.  Immunology, Phd.  Medicine, ',	NULL,	'Tony is shopping. John is walking. Tony bought new car. John bought new car. Tony has free time. John has free time. John is shopping. Tony has free time. John is shopping. Tony has free time. ',	'2012-04-14 20:48:07'),
('2723947168',	'7503214296',	'Sharon O\'Neal',	'MBBS  Gastrology, MSc.  Immunology, Phd.  Pediatrics, MSc.  Gastrology, Phd.  Psychology, ',	NULL,	'John has free time. Tony bought new car. John bought new car. ',	'2015-08-14 23:23:06'),
('2836314655',	'3360052309',	'Cherie White',	'Phd.  Dermatology, MBBS  Dermatology, MBBS  Immunology, ',	'L33',	'Anne bought new car. Anne is shopping. Tony bought new car. John bought new car. ',	'2019-11-10 04:08:39'),
('2843529341',	'3875193242',	'Tisha Thompson',	'Phd.  Medicine, MBBS  Immunology, MSc.  Anesthesiology, ',	NULL,	'Anne has free time. Anne is walking. ',	'2011-07-14 04:25:59'),
('2868647371',	'3613266758',	'James Newman',	'Phd.  Immunology, MSc.  Dermatology, ',	'N 10',	'Tony bought new car. Anne bought new car. Tony bought new car. Tony has free time. John has free time. Tony is shopping. John is walking. Anne is shopping. Anne is shopping. ',	'2012-05-20 03:00:05'),
('3225572944',	'3875193242',	'Esmeralda Mejia',	'MSc.  Immunology, MBBS  Dermatology, Phd.  Anesthesiology, Phd.  Gastrology, Phd.  Immunology, ',	NULL,	'Tony has free time. John has free time. John has free time. ',	'2015-03-22 14:38:39'),
('3360052309',	'7503214296',	'Abraham Blackburn',	'MBBS  Medicine, MBBS  Gastrology, ',	'T38',	'John bought new car. John has free time. John is walking. ',	'2012-12-07 03:51:51'),
('3522977451',	'3701043663',	'Lara Haynes',	'MBBS  Anesthesiology, MSc.  Psychology, Phd.  Nuclear Medicine, Phd.  Immunology, Phd.  Dermatology, ',	NULL,	'Anne bought new car. Anne bought new car. John bought new car. John bought new car. John has free time. Tony has free time. John has free time. ',	'2019-11-15 19:27:29'),
('3551723362',	'7503214296',	'Shelley Garrett',	'MBBS  Nuclear Medicine, MBBS  Immunology, Phd.  Immunology, Phd.  Anesthesiology, Phd.  Gastrology, ',	NULL,	'Tony has free time. Anne is shopping. John bought new car. John has free time. John bought new car. Tony has free time. Anne has free time. Anne is walking. Anne bought new car. John bought new car. ',	'2014-07-12 13:55:42'),
('3613266758',	'6895047952',	'Lynn Miles',	'MSc.  Medicine, MSc.  Medicine, Phd.  Pediatrics, Phd.  Gastrology, Phd.  Immunology, ',	'Q 26',	'Anne bought new car. Anne bought new car. ',	'2010-01-15 22:16:11'),
('3701043663',	'2836314655',	'Ebony Daniels',	'Phd.  Immunology, Phd.  Nuclear Medicine, ',	NULL,	'Tony bought new car. Anne is walking. ',	'2010-05-02 07:23:29'),
('3763785721',	'3875193242',	'Derrick Huffman',	'MBBS  Medicine, MSc.  Dermatology, ',	'J12',	'Anne is walking. Anne is walking. John has free time. John has free time. Tony has free time. Tony bought new car. Tony has free time. John has free time. Tony bought new car. Tony has free time. ',	'2010-07-26 23:46:24'),
('3865675284',	'3613266758',	'Clarissa Dunlap',	'Phd.  Medicine, MSc.  Neurology, Phd.  Immunology, Phd.  Immunology, Phd.  Dermatology, ',	NULL,	'Tony has free time. Anne has free time. Tony has free time. Tony bought new car. ',	'2012-10-01 21:42:46'),
('3875193242',	'7531726902',	'Debra Middleton',	'MSc.  Gastrology, MSc.  Immunology, Phd.  Pathology, MBBS  Neurology, Phd.  Medicine, ',	'R20',	'Tony bought new car. Anne is shopping. Anne is walking. ',	'2019-03-26 00:01:35'),
('3880066048',	'0476608341',	'Otis Rodgers',	'MBBS  Neurology, MSc.  Neurology, Phd.  Psychology, ',	NULL,	'Anne bought new car. Tony is walking. John bought new car. Anne has free time. John has free time. John bought new car. Tony has free time. John has free time. Anne bought new car. Tony is walking. ',	'2012-04-12 23:34:56'),
('4073242581',	'0476608341',	'Tonya Combs',	'MBBS  Medicine, Phd.  Anesthesiology, MSc.  Anesthesiology, Phd.  Gastrology, MSc.  Immunology, ',	'H03',	'Tony bought new car. Anne has free time. Tony is shopping. ',	'2011-02-09 16:35:58'),
('5061607426',	'7531726902',	'Marlon Newton',	'Phd.  Gastrology, Phd.  Gastrology, Phd.  Anesthesiology, Phd.  Medicine, Phd.  Pediatrics, ',	'P988',	'Tony has free time. Anne has free time. John bought new car. Tony has free time. John has free time. ',	'2013-07-10 16:10:04'),
('5648618374',	'3701043663',	'Bobbi Larson',	'Phd.  Medicine, MBBS  Gastrology, Phd.  Pediatrics, ',	'X 91',	'Anne bought new car. Anne is shopping. ',	'2016-09-27 09:21:57'),
('5876444420',	'7531726902',	'Dewayne Glenn',	'MSc.  Dermatology, Phd.  Dermatology, Phd.  Pediatrics, MBBS  Gastrology, Phd.  Gastrology, ',	NULL,	'John is shopping. John is shopping. John bought new car. Tony bought new car. John bought new car. Tony has free time. Tony has free time. ',	'2019-08-21 23:51:42'),
('6212634266',	'2836314655',	'Deanna Hicks',	'MSc.  Neurology, Phd.  Medicine, Phd.  Anesthesiology, ',	'A 16',	'Anne bought new car. John is walking. Anne bought new car. Tony has free time. Anne is walking. John has free time. ',	'2017-12-19 19:05:46'),
('6272515348',	'2836314655',	'Stephan Park',	'MSc.  Gastrology, MSc.  Nuclear Medicine, Phd.  Neurology, Phd.  Medicine, ',	'Y 384',	'Anne is walking. John is walking. John is walking. Tony bought new car. John has free time. Anne has free time. John has free time. Anne has free time. Tony bought new car. Anne has free time. ',	'2019-12-08 16:38:59'),
('6393470482',	'7503214296',	'Rose Moreno',	'Phd.  Gastrology, Phd.  Immunology, Phd.  Gastrology, Phd.  Nuclear Medicine, Phd.  Nuclear Medicine, ',	'J987',	'Tony has free time. John has free time. John bought new car. Tony is shopping. Tony has free time. Anne has free time. ',	'2015-03-14 14:40:26'),
('6442833247',	'2836314655',	'Clyde Flowers',	'Phd.  Dermatology, MBBS  Pathology, Phd.  Nuclear Medicine, Phd.  Dermatology, Phd.  Dermatology, ',	'N47',	'Tony bought new car. Anne has free time. Tony bought new car. Tony has free time. Anne bought new car. Tony is walking. John bought new car. John has free time. Anne has free time. John has free time. ',	'2015-10-28 05:00:30'),
('6505377020',	'0476608341',	'Roxanne Ellison',	'MBBS  Immunology, Phd.  Nuclear Medicine, Phd.  Dermatology, ',	'Q26',	'Anne has free time. John is walking. Anne is shopping. John bought new car. John is shopping. John has free time. John is walking. Tony bought new car. ',	'2010-09-30 21:31:42'),
('6523244116',	'3875193242',	'Kendall Ryan',	'Phd.  Anesthesiology, MBBS  Nuclear Medicine, ',	'MC 548',	'John is shopping. Anne bought new car. ',	'2018-05-27 13:49:57'),
('6536417767',	'3613266758',	'Manuel Mcfarland',	'MSc.  Gastrology, MBBS  Neurology, Phd.  Nuclear Medicine, MBBS  Dermatology, Phd.  Pediatrics, ',	NULL,	'Anne is walking. John is walking. Tony has free time. Tony has free time. ',	'2011-09-19 07:33:13'),
('6591978956',	'3360052309',	'Ramona Hess',	'MBBS  Dermatology, Phd.  Gastrology, Phd.  Pediatrics, Phd.  Pediatrics, MSc.  Gastrology, ',	'Y11',	'John is shopping. John bought new car. Tony is shopping. Tony is walking. ',	'2016-11-30 16:12:22'),
('6726111135',	'3360052309',	'Tammy Fletcher',	'Phd.  Nuclear Medicine, MBBS  Dermatology, Phd.  Gastrology, Phd.  Psychology, Phd.  Medicine, ',	'O91',	'Tony has free time. John is walking. ',	'2014-10-05 01:05:36'),
('6895047952',	'6895047952',	'Charlotte Byrd',	'MSc.  Immunology, MBBS  Anesthesiology, Phd.  Gastrology, Phd.  Dermatology, Phd.  Gastrology, ',	'S 30',	'Tony bought new car. Anne has free time. Tony has free time. Tony has free time. Tony has free time. Anne bought new car. John is shopping. ',	'2019-01-05 20:04:59'),
('7373390625',	'7503214296',	'Randall Morrison',	'MBBS  Anesthesiology, MSc.  Neurology, Phd.  Dermatology, ',	'Z72',	'Tony is shopping. John is walking. John bought new car. Tony has free time. John has free time. John bought new car. Anne is shopping. Tony has free time. Tony bought new car. ',	'2017-11-07 11:26:01'),
('7503214296',	'7722788763',	'Erich Ingram',	'MBBS  Gastrology, Phd.  Nuclear Medicine, Phd.  Neurology, Phd.  Nuclear Medicine, Phd.  Pediatrics, ',	NULL,	'John bought new car. Anne is walking. Anne has free time. Anne has free time. Anne has free time. John is walking. John is shopping. John has free time. ',	'2014-12-20 03:30:15'),
('7531726902',	'7531726902',	'Stephen Cisneros',	'MBBS  Neurology, MSc.  Nuclear Medicine, Phd.  Anesthesiology, Phd.  Dermatology, Phd.  Nuclear Medicine, ',	'C444',	'Anne bought new car. Tony is shopping. John is shopping. John is walking. Anne bought new car. Tony is shopping. John has free time. Tony bought new car. John bought new car. Tony bought new car. ',	'2017-04-23 21:34:03'),
('7582541403',	'3360052309',	'Randal Patterson',	'Phd.  Dermatology, MSc.  Gastrology, Phd.  Gastrology, Phd.  Pediatrics, ',	'HO 239',	'Anne has free time. Tony bought new car. John has free time. Tony has free time. John has free time. Tony has free time. ',	'2013-10-10 10:47:47'),
('7687729880',	'0476608341',	'Emily Matthews',	'MBBS  Gastrology, Phd.  Immunology, Phd.  Anesthesiology, ',	NULL,	'Anne has free time. Anne is walking. ',	'2017-06-06 18:17:06'),
('7722788763',	'0476608341',	'Arthur Barrera',	'MSc.  Immunology, Phd.  Gastrology, MSc.  Immunology, ',	NULL,	'John is shopping. Anne has free time. Tony has free time. ',	'2018-07-27 23:12:33'),
('7782283776',	'3875193242',	'Audrey Beltran',	'Phd.  Immunology, MBBS  Anesthesiology, ',	NULL,	'Tony has free time. Anne is walking. John is walking. ',	'2019-06-29 01:33:11'),
('8302743036',	'3701043663',	'Joyce Carlson',	'Phd.  Dermatology, Phd.  Immunology, Phd.  Dermatology, ',	'K99',	'Anne bought new car. Tony bought new car. ',	'2015-12-07 14:15:47'),
('8388654122',	'0476608341',	'Owen George',	'MBBS  Medicine, MSc.  Gastrology, Phd.  Pediatrics, MBBS  Medicine, MSc.  Immunology, ',	'QU 741',	'Tony bought new car. Anne bought new car. John is shopping. John bought new car. John has free time. Tony has free time. ',	'2019-06-30 15:04:20'),
('8517042952',	'7531726902',	'Clarissa Mills',	'MSc.  Nuclear Medicine, Phd.  Dermatology, Phd.  Psychology, ',	'H587',	'Tony bought new car. Anne bought new car. John has free time. John has free time. John has free time. ',	'2016-04-13 16:00:06'),
('8833646426',	'3613266758',	'Tracey Mcgrath',	'MSc.  Gastrology, MBBS  Gastrology, MSc.  Pathology, MBBS  Gastrology, MSc.  Gastrology, ',	'R65',	'Tony has free time. John has free time. ',	'2018-07-06 11:44:45')
ON DUPLICATE KEY UPDATE `id` = VALUES(`id`), `registration_no` = VALUES(`registration_no`), `name` = VALUES(`name`), `designation` = VALUES(`designation`), `chamber` = VALUES(`chamber`), `bio` = VALUES(`bio`), `joined_on` = VALUES(`joined_on`);

DROP TABLE IF EXISTS `general_service`;
CREATE TABLE `general_service` (
  `registration_no` char(10) NOT NULL,
  `autopsy` tinyint(1) DEFAULT NULL,
  `biopsy` tinyint(1) DEFAULT NULL,
  `blood_bank` tinyint(1) DEFAULT NULL,
  `bronchoscopy` tinyint(1) DEFAULT NULL,
  `ecg` tinyint(1) DEFAULT NULL,
  `echocardiography` tinyint(1) DEFAULT NULL,
  `emg` tinyint(1) DEFAULT NULL,
  `laparoscopy` tinyint(1) DEFAULT NULL,
  `phonocardiography` tinyint(1) DEFAULT NULL,
  `urinalysis` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`registration_no`),
  CONSTRAINT `general_service_fk0` FOREIGN KEY (`registration_no`) REFERENCES `hospital` (`registration_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `general_service` (`registration_no`, `autopsy`, `biopsy`, `blood_bank`, `bronchoscopy`, `ecg`, `echocardiography`, `emg`, `laparoscopy`, `phonocardiography`, `urinalysis`) VALUES
('0476608341',	1,	0,	1,	1,	0,	1,	1,	1,	0,	0),
('2836314655',	1,	0,	1,	0,	1,	0,	1,	0,	0,	NULL),
('3360052309',	0,	1,	0,	1,	1,	1,	0,	1,	1,	1),
('3613266758',	1,	NULL,	1,	0,	1,	0,	NULL,	0,	1,	0),
('3701043663',	0,	1,	0,	1,	1,	1,	0,	0,	0,	NULL),
('3875193242',	1,	NULL,	0,	1,	0,	0,	1,	0,	1,	0),
('6895047952',	0,	1,	1,	0,	1,	0,	0,	1,	0,	0),
('7503214296',	1,	0,	0,	1,	1,	0,	1,	1,	1,	0),
('7531726902',	1,	1,	0,	0,	1,	1,	0,	1,	1,	0),
('7722788763',	0,	0,	0,	1,	0,	1,	1,	0,	1,	NULL)
ON DUPLICATE KEY UPDATE `registration_no` = VALUES(`registration_no`), `autopsy` = VALUES(`autopsy`), `biopsy` = VALUES(`biopsy`), `blood_bank` = VALUES(`blood_bank`), `bronchoscopy` = VALUES(`bronchoscopy`), `ecg` = VALUES(`ecg`), `echocardiography` = VALUES(`echocardiography`), `emg` = VALUES(`emg`), `laparoscopy` = VALUES(`laparoscopy`), `phonocardiography` = VALUES(`phonocardiography`), `urinalysis` = VALUES(`urinalysis`);

DROP TABLE IF EXISTS `hospital`;
CREATE TABLE `hospital` (
  `registration_no` char(10) NOT NULL,
  `hospital_name` varchar(100) NOT NULL,
  `description` text,
  `hospital_type` enum('Public','Private') NOT NULL,
  `bed_type` set('Ward','Special Ward','Cabin','VIP Cabin','ICU','CCU','HDU','HFNCU','Emergency','COVID','Extra') NOT NULL,
  `image_source` varchar(500) NOT NULL,
  `website` tinytext,
  `joined_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('public','private','deleted') NOT NULL DEFAULT 'private',
  PRIMARY KEY (`registration_no`),
  UNIQUE KEY `hospital_name` (`hospital_name`),
  UNIQUE KEY `image_source` (`image_source`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `hospital` (`registration_no`, `hospital_name`, `description`, `hospital_type`, `bed_type`, `image_source`, `website`, `joined_on`, `status`) VALUES
('0476608341',	'Zeerobedor Hospital',	'John has free time. Anne has free time. John bought new car. Anne bought new car. Anne is shopping. Tony bought new car. ',	'Private',	'Ward,Special Ward,ICU,CCU,HDU,Emergency',	'tmtdt.asm',	NULL,	'2015-05-26 00:01:10',	'public'),
('2836314655',	'Parvenepicator Matrimonial Hospital',	'Anne is shopping. Anne has free time. Tony bought new car. Anne is shopping. John has free time. Tony is walking. John is walking. John has free time. John has free time. Anne has free time. Anne is shopping. Tony has free time. John has free time. Tony has free time. John has free time. Anne has free time. Tony has free time. Tony is walking. Tony has free time. ',	'Private',	'Ward,Special Ward,Cabin,ICU,Emergency,COVID',	'oqu.xls',	'https://kzckv.netx/qpnol/vbx.htm',	'2019-11-15 00:13:30',	'private'),
('3360052309',	'Klibanollover Hospital',	'Tony has free time. Tony is shopping. Anne has free time. John has free time. John has free time. John bought new car. John bought new car. Tony has free time. Anne is walking. John has free time. ',	'Public',	'Cabin,VIP Cabin,ICU,HDU,HFNCU,COVID',	'sii.asm',	'https://xyv.local6/bccfs/kkd.aspx',	'2017-01-09 09:27:49',	'public'),
('3613266758',	'Unkiledax Kidney Hospital',	'Tony bought new car. Tony bought new car. Anne bought new car. Tony is shopping. John is shopping. John is shopping. Tony has free time. Anne is shopping. Tony is shopping. John has free time. John has free time. John is walking. John bought new car. John has free time. Anne has free time. Anne has free time. ',	'Public',	'VIP Cabin,ICU,CCU,Emergency,COVID,Extra',	'vmsmdp.xls',	'https://ezqdl.locall/btkki/wdujd/grs.htm',	'2010-02-08 10:32:20',	'public'),
('3701043663',	'Endglibamentor Hospital',	'Tony bought new car. John bought new car. John has free time. Anne bought new car. Anne is shopping. Tony is shopping. John is walking. ',	'Private',	'Cabin,HFNCU,Emergency,Extra',	'rlk.bmp',	'https://shjba.netf39/csjkv/dqrfq.htm',	'2018-03-03 11:17:21',	'public'),
('3875193242',	'Luke Hospital ',	'Tony is walking. Anne is shopping. Anne has free time. John bought new car. Anne is shopping. John has free time. Anne has free time. Tony has free time. Anne has free time. ',	'Public',	'Special Ward,Cabin,VIP Cabin,HFNCU',	'cmlmsho.xls',	'https://ykbf.localo9/vvhsr/ixdq.htm',	'2016-04-05 14:14:01',	'public'),
('6895047952',	'Klierplar Neurology Hospital',	'John is shopping. Anne is walking. Tony has free time. Anne bought new car. John is walking. ',	'Private',	'Cabin,ICU,CCU,HDU,HFNCU',	'frc.asm',	'https://oaq.local/sjqzy/gvb.php',	'2018-03-29 21:55:25',	'public'),
('7503214296',	'Frozapanor Hospital of Neuroscience',	'Anne is walking. Anne is shopping. Anne bought new car. John is shopping. Anne is walking. John has free time. ',	'Private',	'Special Ward,HFNCU,Emergency,COVID',	'zjy.pdf',	'https://cjr.net/olisy/jtr.aspx',	'2013-10-31 06:12:04',	'deleted'),
('7531726902',	'Rapzapin Pediatric Hospital',	'Anne is walking. Anne has free time. Anne has free time. Tony bought new car. Tony is walking. Anne bought new car. John bought new car. Tony has free time. John is shopping. ',	'Public',	'Ward,Special Ward,ICU,HDU,Extra',	'epyvl.bmp',	'https://uun.net57/gufes/kdlgj/ciip.aspx',	'2018-01-14 16:45:51',	'public'),
('7722788763',	'Inhupimentor Baby-Care Hospital',	'John bought new car. Anne is shopping. John bought new car. John is walking. Anne is shopping. Tony bought new car. ',	'Private',	'Ward,Cabin,ICU,HDU,Emergency',	'lnvd.doc',	'https://yghrz.net/cdinc/dohn.php',	'2017-10-16 04:56:15',	'public')
ON DUPLICATE KEY UPDATE `registration_no` = VALUES(`registration_no`), `hospital_name` = VALUES(`hospital_name`), `description` = VALUES(`description`), `hospital_type` = VALUES(`hospital_type`), `bed_type` = VALUES(`bed_type`), `image_source` = VALUES(`image_source`), `website` = VALUES(`website`), `joined_on` = VALUES(`joined_on`), `status` = VALUES(`status`);

DROP TABLE IF EXISTS `log`;
CREATE TABLE `log` (
  `logged_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mobile_no` char(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `registration_no` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `task` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `role` enum('Admin','DB Manager','Moderator') NOT NULL,
  PRIMARY KEY (`logged_at`,`registration_no`),
  KEY `log_fk0` (`registration_no`),
  KEY `log_fk1` (`mobile_no`),
  CONSTRAINT `log_fk0` FOREIGN KEY (`registration_no`) REFERENCES `hospital` (`registration_no`),
  CONSTRAINT `log_fk1` FOREIGN KEY (`mobile_no`) REFERENCES `staff` (`mobile_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `schedule`;
CREATE TABLE `schedule` (
  `id` char(10) NOT NULL,
  `day` enum('R','S','M','T','W','A','F') NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `last_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`,`day`),
  CONSTRAINT `schedule_fk0` FOREIGN KEY (`id`) REFERENCES `doctor` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `staff`;
CREATE TABLE `staff` (
  `mobile_no` char(14) NOT NULL,
  `password` char(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `role` enum('Admin','DB Manager','Moderator') NOT NULL,
  `status` enum('Active','Inactive') NOT NULL,
  `registration_no` char(10) NOT NULL,
  `joined_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`mobile_no`,`registration_no`,`joined_on`),
  UNIQUE KEY `email` (`email`),
  KEY `staff_fk0` (`registration_no`),
  CONSTRAINT `staff_fk0` FOREIGN KEY (`registration_no`) REFERENCES `hospital` (`registration_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `staff` (`mobile_no`, `password`, `name`, `email`, `role`, `status`, `registration_no`, `joined_on`, `last_updated`) VALUES
('+8801123947168',	'4GA1NXH512T780774',	'Martha Mora',	'wctq7@odoozekrnxtfj.net',	'Admin',	'Inactive',	'7722788763',	'2020-01-05 12:50:49',	'2021-12-15 09:24:21'),
('+8801125707782',	'3GANSIF717L856815',	'Troy Kaufman',	'qyqv8@jictvnrixv.org',	'Moderator',	'Active',	'3360052309',	'2011-04-28 16:24:24',	'2021-12-15 09:24:21'),
('+8801125816591',	'WGXNRJ4B15M504766',	'Tonya Shelton',	'vner98@ykfcur.com',	'Moderator',	'Active',	'3875193242',	'2019-11-22 13:31:01',	'2021-12-15 09:24:21'),
('+8801125828005',	'WJXT0M4I16J448238',	'Ben Cruz',	'xaadfb@jlibnp.org',	'DB Manager',	'Inactive',	'3701043663',	'2018-01-07 06:37:40',	'2021-12-15 09:24:21'),
('+8801126620275',	'WWA2P77314L625434',	'Marlene Mack',	'iamuhn7@moflijhxhm.com',	'Moderator',	'Inactive',	'3875193242',	'2016-07-10 19:49:48',	'2021-12-15 09:24:21'),
('+8801126675875',	'WFA43LN513H888817',	'Alfredo Yates',	'tmtd.uixaoqu@umcrlk.com',	'Moderator',	'Inactive',	'6895047952',	'2020-07-15 20:17:00',	'2021-12-15 09:24:21'),
('+8801127787165',	'WKSBFDTW11J799073',	'Omar Merritt',	'lqxc7@gdsrmxxksapc.net',	'Moderator',	'Active',	'7531726902',	'2017-08-25 12:22:50',	'2021-12-15 09:24:21'),
('+8801129522415',	'WNSV721V10J130412',	'Debra Hale',	'qpnhv484@nnbblrskuand.org',	'DB Manager',	'Active',	'7531726902',	'2014-07-16 01:41:33',	'2021-12-15 09:24:21'),
('+8801131522914',	'WRSC0K4B15Y325207',	'Tracy Odom',	'kywe6@vboujmxfukvk.com',	'Moderator',	'Inactive',	'3701043663',	'2017-04-11 23:22:10',	'2021-12-15 09:24:21'),
('+8801148564861',	'WDX6J9S515K965371',	'Cheryl Johns',	'jhvsk5@pjghxk.com',	'Admin',	'Inactive',	'7503214296',	'2019-04-23 17:37:06',	'2021-12-15 09:24:21'),
('+8801150616074',	'4XS33C4718T829554',	'Rodney Burton',	'nwev.mdyc@kiuiyuhmli.org',	'Moderator',	'Inactive',	'0476608341',	'2012-03-04 07:25:45',	'2021-12-15 09:24:21'),
('+8801152326726',	'2TAY35X514S154978',	'Aimee Sampson',	'oookp6@pysduxsolf.org',	'Admin',	'Inactive',	'3360052309',	'2014-12-29 20:40:28',	'2021-12-15 09:24:21'),
('+8801156807737',	'3JXSD24U12I315991',	'Susan Petersen',	'hxgf.paat@drdhdolsks.org',	'Moderator',	'Inactive',	'3613266758',	'2020-01-03 19:17:43',	'2021-12-15 09:24:21'),
('+8801157294462',	'2NS185I716X208245',	'Joni Shaffer',	'eexj@kdxflj.com',	'Moderator',	'Active',	'3360052309',	'2018-04-26 23:57:03',	'2021-12-15 09:24:21'),
('+8801161979865',	'WVAU6Y1515S619418',	'Cara Carney',	'ynbi.xcmle@fjuwkb.com',	'Moderator',	'Inactive',	'3613266758',	'2013-11-29 12:42:33',	'2021-12-15 09:24:21'),
('+8801165675284',	'2RXYJSW314K095542',	'Rodolfo Turner',	'pbfo.uldo@xwrtqc.net',	'DB Manager',	'Active',	'6895047952',	'2016-11-10 00:22:29',	'2021-12-15 09:24:21'),
('+8801169023360',	'WUAO8JC418S501454',	'Devon Vasquez',	'epyv4@jvmsii.com',	'Moderator',	'Active',	'7531726902',	'2018-09-26 15:11:24',	'2021-12-15 09:24:21'),
('+8801173733906',	'4RSY3E6511M733827',	'James Cobb',	'mlfy7@ibwfteriwptl.com',	'DB Manager',	'Inactive',	'0476608341',	'2018-11-12 01:18:24',	'2021-12-15 09:24:21'),
('+8801176877298',	'4CA01Q6214A354802',	'Frances Curry',	'dlmg261@wczzfdymnl.org',	'Admin',	'Inactive',	'7503214296',	'2015-10-17 00:55:42',	'2021-12-15 09:24:21'),
('+8801183538447',	'WQS5555018T046953',	'Victoria Gross',	'ptod24@vhgmnvbfeov.org',	'Admin',	'Inactive',	'3701043663',	'2013-06-02 13:46:56',	'2021-12-15 09:24:21'),
('+8801197745135',	'WCSBL5C219X531750',	'Tia Townsend',	'oirq6@gbvpjv.net',	'Admin',	'Active',	'2836314655',	'2011-05-09 09:32:46',	'2021-12-15 09:24:21'),
('+8801366873365',	'3UA1D88A13Z737756',	'Jared Villegas',	'lcse8@dfuvrl.net',	'Moderator',	'Active',	'3875193242',	'2012-08-14 19:31:08',	'2021-12-15 09:24:21'),
('+8801394445316',	'5KXUG11815A710454',	'Debra Olsen',	'gfjuo.asusi@ahcgdqbccbf.com',	'Admin',	'Inactive',	'3613266758',	'2012-10-24 20:36:22',	'2021-12-15 09:24:21'),
('+8801422081583',	'2OXLOTGF10X356946',	'Darnell Reyes',	'jtxz@dfrbwo.com',	'Moderator',	'Inactive',	'7503214296',	'2016-07-02 08:39:50',	'2021-12-15 09:24:21'),
('+8801453380268',	'1FAH744714U952777',	'Roderick Cisneros',	'cdxrb83@dmpdbo.net',	'Admin',	'Active',	'7531726902',	'2021-03-14 07:25:54',	'2021-12-15 09:24:21'),
('+8801538751932',	'WFSH41P513K211467',	'Tom Fowler',	'nwrs55@yyhdwnzlqt.net',	'Moderator',	'Inactive',	'3360052309',	'2021-06-07 03:56:41',	'2021-12-15 09:24:21'),
('+8801541262152',	'WVA26U3615B410574',	'Brenda Bean',	'xynwu@fvrsmqhpkeg.org',	'Moderator',	'Active',	'3701043663',	'2018-02-17 23:07:33',	'2021-12-15 09:24:21'),
('+8801562388006',	'5TSW4L4C17W792979',	'Ramiro Ramsey',	'abwk3@sjtgdc.com',	'DB Manager',	'Inactive',	'0476608341',	'2020-01-26 12:49:40',	'2021-12-15 09:24:21'),
('+8801563376983',	'WJAXWR3D14O451581',	'Kate Tate',	'heqc.luro@ursjjp.com',	'Admin',	'Active',	'0476608341',	'2013-05-31 13:55:30',	'2021-12-15 09:24:21'),
('+8801593470482',	'1KSP3S9T14K823810',	'Jodie Reeves',	'ihkbcc84@avpjtw.com',	'Moderator',	'Active',	'7531726902',	'2020-10-07 15:02:14',	'2021-12-15 09:24:21'),
('+8801596047660',	'5GS0KP3612H133913',	'Demond Chandler',	'lnvdr@jhcmlmshoqg.org',	'Moderator',	'Active',	'6895047952',	'2011-01-16 19:30:55',	'2021-12-15 09:24:21'),
('+8801603376378',	'12345',	'Vicki Meyer',	'iord@bowtkg.inc',	'DB Manager',	'Active',	'0476608341',	'2021-01-17 21:20:32',	'2021-12-15 09:24:21'),
('+8801636637722',	'3PA7612712J387117',	'Ron Joseph',	'fkvnzo9@uaxcqplutoknm.com',	'Moderator',	'Active',	'3701043663',	'2020-01-17 02:12:02',	'2021-12-15 09:24:21'),
('+8801664268302',	'WES48B6513K748621',	'Kisha Browning',	'cnol@cyscwyxvetrqobf.org',	'Moderator',	'Active',	'7531726902',	'2014-09-23 17:34:46',	'2021-12-15 09:24:21'),
('+8801676987367',	'0842e8cde6cc91d2f8ef',	'Ali Aqbar',	'7u4hf@wimsg.com',	'Moderator',	'Inactive',	'0476608341',	'2021-08-29 23:47:42',	'2021-12-15 09:24:21'),
('+8801680242747',	'WNS068TF10A732797',	'Sheldon Donovan',	'yxmz.bwma@lpnjczdwemae.com',	'DB Manager',	'Active',	'2836314655',	'2017-02-28 05:35:07',	'2021-12-15 09:24:21'),
('+8801689317455',	'WASEUCJB12L129752',	'Efrain Hall',	'zwcq95@eqtsdlcubxljcmx.com',	'Moderator',	'Inactive',	'7503214296',	'2011-07-10 17:24:30',	'2021-12-15 09:24:21'),
('+8801714441372',	'1KSK458518M213335',	'Bennie Mc Bride',	'lzxl8@hzcqgzbfxfa.net',	'Moderator',	'Active',	'3360052309',	'2016-01-14 10:19:20',	'2021-12-15 09:24:21'),
('+8801716720550',	'5IS31K6U19H532695',	'Trina Alexander',	'dexl78@iitgqr.com',	'Moderator',	'Inactive',	'2836314655',	'2019-06-07 12:31:05',	'2021-12-15 09:24:21'),
('+8801762126342',	'3SS665O314M881437',	'Michelle Hays',	'imbro.xomc@jewzjpdpcqx.com',	'Admin',	'Inactive',	'3875193242',	'2011-08-08 01:51:52',	'2021-12-15 09:24:21'),
('+8801781250159',	'WKAJ34A117X106451',	'Sonny Frank',	'fzhf@mrdhcylrwn.com',	'DB Manager',	'Active',	'6895047952',	'2012-09-26 15:22:45',	'2021-12-15 09:24:21'),
('+8801781776073',	'3UX8R32P14I868224',	'Stacey Soto',	'bgmg92@itmrvombaq.com',	'Admin',	'Active',	'3875193242',	'2021-01-16 05:38:17',	'2021-12-15 09:24:21'),
('+8801846494721',	'1PSO3FWI10P285281',	'Willie Davis',	'oiuhrho2@fmnymp.net',	'Moderator',	'Inactive',	'3613266758',	'2013-07-09 21:20:10',	'2021-12-15 09:24:21'),
('+8801867644283',	'WBS173BQ19L832433',	'Annie Lucas',	'zkoum.ckile@ovvtesrnmu.com',	'DB Manager',	'Inactive',	'7503214296',	'2015-04-27 18:31:26',	'2021-12-15 09:24:21'),
('+8801870206523',	'1SA78RZ911L920228',	'Tomas Logan',	'ulof41@txproncnlx.com',	'Admin',	'Inactive',	'3701043663',	'2021-06-13 03:09:00',	'2021-12-15 09:24:21'),
('+8801876444420',	'2XS9XNBY14V372002',	'Jerome Pierce',	'idvw@jkyzyf.com',	'DB Manager',	'Inactive',	'7503214296',	'2016-12-11 16:02:47',	'2021-12-15 09:24:21'),
('+8801964737128',	'5FSH8C6N14O730722',	'Juan Cisneros',	'fvma8@pyuoyw.com',	'Moderator',	'Active',	'2836314655',	'2021-07-07 08:22:20',	'2021-12-15 09:24:21'),
('+8801968950479',	'4KS871DI13J114342',	'Gabriel Luna',	'frcmm.ivmsmdp@siezjy.org',	'Admin',	'Inactive',	'7503214296',	'2014-02-07 15:36:19',	'2021-12-15 09:24:21')
ON DUPLICATE KEY UPDATE `mobile_no` = VALUES(`mobile_no`), `password` = VALUES(`password`), `name` = VALUES(`name`), `email` = VALUES(`email`), `role` = VALUES(`role`), `status` = VALUES(`status`), `registration_no` = VALUES(`registration_no`), `joined_on` = VALUES(`joined_on`), `last_updated` = VALUES(`last_updated`);

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `mobile_no` char(14) NOT NULL,
  `password` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `sex` enum('M','F','T','S') NOT NULL,
  `dob` date NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `document_id` char(17) DEFAULT NULL,
  `joined_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`mobile_no`),
  UNIQUE KEY `document_id` (`document_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `user` (`mobile_no`, `password`, `name`, `sex`, `dob`, `email`, `document_id`, `joined_on`) VALUES
('+8801123422718',	'7c222fb2927d828af22f592134e8932480637c0d',	'Harry Brennan',	'S',	'2001-01-21',	'ffmc@jpqaga.com',	'78668689678315818',	'2019-11-04 21:10:06'),
('+8801125816591',	'4BAO0JC218G648511',	'Luz Bass',	'F',	'1980-05-02',	'vner98@ykfcur.com',	'2043938600',	'2018-01-25 06:34:47'),
('+8801126675875',	'3DX2849512D295923',	'Lakeisha Montes',	'F',	'2005-06-12',	'tmtd.uixaoqu@umcrlk.com',	'2721744142',	'2018-09-04 17:41:35'),
('+8801127433875',	'2UA3S8BD19Y372468',	'Byron Boone',	'F',	'1992-03-02',	'tvnp@qpqixmtfolez.com',	'44625655050315520',	'2017-12-14 10:31:54'),
('+8801165675284',	'WJX2317U15L323016',	'Anthony Martin',	'M',	'1986-03-22',	'pbfo.uldo@xwrtqc.net',	'01549148189283655',	'2011-04-08 02:59:49'),
('+8801169023360',	'WKA6S1EO14X138550',	'Latoya Spencer',	'M',	'1998-03-10',	'epyv4@jvmsii.com',	'JF7260617',	'2018-06-18 14:33:44'),
('+8801173733906',	'WNAQ7HEJ18C538586',	'Salvatore Morse',	'M',	'1975-11-02',	'mlfy7@ibwfteriwptl.com',	'6843656327',	'2010-12-18 18:27:51'),
('+8801176877298',	'3KSB654M14L735543',	'Ruby Robinson',	'T',	'2002-11-24',	'dlmg261@wczzfdymnl.org',	'8345263162',	'2021-01-12 11:39:35'),
('+8801197745135',	'WPX6OOFZ18V728725',	'Hector Dickson',	'F',	'1980-12-22',	'oirq6@gbvpjv.net',	'MJ1424314',	'2018-08-07 21:34:34'),
('+8801422081583',	'WKS41YRW15Q301955',	'Duane Dickerson',	'M',	'2000-11-01',	'jtxz@dfrbwo.com',	'2421265561',	'2012-12-04 12:18:20'),
('+8801538751932',	'WJSG0VN618U843315',	'Howard Randall',	'S',	'1996-03-21',	'nwrs55@yyhdwnzlqt.net',	'7887198252',	'2020-05-23 05:34:19'),
('+8801562388006',	'2BSOXSQA18T358224',	'Vernon Rodgers',	'S',	'1973-01-09',	'abwk3@sjtgdc.com',	'GI5064782',	'2018-03-15 08:08:36'),
('+8801563376983',	'WBS64E4Z11X481243',	'Joni Larsen',	'S',	'1996-12-23',	'heqc.luro@ursjjp.com',	'8141073437817',	'2011-05-26 11:07:06'),
('+8801593470482',	'3BXH7N4814C516870',	'Mike Finley',	'T',	'1989-03-24',	'ihkbcc84@avpjtw.com',	'NM5636992',	'2016-08-04 06:04:09'),
('+8801596047660',	'5HSFQHJH11O403271',	'Colleen Proctor',	'T',	'2001-04-12',	'lnvdr@jhcmlmshoqg.org',	'3263281814',	'2010-02-10 11:31:52'),
('+8801603376378',	'3ZX8754714Q235159',	'Sammy Herring',	'M',	'2005-09-03',	'iord@bowtkg.org',	'6135478956',	'2020-10-03 08:29:51'),
('+8801636637722',	'WBX5YN6S11P352363',	'Bernard Wilkins',	'M',	'1978-05-28',	'fkvnzo9@uaxcqplutoknm.com',	'9863747263',	'2015-09-07 00:13:03'),
('+8801701000071',	'b3bebbc7-5d89-11ec-a6d0-fc44823a8081',	'Testing Salt',	'F',	'2021-12-15',	NULL,	NULL,	'2021-12-15 15:28:37'),
('+8801836314655',	'WNS46E6X11L363837',	'Alice Velazquez',	'F',	'2005-06-11',	'tlxsd53@lesbduiprox.com',	'WE5720358',	'2014-01-13 02:23:57'),
('+8801870206523',	'1LSYJB7O17I766280',	'Marissa Escobar',	'F',	'1970-12-16',	'ulof41@txproncnlx.com',	'2803811426325',	'2014-01-28 08:23:09'),
('+8801968950479',	'4QALA8BS11P922064',	'Casey Leonard',	'F',	'2005-01-06',	'frcmm.ivmsmdp@siezjy.org',	'UN9071572',	'2017-05-24 18:20:17')
ON DUPLICATE KEY UPDATE `mobile_no` = VALUES(`mobile_no`), `password` = VALUES(`password`), `name` = VALUES(`name`), `sex` = VALUES(`sex`), `dob` = VALUES(`dob`), `email` = VALUES(`email`), `document_id` = VALUES(`document_id`), `joined_on` = VALUES(`joined_on`);

DROP TABLE IF EXISTS `vacant_bed_log`;
CREATE TABLE `vacant_bed_log` (
  `registration_no` char(10) NOT NULL,
  `last_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ward` smallint DEFAULT NULL,
  `special_ward` smallint DEFAULT NULL,
  `cabin` tinyint DEFAULT NULL,
  `vip_cabin` tinyint DEFAULT NULL,
  `icu` tinyint DEFAULT NULL,
  `ccu` tinyint DEFAULT NULL,
  `hdu` smallint DEFAULT NULL,
  `hfncu` smallint DEFAULT NULL,
  `emergency` smallint DEFAULT NULL,
  `covid` smallint DEFAULT NULL,
  `extra` smallint DEFAULT NULL,
  PRIMARY KEY (`registration_no`,`last_updated`),
  CONSTRAINT `vacant_bed_log_fk0` FOREIGN KEY (`registration_no`) REFERENCES `hospital` (`registration_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `vacant_bed_log` (`registration_no`, `last_updated`, `ward`, `special_ward`, `cabin`, `vip_cabin`, `icu`, `ccu`, `hdu`, `hfncu`, `emergency`, `covid`, `extra`) VALUES
('0476608341',	'2021-08-28 10:53:12',	582,	487,	45,	2,	31,	44,	62,	8,	299,	NULL,	4258),
('0476608341',	'2021-09-04 11:56:15',	NULL,	692,	31,	NULL,	9,	39,	NULL,	54,	464,	310,	4613),
('0476608341',	'2021-09-08 06:38:34',	560,	294,	NULL,	NULL,	37,	7,	73,	39,	71,	442,	4153),
('0476608341',	'2021-09-12 08:42:15',	488,	752,	15,	1,	25,	59,	74,	86,	725,	911,	1032),
('0476608341',	'2021-09-13 17:06:55',	563,	77,	33,	29,	NULL,	32,	23,	NULL,	NULL,	164,	4934),
('0476608341',	'2021-09-16 14:29:54',	628,	376,	24,	24,	24,	0,	NULL,	87,	823,	744,	4606),
('0476608341',	'2021-09-16 17:50:18',	797,	926,	21,	NULL,	14,	68,	89,	55,	260,	295,	4160),
('2836314655',	'2021-08-08 14:05:46',	583,	NULL,	50,	28,	36,	99,	25,	87,	141,	593,	2963),
('2836314655',	'2021-08-08 17:29:37',	562,	NULL,	40,	26,	40,	31,	NULL,	NULL,	957,	183,	689),
('2836314655',	'2021-08-11 03:15:27',	923,	66,	40,	17,	71,	95,	45,	53,	892,	NULL,	858),
('2836314655',	'2021-08-21 01:18:17',	161,	495,	NULL,	39,	NULL,	13,	0,	6,	97,	406,	2813),
('2836314655',	'2021-08-21 02:55:39',	NULL,	660,	1,	35,	68,	71,	56,	39,	371,	189,	2040),
('3360052309',	'2021-08-01 01:20:26',	378,	543,	32,	33,	60,	59,	91,	75,	189,	43,	4039),
('3360052309',	'2021-08-02 13:28:56',	228,	811,	8,	11,	2,	85,	63,	49,	287,	435,	3477),
('3360052309',	'2021-08-08 17:12:26',	NULL,	748,	7,	2,	8,	20,	14,	90,	754,	959,	221),
('3360052309',	'2021-09-15 10:45:19',	839,	260,	45,	2,	31,	91,	6,	88,	496,	236,	1353),
('3360052309',	'2021-09-17 22:26:44',	522,	406,	23,	3,	23,	62,	57,	50,	141,	779,	NULL),
('3613266758',	'2021-07-31 23:49:22',	29,	NULL,	42,	44,	12,	80,	54,	4,	917,	229,	3503),
('3613266758',	'2021-08-05 18:34:04',	NULL,	67,	46,	24,	78,	NULL,	NULL,	77,	59,	629,	2405),
('3613266758',	'2021-08-21 02:04:42',	593,	117,	39,	42,	0,	59,	NULL,	65,	290,	828,	53),
('3613266758',	'2021-08-21 02:12:33',	919,	604,	21,	NULL,	0,	45,	95,	22,	272,	491,	954),
('3701043663',	'2021-08-21 02:16:22',	153,	536,	17,	18,	44,	60,	82,	5,	658,	NULL,	2382),
('3701043663',	'2021-08-21 02:17:52',	554,	511,	17,	14,	60,	51,	29,	12,	5,	627,	792),
('3701043663',	'2021-08-26 01:46:49',	747,	367,	41,	40,	88,	1,	38,	76,	42,	885,	NULL),
('3701043663',	'2021-08-27 17:06:41',	51,	320,	36,	24,	97,	97,	78,	91,	277,	195,	4703),
('3701043663',	'2021-08-31 22:46:01',	169,	284,	42,	47,	47,	30,	NULL,	38,	54,	545,	3567),
('3701043663',	'2021-09-05 00:00:43',	329,	890,	34,	4,	36,	52,	59,	46,	429,	709,	1355),
('3875193242',	'2021-08-01 22:06:05',	461,	396,	19,	49,	61,	78,	NULL,	35,	824,	726,	4042),
('3875193242',	'2021-08-06 13:09:37',	128,	547,	21,	23,	73,	35,	22,	42,	NULL,	281,	1045),
('3875193242',	'2021-08-17 09:15:37',	NULL,	865,	21,	37,	80,	NULL,	13,	98,	43,	982,	4547),
('3875193242',	'2021-08-21 02:13:16',	554,	41,	18,	1,	3,	12,	5,	68,	NULL,	520,	3356),
('3875193242',	'2021-08-29 22:01:28',	460,	900,	23,	43,	61,	34,	81,	0,	659,	194,	2314),
('6895047952',	'2021-08-19 15:50:32',	419,	245,	43,	19,	76,	84,	93,	47,	904,	716,	203),
('6895047952',	'2021-09-10 00:16:23',	905,	263,	49,	46,	19,	3,	19,	71,	868,	988,	3028),
('7503214296',	'2021-08-15 10:52:06',	826,	207,	23,	48,	57,	91,	31,	80,	425,	399,	918),
('7503214296',	'2021-08-18 03:01:17',	540,	445,	43,	8,	61,	66,	82,	64,	780,	803,	2477),
('7503214296',	'2021-08-25 02:30:17',	617,	691,	29,	17,	33,	83,	23,	12,	793,	961,	2259),
('7503214296',	'2021-09-02 16:38:26',	743,	910,	0,	11,	57,	93,	25,	10,	441,	912,	3762),
('7503214296',	'2021-09-02 17:52:16',	385,	917,	29,	15,	98,	52,	78,	26,	877,	569,	1700),
('7531726902',	'2021-08-01 00:01:48',	621,	298,	5,	22,	40,	73,	51,	88,	809,	397,	3908),
('7531726902',	'2021-08-07 17:42:54',	753,	412,	24,	4,	37,	33,	29,	53,	698,	427,	1859),
('7531726902',	'2021-08-19 04:48:10',	33,	451,	28,	42,	45,	NULL,	NULL,	42,	730,	469,	562),
('7531726902',	'2021-08-26 21:45:43',	244,	142,	40,	6,	51,	46,	76,	44,	NULL,	590,	2380),
('7531726902',	'2021-09-05 06:53:15',	692,	978,	41,	20,	69,	59,	NULL,	67,	923,	179,	1887),
('7531726902',	'2021-09-06 07:03:13',	293,	562,	45,	9,	37,	64,	98,	25,	446,	715,	299),
('7722788763',	'2021-08-02 20:45:28',	789,	219,	NULL,	42,	54,	57,	22,	NULL,	49,	781,	1637),
('7722788763',	'2021-08-08 09:17:00',	408,	94,	38,	14,	69,	38,	41,	41,	437,	607,	22),
('7722788763',	'2021-08-20 14:36:33',	733,	98,	42,	31,	7,	77,	31,	98,	714,	173,	1215),
('7722788763',	'2021-08-21 06:05:49',	855,	575,	14,	41,	20,	49,	13,	99,	368,	NULL,	3097),
('7722788763',	'2021-09-07 20:00:34',	725,	103,	25,	9,	87,	70,	NULL,	91,	865,	NULL,	4731)
ON DUPLICATE KEY UPDATE `registration_no` = VALUES(`registration_no`), `last_updated` = VALUES(`last_updated`), `ward` = VALUES(`ward`), `special_ward` = VALUES(`special_ward`), `cabin` = VALUES(`cabin`), `vip_cabin` = VALUES(`vip_cabin`), `icu` = VALUES(`icu`), `ccu` = VALUES(`ccu`), `hdu` = VALUES(`hdu`), `hfncu` = VALUES(`hfncu`), `emergency` = VALUES(`emergency`), `covid` = VALUES(`covid`), `extra` = VALUES(`extra`);

-- 2021-12-22 08:23:24
