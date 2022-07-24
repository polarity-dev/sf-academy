

USE test;

CREATE TABLE `message` (
  `id` int(20) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `message` text NOT NULL,
  `status` varchar(999) NOT NULL DEFAULT 'unprocessed',
  `priority` int(11) NOT NULL,
  `proc_k` int(11) DEFAULT NULL,
  `proc_d` text DEFAULT NULL,
  `timestamp` datetime NOT NULL DEFAULT current_timestamp(),
  `proc_timestamp` timestamp NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
