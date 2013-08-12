<?
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,DELETE");

include "../scripts/paths.php";
include $path_conf."config.php";
include $path_lib."dbconnect.php";
include $path_lib."library.php";

function convert($string){
	return iconv("cp1250","utf-8",$string);;
}

function convert2($string){
	return iconv("utf-8","cp1250",$string);
}

$tab1 = "mod_catcher_teams";
$tab2 = "mod_catcher_players";
$tab3 = "mod_catcher_team2tournament";
$tab4 = "mod_catcher_player2tournament";
$tab5 = "mod_catcher_matches";
$tab6 = "mod_catcher_points";
       
$output = array();
$store = $_GET["store"];
if(isset($_GET["tournament_id"])) $tournament_id = $_GET["tournament_id"];
$method = $_SERVER['REQUEST_METHOD'];
if(isset($_REQUEST['callback'])) $callback = $_REQUEST['callback'];

$cols["tournaments"] = array("tournament_id"=>"id","tournament_name"=>"name","fields"=>"fields");
$cols["teams"] = array("team_id"=>"id","name_short"=>"name_short","name_full"=>"name_full");
$cols["players"] = array("player_id"=>"id","name"=>"name","surname"=>"surname","number"=>"number","team"=>"team","nick"=>"nick");
$cols["matches"] = array("match_id"=>"id","tournament_id"=>"tournament_id","home_id"=>"home_id","home_name_full"=>"home_name_full","home_name_short"=>"home_name_short","away_name_full"=>"away_name_full","away_name_short"=>"away_name_short","away_id"=>"away_id","score_home"=>"score_home","score_away"=>"score_away","spirit_home"=>"spirit_home","spirit_away"=>"spirit_away","field"=>"field","time"=>"time","time_start"=>"time_start","time_end"=>"time_end","length"=>"length");
$cols["points"] = array("point_id"=>"id","team_id"=>"team_id","player_id"=>"player_id","assist_player_id"=>"assist_player_id","match_id"=>"match_id","time"=>"time");

$cols_app = $cols;
$cols_app["players"]["player_id"] = "player_id";
$cols_app["matches"]["match_id"] = "match_id";
$cols_app["points"]["point_id"] = "point_id";

function update_match_settings($data){
  global $tab5,$output;
  if($data["time_start"] == 1) $data["time_start"] = time();
  if($data["time_end"] == 1) $data["time_end"] = time();
  mysql_query("UPDATE $tab5 SET field = '$data[field]', length = '$data[length]', time = '$data[time]' WHERE id = $data[match_id]");
//   , time_start = (case time_start=0 then time_start=$data[time_start] else time_start=time_start), time_end = (case time_end=0 then time_end=$data[time_end] else time_end=time_end) 
//   echo "UPDATE $tab5 SET field = '$data[field]', length = '$data[length]', time = '$data[time]', time_start = (case time_start==0 then time_start=$data[time_start] else time_start=time_start)IF(time_start<:$data[time_start],:time_start,$data[time]), time_end = (case time_end==0 then time_end=$data[time_end] else time_end=time_end) WHERE id = $data[match_id]";
  $output["success"] = true; 
}

// pokud $match_id = false, updatuje se celý turnaj
function update_match($match_id = false){
  if($match_id == false){
    global $tournament_id,$tab5;
    $result = mysql_query("SELECT id FROM $tab5 WHERE tournament_id = '$tournament_id'");
    $matchesToUpdate = array();
    while($data = mysql_fetch_array($result)){
      $matchesToUpdate[]=$data["id"];
    }
  }else{
    $matchesToUpdate[]=$match_id;
  }  
  
  foreach($matchesToUpdate as $match_id){    
    $data = mysql_fetch_array(mysql_query("SELECT home_id, away_id FROM mod_catcher_matches WHERE id='$match_id'"));
    $score_home = mysql_fetch_array(mysql_query("SELECT count(id) as score FROM mod_catcher_points WHERE match_id = '$match_id' AND team_id='$data[home_id]'"));
    $score_away = mysql_fetch_array(mysql_query("SELECT count(id) as score FROM mod_catcher_points WHERE match_id = $match_id AND team_id='$data[away_id]'"));
    mysql_query("UPDATE mod_catcher_matches SET score_home = '$score_home[score]', score_away = '$score_away[score]' WHERE id = $match_id");
  }
}

if($method == "POST"){ // insert dat ve storu
  $data = file_get_contents("php://input");
	$data = json_decode($data,true);
  foreach($cols_app[$store] as $index=>$value){
  	$data[$value] = convert2($data[$value]);
	}
  switch($store){
    case "points":
      // zahazujeme bod, pokud už tam je, což by se nemìlo stát, prùbìžnì logujeme    
      if(mysql_num_rows(mysql_query("SELECT * FROM mod_catcher_$store WHERE time = '$data[time]' AND match_id='$data[match_id]' AND team_id='$data[team_id]' AND player_id='$data[player_id]'")) == 0) {
    		mysql_query("INSERT INTO mod_catcher_$store (player_id,assist_player_id,match_id,team_id,time) VALUES ($data[player_id],$data[assist_player_id],$data[match_id],$data[team_id],$data[time])");
        $output["dirty"] = true;        
      }else{
        debuguj("Pokus o pøidání duplikátu: ".json_encode($data),"catcher");
      }             
      update_match($data["match_id"]);
  	break;
    case "players":
      mysql_query("INSERT INTO mod_catcher_$store (name,surname,number,team,nick, viditelnost) VALUES ('$data[name]','$data[surname]','$data[number]','$data[team]','$data[nick]',1)");
      mysql_query("INSERT INTO $tab4 (player_id, tournament_id) VALUES (".mysql_insert_id().",$tournament_id)");
    break;
  }
} 

