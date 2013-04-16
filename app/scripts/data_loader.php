<?
include "../scripts/paths.php";
include $path_conf."config.php";
include $path_lib."dbconnect.php";

function convert($string){
	return iconv("cp1250","utf-8",$string);;
}

$output = array();

if(isset($_REQUEST['callback'])) $callback = $_REQUEST['callback'];

$store = $_GET["store"];

if(!empty($store)){
	$cols["tournaments"] = array("tournament_id"=>"id","tournament_name"=>"name");
	$cols["teams"] = array("team_id"=>"id","name_short"=>"name_short","name_full"=>"name_full");
	$cols["players"] = array("player_id"=>"id","name"=>"name","surname"=>"surname","number"=>"number","team"=>"team");
	$cols["matches"] = array("match_id"=>"id","tournament_id"=>"tournament_id","home_id"=>"home_id","home_name_full"=>"home_name_full","home_name_short"=>"home_name_short","away_name_full"=>"away_name_full","away_name_short"=>"away_name_short","away_id"=>"away_id","score_home"=>"score_home","score_away"=>"score_away","spirit_home"=>"spirit_home","spirit_away"=>"spirit_away","field"=>"field","time"=>"time");	

	$vysledek = mysql_query("SELECT * FROM mod_catcher_$store");
	while($data = mysql_fetch_array($vysledek)){
		if($store == "matches"){
			$home = mysql_fetch_array(mysql_query("SELECT * FROM mod_catcher_teams WHERE id = $data[home_id]"));
			$away = mysql_fetch_array(mysql_query("SELECT * FROM mod_catcher_teams WHERE id = $data[away_id]"));
			$data["home_name_short"] = $home["name_short"];
			$data["home_name_full"] = $home["name_full"];
			$data["away_name_short"] = $home["name_short"];
			$data["away_name_full"] = $home["name_full"];
		}
		foreach($cols[$store] as $index=>$value){
    	$data[$value] = convert($data[$value]);
    	$tmp[$index] = $data[$value];
  	}
  	$output[] = $tmp;
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