Ext.define("catcher.view.MatchesNavigation", {
	extend : "Ext.navigation.View",
	xtype : "matchesNavigation",
	requires : [ "catcher.view.MatchDetail", "catcher.view.MatchesList" ],
	config : {
		title: "Zápasy",
		iconCls: "time",
		styleHtmlContent: true,
		
		items : [ {
			xtype : 'matchesList'
		} ]
	}
});