<?php

echo "toto";
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS");
// header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];
if ($method == "OPTIONS") {
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
header("HTTP/1.1 200 OK");
die();
}

    echo "toto";

	$json = file_get_contents(('php://input'));
    $object = json_decode($json);
 
    $description = $object->description;
    $categorie = $object->categorie;
    $nom = $object->nom;
    $id = $object->id;
try {
 $pdo = new PDO("mysql:host=127.0.0.1;dbname=drpnngev_api;charset=utf8", "drpnngev_ludo", "q!2R(O9EJss6i0", [PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ]);


    // $query= $pdo->prepare("INSERT INTO aideMemoire(description, categorie, nom) VALUES('" . $description . "', '" . $categorie . "', '" . $nom . "')");
    // $query= $pdo->prepare("DELETE FROM aideMemoire WHERE id = ".$id);
    // $query->execute();



$sql = "UPDATE aideMemoire SET description=?, categorie=?, nom=? WHERE id=?";
$stmt= $pdo->prepare($sql);
$stmt->execute([$description, $categorie, $nom, $id]);

// $sql = "UPDATE aideMemoire SET nom='?', description='?', categorie='?' WHERE id='?'";
// $req = $this->pdo->prepare($sql);
// $d = array($nom,$description,$categorie,$id);      
// $req->execute($d);



} catch (PDOException $e) {
    echo $e->getMessage();
}