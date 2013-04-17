<?php
header('content-type: text/html; charset=utf-8');
include "paths.php";
include $path_conf."config.php";
include $path_lib."dbconnect.php";
include $path_lib."library.php";

global $tournament, $password, $callback;

$tournament = $_GET["tournament"];
$password = $_GET["password"];
$callback = $_GET["callback"];

$vysledek = mysql_query("select * from mod_catcher_tournaments where id = '$tournament'");
// zatím se s heslem nebudeme párat, přihlásíme se kamkoliv a kdykoliv 
//  and password = '$password'

if(mysql_num_rows($vysledek) == 1 && isset($callback)){
	$data = mysql_fetch_array($vysledek);
    header('Content-Type: text/javascript');
    echo $callback . '({"success":true, "tournament_id":"' . $data["id"] . '", "tournament_name":"' . $data["name"] . '"});';
}else{
	echo '{"success":false,"message":"chybné heslo či neexistují turnaj"}';
}

?>
