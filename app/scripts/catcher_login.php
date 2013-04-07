<?php
// header('content-type: text/html; charset=utf-8');
// include "paths.php";
// include $path_conf."config.php";
// include $path_lib."dbconnect.php";
// include $path_lib."library.php";
// 
// global $tournament, $password;
// post2var("tournament,password");


// $vysledek = mysql_query("select * from mod_catcher_tournaments where id = '$tournament'");
// zatím se s heslem nebudeme párat, přihlásíme se kamkoliv a kdykoliv 
//  and password = '$password'

$data["id"] = 15;
$data["name"] = "Prague Four League (1/2013)";

// if(mysql_num_rows($vysledek) == 1){
// 	$data = mysql_fetch_array($vysledek);
	echo '{"success":true, "tournament_id":"'.$data["id"].'", "tournament_name":"'.$data["name"].'"}';
// }else{
// 	echo '{"success":false,"message":"chybné heslo"}';
// }

?>
