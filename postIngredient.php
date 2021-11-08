²<?php


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
 
    $nom_ingredient = $object->nom_ingredient;
try {
    $pdo = new PDO("mysql:host=127.0.0.1;dbname=menu;charset=utf8", "root", "", [PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ]);

//  $pdo = new PDO("mysql:host=127.0.0.1;dbname=drpnngev_api;charset=utf8", "drpnngev_ludo", "q!2R(O9EJss6i0", [PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ]);


    $query= $pdo->prepare("INSERT INTO ingredients (nom_ingredient) VALUES('" . $nom_ingredient . "')");
    $query->execute();


} catch (PDOException $e) {
    echo $e->getMessage();
}