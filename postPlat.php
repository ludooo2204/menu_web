<?php


header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];
if ($method == "OPTIONS") {
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
header("HTTP/1.1 200 OK");
die();
}


	$json = file_get_contents(('php://input'));
    $object = json_decode($json);
    $platNom = $object->platNom;
    $platMidiSoir = join(',', $object->platMidiSoir);
    $saison = join(',', $object->saison);
    // $platType = join(',', $object->platType);
    // $platTypeViande = join(',', $object->platTypeViande);
    // $platUrl = $object->platUrl;
    // $platVitesse = $object->platVitesse;
    // $ingredientsChoisi = join(',', $object->ingredientsChoisi);
    // var_dump($saison);
// 
try {
    $pdo = new PDO("mysql:host=127.0.0.1;dbname=menu;charset=utf8", "root", "", [PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ]);

//  $pdo = new PDO("mysql:host=127.0.0.1;dbname=drpnngev_api;charset=utf8", "drpnngev_ludo", "q!2R(O9EJss6i0", [PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ]);


    $query= $pdo->prepare("INSERT INTO plats (nom_plat,midiSoir,saison) VALUES('" . $platNom . "', '" . $platMidiSoir . "', '" . $saison . "')");
    // $query= $pdo->prepare("INSERT INTO plats (nom_plat,saison,midiSoir,typePlat,nbrDeRepasPossible,typeViande,tempsDePreparation) VALUES('" . $platNom . "', '" . $saison . "', '" . $platMidiSoir . "', '" . $platType . "', '" . $platTypeViande . "', '" . $platVitesse . "')");


    // $query= $pdo->prepare("INSERT INTO aideMemoire(description, categorie, nom) VALUES('" . $description . "', '" . $categorie . "', '" . $nom . "')");
    $query->execute();


} catch (PDOException $e) {
    echo $e->getMessage();
}