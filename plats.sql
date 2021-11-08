-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  lun. 08 nov. 2021 à 19:59
-- Version du serveur :  5.7.23
-- Version de PHP :  7.2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `menu`
--

-- --------------------------------------------------------

--
-- Structure de la table `plats`
--

DROP TABLE IF EXISTS `plats`;
CREATE TABLE IF NOT EXISTS `plats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom_plat` varchar(70) NOT NULL,
  `saison` varchar(70) DEFAULT NULL COMMENT '1=été 2=automne 3=hiver 4=printemps',
  `tempsDePreparation` varchar(70) DEFAULT NULL COMMENT 'de 0 à 3 (du plus rapide au plus long)',
  `typeViande` varchar(70) DEFAULT NULL COMMENT '1=poulet 2=dinde 3=boeuf 4=porc 5=poisson',
  `légumesConseillés` varchar(20) DEFAULT NULL COMMENT 'table legumes',
  `féculentsConseillés` varchar(20) DEFAULT NULL COMMENT 'table féculents',
  `nbrDeRepasPossible` int(11) DEFAULT NULL,
  `midiSoir` varchar(70) DEFAULT NULL COMMENT '0=les 2   1=midi 2=soir',
  `typePlat` varchar(20) DEFAULT NULL COMMENT '0=defaut 1=tarte 2=vegetarien 3=light 4=extra',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `plats`
--

INSERT INTO `plats` (`id`, `nom_plat`, `saison`, `tempsDePreparation`, `typeViande`, `légumesConseillés`, `féculentsConseillés`, `nbrDeRepasPossible`, `midiSoir`, `typePlat`) VALUES
(1, 'marmitte espagnole', NULL, '2', 'dinde', NULL, NULL, 2, 'midi', '0'),
(3, 'hachi parmentier', NULL, '2', 'boeuf', NULL, NULL, 2, 'midi', '0'),
(4, 'croque-monsieur', NULL, '1', 'porc', NULL, NULL, 2, 'midi', '0'),
(5, 'feuilletés jambon', NULL, '0', 'porc', NULL, NULL, 1, 'soir', '0'),
(18, 'fgggggggggggggggggggggggggggggggg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(19, 'qsdqsd', NULL, NULL, NULL, NULL, NULL, NULL, '', NULL),
(20, 'loris', NULL, NULL, NULL, NULL, NULL, NULL, '', NULL),
(21, 'nora', NULL, NULL, NULL, NULL, NULL, NULL, 'soir', NULL),
(22, 'anne', '', NULL, NULL, NULL, NULL, NULL, 'midi', NULL),
(23, 'ludo', 'hiver,automne', NULL, NULL, NULL, NULL, NULL, 'midi', NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
