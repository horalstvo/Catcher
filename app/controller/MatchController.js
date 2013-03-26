Ext.define('catcher.controller.MatchController', {
	extend : 'Ext.app.Controller',

	config : {
		refs : {
			matchesNavigation : "matchesNavigation",
			matchDetail : "matchDetail"
		},
		control : {
			"matchesList" : {
				disclose : "showMatchDetail"
			},
		}
	},

	showMatchDetail : function(list, record) {
	    var match = record.data;
		this.getMatchesNavigation().push({
			xtype : "matchDetail",
			title: match.home_name_short + " x " + match.away_name_short,
			data : match
		});
		var matchDetail = this.getMatchDetail();
		matchDetail.query("button[name=scoreHome]")[0].setText(new String(match.score_home));
		matchDetail.query("button[name=scoreAway]")[0].setText(new String(match.score_away));
		
		var homePlayers = Ext.create("catcher.store.Players");
		homePlayers.filter("team", match.home_id);
		
		var awayPlayers = Ext.create("catcher.store.Players");
		awayPlayers.filter("team", match.away_id);
		
		matchDetail.query("matchPlayerList[name=homeTeam]")[0].setStore(homePlayers);
		matchDetail.query("matchPlayerList[name=awayTeam]")[0].setStore(awayPlayers);
	}
	
	// Pridat metodu pro zadani bodu.
});