if($method == "PUT"){ // update dat ve storu
	$data = file_get_contents("php://input");
	$data = json_decode($data,true);
	foreach($cols_app[$store] as $index=>$value){
  	$data[$value] = convert2($data[$value]);
	}
	switch($store){
		case "players":		
			mysql_query("UPDATE mod_catcher_$store SET name = '$data[name]', surname = '$data[surname]', number = '$data[number]', team = $data[team], nick='$data[nick]' WHERE id = $data[player_id]");						
		break;
		
		case "matches":
      update_match($data["match_id"]);
      update_match_settings($data);      			
		break;
		
		case "points":
			mysql_query("UPDATE mod_catcher_$store SET player_id = '$data[player_id]', assist_player_id = '$data[assist_player_id]' WHERE id = $data[point_id]");
      update_match($data["match_id"]);
		break;
		
	}		
}

if($method == "DELETE"){ // budeme nìco mazat ze storu
	$data = file_get_contents("php://input");
	$data = json_decode($data,true);

	switch($store){
		case "players":	
			mysql_query("DELETE FROM mod_catcher_$store WHERE id = $data[player_id]");
      mysql_query("DELETE FROM $tab4 WHERE tournament_id = $tournament_id AND player_id = $data[player_id]");
		break;
		
		case "points":			      
      mysql_query("DELETE FROM mod_catcher_$store WHERE id = $data[point_id]");
      update_match($data["match_id"]);
		break;
	}
}

if($method == "GET"){ // stažení dat, rùzné prùbìžné aktualizaèní požadavky
	if(!empty($store)){
    $skryte = "AND viditelnost=1";
    if(isset($tournament_id)) $t_cond = "tournament_id=$tournament_id";
    switch($store){
      case "teams":
        $vysledek = mysql_query("SELECT $tab1.* FROM $tab1 LEFT JOIN $tab3 ON $tab3.team_id=$tab1.id WHERE $tab3.$t_cond $skryte");
        echo mysql_error();
      break;
      case "matches":
        if(isset($_GET["id"])){
          // dotaz na jediný konkrétní zápas
          $vysledek = mysql_query("SELECT * FROM $tab5 WHERE id = '".$_GET["id"]."'");
        }else{
          // standardní naèítání dat
          update_match();
          $vysledek = mysql_query("SELECT * FROM $tab5 WHERE $t_cond ORDER BY time");
        }        
      break;
      case "points":
        if(isset($_GET["match_id"])){
          // dotaz na jediný konkrétní zápas (aktualizace poèitadel)
          $vysledek = mysql_query("SELECT $tab6.* FROM $tab6 LEFT JOIN $tab5 ON $tab5.id=$tab6.match_id WHERE $tab6.match_id = '".$_GET["match_id"]."'");
        }else{
          // standardní naèítání dat
          $vysledek = mysql_query("SELECT $tab6.* FROM $tab6 LEFT JOIN $tab5 ON $tab5.id=$tab6.match_id");
        }
      break;
      case "players":
        $vysledek = mysql_query("SELECT $tab2.* FROM $tab2 LEFT JOIN $tab4 ON $tab4.player_id=$tab2.id WHERE $tab4.$t_cond $skryte");
      break;
      case "tournaments":
        $vysledek = mysql_query("SELECT * FROM mod_catcher_tournaments WHERE active=1 ORDER BY name");
      break;
    }						
		
    if(isset($vysledek)) {
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
        if($store == "points"){          
          $match_info = mysql_fetch_array(mysql_query("SELECT home_id, away_id FROM mod_catcher_matches WHERE id = '$data[match_id]'"));
          $score["score_home"] = mysql_fetch_array(mysql_query("SELECT count(id) as score FROM mod_catcher_points WHERE team_id='$match_info[home_id]' AND match_id='$data[match_id]' AND time <= $data[time]"));
          $score["score_away"] = mysql_fetch_array(mysql_query("SELECT count(id) as score FROM mod_catcher_points WHERE team_id='$match_info[away_id]' AND match_id='$data[match_id]' AND time <= $data[time]"));
          mysql_query("UPDATE mod_catcher_points SET score_home = '".$score["score_home"]["score"]."', score_away = '".$score["score_away"]["score"]."' WHERE id = '".$data["id"]."'");
          $tmp["score_home"] = $score["score_home"]["score"];        
          $tmp["score_away"] = $score["score_away"]["score"];
        }
  	  	$output[] = $tmp;
  		}
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