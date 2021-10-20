-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  lun. 18 oct. 2021 à 19:58
-- Version du serveur :  10.4.10-MariaDB
-- Version de PHP :  7.3.12

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
-- Structure de la table `assoc_plat_ingredients`
--

DROP TABLE IF EXISTS `assoc_plat_ingredients`;
CREATE TABLE IF NOT EXISTS `assoc_plat_ingredients` (
  `plat` int(11) NOT NULL,
  `ingredient` int(11) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `assoc_plat_ingredients`
--

INSERT INTO `assoc_plat_ingredients` (`plat`, `ingredient`, `id`) VALUES
(1, 1, 1),
(1, 2, 2),
(3, 2, 6),
(3, 3, 8),
(3, 4, 7),
(4, 7, 9),
(4, 8, 10),
(4, 9, 11),
(5, 10, 12);

-- --------------------------------------------------------

--
-- Structure de la table `ingredients`
--

DROP TABLE IF EXISTS `ingredients`;
CREATE TABLE IF NOT EXISTS `ingredients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom_ingredient` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `ingredients`
--

INSERT INTO `ingredients` (`id`, `nom_ingredient`) VALUES
(1, 'oeuf'),
(2, 'lait'),
(3, 'pate feuilletée'),
(4, 'lardons fumés'),
(5, 'chorizo'),
(6, 'poivron rouge'),
(7, 'jambon'),
(8, 'pain de mie'),
(9, 'gruyère'),
(10, 'farine'),
(11, 'surimi'),
(12, 'courgettes'),
(13, 'tomate'),
(14, 'sucre'),
(15, 'pomme de terre'),
(16, 'mergez'),
(17, 'semoule'),
(18, 'semoule epicée'),
(19, 'légumes pour couscous'),
(20, 'poulet (haut de cuisse)'),
(21, 'boulette de boeuf');

-- --------------------------------------------------------

--
-- Structure de la table `plats`
--

DROP TABLE IF EXISTS `plats`;
CREATE TABLE IF NOT EXISTS `plats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom_plat` varchar(70) NOT NULL,
  `saison` varchar(70) DEFAULT NULL COMMENT '1=été 2=automne 3=hiver 4=printemps',
  `tempsDePreparation` int(11) NOT NULL COMMENT 'de 0 à 3 (du plus rapide au plus long)',
  `typeViande` varchar(70) DEFAULT NULL COMMENT '1=poulet 2=dinde 3=boeuf 4=porc 5=poisson',
  `légumesConseillés` varchar(20) DEFAULT NULL COMMENT 'table legumes',
  `féculentsConseillés` varchar(20) DEFAULT NULL COMMENT 'table féculents',
  `nbrDeRepasPossible` int(11) NOT NULL,
  `midiSoir` varchar(70) NOT NULL COMMENT '0=les 2   1=midi 2=soir',
  `typePlat` varchar(20) DEFAULT NULL COMMENT '0=defaut 1=tarte 2=vegetarien 3=light 4=extra',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `plats`
--

INSERT INTO `plats` (`id`, `nom_plat`, `saison`, `tempsDePreparation`, `typeViande`, `légumesConseillés`, `féculentsConseillés`, `nbrDeRepasPossible`, `midiSoir`, `typePlat`) VALUES
(1, 'marmitte espagnole', NULL, 2, 'dinde', NULL, NULL, 2, 'midi', '0'),
(3, 'hachi parmentier', NULL, 2, 'boeuf', NULL, NULL, 2, 'midi', '0'),
(4, 'croque-monsieur', NULL, 1, 'porc', NULL, NULL, 2, 'midi', '0'),
(5, 'feuilletés jambon', NULL, 0, 'porc', NULL, NULL, 1, 'soir', '0');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
