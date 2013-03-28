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
		onItemDisclosure : true,
		listeners: {
			painted: function(){
				var store = Ext.getStore("Matches");
				var session = Ext.getStore("Session").findRecord("uuid",Ext.device.Device.uuid);
				store.clearFilter();
				store.filter("tournament_id",session.get("tournament_id"));
			}
		}
	},		
});