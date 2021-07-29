-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: database:3306
-- Generation Time: Dec 29, 2020 at 12:07 PM
-- Server version: 5.7.32
-- PHP Version: 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `ranking_app`
--
CREATE DATABASE IF NOT EXISTS `ranking_app` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin;
USE `ranking_app`;

-- --------------------------------------------------------

--
-- Table structure for table `lists`
--

CREATE TABLE `lists` (
  `id` int(11) NOT NULL,
  `title` varchar(300) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `lists`
--

INSERT INTO `lists` (`id`, `title`) VALUES
(3, 'wishlist');

-- --------------------------------------------------------

--
-- Table structure for table `list_elements`
--

CREATE TABLE `list_elements` (
  `id` int(11) NOT NULL,
  `in_list` int(11) NOT NULL,
  `place` int(11) NOT NULL,
  `title` varchar(500) COLLATE utf8_bin NOT NULL,
  `artist` varchar(500) COLLATE utf8_bin NOT NULL,
  `image_filename` varchar(900) COLLATE utf8_bin NOT NULL,
  `is_trashed` varchar(10) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `list_elements`
--

INSERT INTO `list_elements` (`id`, `in_list`, `place`, `title`, `artist`, `image_filename`, `is_trashed`) VALUES
(1, 3, 3, 'Shovel Knight', 'Yacht Club Games', 'shovelknight.png', 'false'),
(2, 3, 4, 'Downwell', 'Moppin', 'Downwell.jpg', 'false'),
(9, 3, 1, 'Hollow Knight: Silksong', 'Team Cherry', 'hksilksong.png', 'false'),
(26, 3, 2, 'Axiom Verge2', 'Thomas Happ', 'axiomverge2.png', 'false');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `lists`
--
ALTER TABLE `lists`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `list_elements`
--
ALTER TABLE `list_elements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `in_list` (`in_list`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `lists`
--
ALTER TABLE `lists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `list_elements`
--
ALTER TABLE `list_elements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `list_elements`
--
ALTER TABLE `list_elements`
  ADD CONSTRAINT `list_elements_ibfk_1` FOREIGN KEY (`in_list`) REFERENCES `lists` (`id`);
COMMIT;
