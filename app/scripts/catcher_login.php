<?php
header('Content-Type: text/html; charset=utf-8');
include "paths.php";
include $path_conf."config.php";
include $path_lib."dbconnect.php";
include $path_lib."library.php";

global $tournament, $password;
post2var("tournament,password");


$vysledek = mysql_query("SELECT * FROM mod_catcher_tournaments WHERE id = '$tournament'");
// zatím se s heslem nebudeme párat, přihlásíme se kamkoliv a kdykoliv 
//  AND password = '$password'

if(mysql_num_rows($vysledek) == 1){
	$data = mysql_fetch_array($vysledek);
	echo '{"success":true, "tournament_id":"'.$data["name"].'", "tournament_name":"'.$data["name"].'"}';
}else{
	echo '{"success":false,"message":"Chybné heslo"}';
}

?>
