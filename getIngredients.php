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
$indiceFromJS = file_get_contents(('php://input'));
// echo $indiceFromJS;
try {
   // pour la base sur le cloud
    // $pdo = new PDO("mysql:host=127.0.0.1;dbname=drpnngev_velo;charset=utf8", "drpnngev_ludo", "q!2R(O9EJss6i0", [PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ]);
    
    // pour la base en local
    $pdo = new PDO("mysql:host=127.0.0.1;dbname=menu;charset=utf8", "root", "", [PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ]);

    if ($indiceFromJS == "") {
        $query = $pdo->prepare('SELECT * FROM ingredients');
        $query->execute();
    } else {
        $query = $pdo->prepare('SELECT * FROM plats WHERE id = :id');
        $query->execute(['id' => $indiceFromJS]);
    }
    $posts = $query->fetchAll();
    // print_r($posts);

    header('Content-Type: application/json');
    echo json_encode($posts);
} catch (PDOException $e) {
    echo $e->getMessage();
}
