<?

include "../scripts/paths.php";
include $path_conf."config.php";
include $path_lib."dbconnect.php";

function convert($string){
	return iconv("cp1250","utf-8",$string);;
}

function convert2($string){
	return iconv("utf-8","cp1250",$string);
}

$output = array();
$store = $_GET["store"];
$method = $_SERVER['REQUEST_METHOD'];
if(isset($_REQUEST['callback'])) $callback = $_REQUEST['callback'];

$cols["tournaments"] = array("tournament_id"=>"id","tournament_name"=>"name");
$cols["teams"] = array("team_id"=>"id","name_short"=>"name_short","name_full"=>"name_full");
$cols["players"] = array("player_id"=>"id","name"=>"name","surname"=>"surname","number"=>"number","team"=>"team");
$cols["matches"] = array("match_id"=>"id","tournament_id"=>"tournament_id","home_id"=>"home_id","home_name_full"=>"home_name_full","home_name_short"=>"home_name_short","away_name_full"=>"away_name_full","away_name_short"=>"away_name_short","away_id"=>"away_id","score_home"=>"score_home","score_away"=>"score_away","spirit_home"=>"spirit_home","spirit_away"=>"spirit_away","field"=>"field","time"=>"time");
$cols["points"] = array("point_id"=>"id","team_id"=>"team_id","player_id"=>"player_id","assist_player_id"=>"assist_player_id","match_id"=>"match_id","time"=>"time");

$cols_app = $cols;
$cols_app["players"]["player_id"] = "player_id";
$cols_app["matches"]["match_id"] = "match_id";
$cols_app["points"]["point_id"] = "point_id";

// echo $method;

if($method == "PUT"){ // update dat ve storu
	$data = file_get_contents("php://input");
	$data = json_decode($data,true);
	foreach($cols_app[$store] as $index=>$value){
  	$data[$value] = convert2($data[$value]);
	}
	switch($store){
		case "players":
			$vysledek = mysql_query("SELECT id FROM mod_catcher_$store WHERE id = '$data[player_id]'");
			if(mysql_num_rows($vysledek) == 0){ // jde o insert
				mysql_query("INSERT INTO mod_catcher_$store (id,name,surname,number,team) VALUES ($data[player_id],'$data[name]','$data[surname]','$data[number]','$data[team]')");
			}else{
				mysql_query("UPDATE mod_catcher_$store SET name = '$data[name]', surname = '$data[surname]', number = '$data[number]', team = $data[team] WHERE id = $data[player_id]");
			}						
		break;
		
		case "matches":
			mysql_query("UPDATE mod_catcher_$store SET score_home = '$data[score_home]', score_away = '$data[score_away]' WHERE id = $data[match_id]");
		break;
		
		case "points":
			$vysledek = mysql_query("SELECT id FROM mod_catcher_$store WHERE id = '$data[point_id]'");
			if(mysql_num_rows($vysledek) == 0){ // jde o insert
				mysql_query("INSERT INTO mod_catcher_$store (id,player_id,assist_player_id,match_id,team_id,time) VALUES ($data[point_id],$data[player_id],$data[assist_player_id],$data[match_id],$data[team_id],$data[time])");
			}else{
				mysql_query("UPDATE mod_catcher_$store SET player_id = '$data[player_id]', assist_player_id = '$data[assist_player_id]' WHERE id = $data[point_id]");
			}

		break;
		
	}		
}

if($method == "DELETE"){ // budeme n�co mazat ze storu
	$data = file_get_contents("php://input");
	$data = json_decode($data,true);

	switch($store){
		case "players":	
			mysql_query("DELETE FROM mod_catcher_$store WHERE id = $data[player_id]");
		break;
		
		case "points":
			mysql_query("DELETE FROM mod_catcher_$store WHERE id = $data[point_id]");
		break;
	}
}

if($method == "POST"){ // budeme ukl�d�t do storu
	$data = file_get_contents("php://input");
	$data = json_decode($data,true);
	foreach($cols_app[$store] as $index=>$value){
  	$data[$value] = convert2($data[$value]);
	}

	switch($store){
		case "players":
			mysql_query("INSERT INTO mod_catcher_$store (id,name,surname,number,team) VALUES ($data[player_id],'$data[name]','$data[surname]','$data[number]','$data[team]')");
  	break;
	}
}

if($method == "GET"){ // sta�en� dat
	if(!empty($store)){						
		$vysledek = mysql_query("SELECT * FROM mod_catcher_$store");
		while($data = mysql_fetch_array($vysledek)){
			if($store == "matches"){
				$home = mysql_fetch_array(mysql_query("SELECT * FROM mod_catcher_teams WHERE id = $data[home_id]"));
				$away = mysql_fetch_array(mysql_query("SELECT * FROM mod_catcher_teams WHERE id = $data[away_id]"));
				$data["home_name_short"] = $home["name_short"];
				$data["home_name_full"] = $home["name_full"];
				$data["away_name_short"] = $away["name_short"];
				$data["away_name_full"] = $away["name_full"];
			}
			foreach($cols[$store] as $index=>$value){
	    	$data[$value] = convert($data[$value]);
	    	$tmp[$index] = $data[$value];
	  	}
	  	$output[] = $tmp;
		}
	}					
}

if (isset($callback)) {
    header('Content-Type: text/javascript');
    echo $callback . '(' . json_encode($output) . ');';
} else {
    header('Content-Type: application/x-json');
    echo json_encode($output);
}		

?>