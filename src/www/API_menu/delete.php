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


	$id = file_get_contents(('php://input'));
   echo $id;
    // $object = json_decode($json);
 
    // $id = $object->description;
    // $categorie = $object->categorie;
    // $nom = $object->nom;
try {
 $pdo = new PDO("mysql:host=127.0.0.1;dbname=drpnngev_api;charset=utf8", "drpnngev_ludo", "q!2R(O9EJss6i0", [PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ]);


    // $query= $pdo->prepare("INSERT INTO aideMemoire(description, categorie, nom) VALUES('" . $description . "', '" . $categorie . "', '" . $nom . "')");
    $query= $pdo->prepare("DELETE FROM aideMemoire WHERE id = ".$id);
    $query->execute();


} catch (PDOException $e) {
    echo $e->getMessage();
}