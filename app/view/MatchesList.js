Ext.define("catcher.view.MatchesList", {
	extend : "Ext.List",
	xtype : "matchesList",

	config : {
		title : "Zápasy",
		iconCls : "time",
		styleHtmlContent : true,

		items : [],

		store : "Matches",
		itemTpl : "{home_name_full} vs. {away_name_full} ({score_home}:{score_away}) - {time:date('G:i')}",
		onItemDisclosure : true
	}
});