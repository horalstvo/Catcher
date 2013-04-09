Ext.define('catcher.controller.MatchController', {
    extend : 'Ext.app.Controller',

    config : {
        refs : {
            matchesNavigation : "matchesNavigation",
            matchDetail : "matchDetail",
            addPointDetail : "addPointDetail",
            editPointDetail : "editPointDetail"
        },
        control : {
            "matchesList" : {
                disclose : "showMatchDetail"
            },
            "matchPlayerList" : {
                disclose : "showAddPoint"
            },
            "addPointDetail button" : {
                tap : "addPoint"
            },
            "matchDetail button[name=scoreHome]" : {
                tap : "showScoreHome"
            },
            "matchDetail button[name=scoreAway]" : {
                tap : "showScoreAway"
            },
            "scoreList" : {
                disclose : "showEditPoint"
            },
            "editPointDetail button[name=editConfirm]" : {
                tap : "updatePoint"
            },
        }
    },

    showMatchDetail : function(list, record) {
        var match = record.data;
        this.getMatchesNavigation().push({
            xtype : "matchDetail",
            title : match.home_name_short + " x " + match.away_name_short,
            data : match
        });
        var matchDetail = this.getMatchDetail();
        matchDetail.query("button[name=scoreHome]")[0].setText(new String(match.score_home));
        matchDetail.query("button[name=scoreAway]")[0].setText(new String(match.score_away));

        var homePlayers = Ext.create("catcher.store.Players");
        homePlayers.filter("team", match.home_id);

        var awayPlayers = Ext.create("catcher.store.Players"); // TODO Burkert: budou s create fungovat zmeny v hracich?
        awayPlayers.filter("team", match.away_id);

        matchDetail.query("matchPlayerList[name=homeTeam]")[0].setStore(homePlayers);
        matchDetail.query("matchPlayerList[name=awayTeam]")[0].setStore(awayPlayers);

        var session = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid);
        session.match_id = match.match_id;
    },

    showAddPoint : function(list, record) {
        var scoringPlayer = record.data;

        this.getMatchesNavigation().push({
            xtype : "addPointDetail",
            title : "Skóroval hráč " + fullName(scoringPlayer),
            data : scoringPlayer
        });

        var addPointDetail = this.getAddPointDetail();
        var coPlayers = getCoPlayers(scoringPlayer.team);
        addPointDetail.query("selectfield[name=assistPlayer]")[0].setOptions(coPlayers);
    },

    addPoint : function() {
        var scoringPlayer = this.getAddPointDetail().getData();

        var session = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid);
        var matchId = session.match_id;

        var assistPlayerId = this.getAddPointDetail().query("selectfield[name=assistPlayer]")[0].getValue();

        // Add the point and raise score.
        Ext.getStore("Points").add({
            team_id : scoringPlayer.team,
            player_id : scoringPlayer.player_id,
            match_id : matchId,
            assist_player_id : assistPlayerId
        });

        var match = Ext.getStore("Matches").findRecord("match_id", matchId, false, false, false, true).data;
        if (match.home_id == scoringPlayer.team) {
            match.score_home++;
        } else {
            match.score_away++;
        }

        this.getMatchesNavigation().pop(); // Back to the match overview (update scores).
        var matchDetail = this.getMatchDetail();
        matchDetail.query("button[name=scoreHome]")[0].setText(new String(match.score_home));
        matchDetail.query("button[name=scoreAway]")[0].setText(new String(match.score_away));

        var homePlayers = Ext.create("catcher.store.Players");
        homePlayers.filter("team", match.home_id);

        var awayPlayers = Ext.create("catcher.store.Players");
        awayPlayers.filter("team", match.away_id);

        matchDetail.query("matchPlayerList[name=homeTeam]")[0].setStore(homePlayers);
        matchDetail.query("matchPlayerList[name=awayTeam]")[0].setStore(awayPlayers);
    },

    showScoreHome : function() {
        var matchId = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid).match_id;
        var match = Ext.getStore("Matches").findRecord("match_id", matchId, false, false, false, true).data;
        this.getMatchesNavigation().push({
            xtype : "scoreList",
            data : getTeamScore(match.match_id, match.home_id)
        });
    },

    showScoreAway : function() {
        var matchId = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid).match_id;
        var match = Ext.getStore("Matches").findRecord("match_id", matchId, false, false, false, true).data;
        this.getMatchesNavigation().push({
            xtype : "scoreList",
            data : getTeamScore(match.match_id, match.away_id)
        });
    },

    showEditPoint : function(list, record) {
        var point = record.data.point.data;
        this.getMatchesNavigation().push({
            xtype : "editPointDetail",
            data : point
        });

        var coPlayers = getCoPlayers(point.team_id);

        var editPointDetail = this.getEditPointDetail();

        editPointDetail.query("selectfield[name=scoringPlayer]")[0].setOptions(coPlayers).setValue(point.player_id);
        editPointDetail.query("selectfield[name=assistPlayer]")[0].setOptions(coPlayers).setValue(point.assist_player_id);
        editPointDetail.query("hiddenfield[name=pointId]")[0].setValue(point.point_id);
    },

    updatePoint : function() {
        var values = this.getEditPointDetail().getValues();

        var point = Ext.getStore("Points").findRecord("point_id", values.pointId);
        point.set("player_id", values.scoringPlayer);
        point.set("assist_player_id", values.assistPlayer);
        this.getMatchesNavigation().pop();
    },

    deletePoint : function() {
        var values = this.getEditPointDetail().getValues();
        var store = Ext.getStore("Points");
        store.remove(store.findRecord("point_id", values.pointId));

        var matchId = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid).match_id;
        var match = Ext.getStore("Matches").findRecord("match_id", matchId, false, false, false, true).data;
        
        var scoringPlayer = Ext.getStore("Players").findRecord("player_id", values.scoringPlayer).data;

        if (match.home_id == scoringPlayer.team) {
            match.score_home--;
        } else {
            match.score_away--;
        }
        this.getMatchesNavigation().pop();
    },
});

function fullName(player) {
    return player.name + " " + player.surname + " #" + player.number;
};

function getTeamScore(matchId, teamId) {
    var points = Ext.getStore("Points");
    points.clearFilter();
    points.filter("match_id", matchId);
    points.filter("team_id", teamId);

    var players = Ext.getStore("Players");
    players.clearFilter();
    players.filter("team", teamId);

    var pointsToDisplay = new Array();
    points.each(function(item, index, length) {

        var scoringPlayer = players.findRecord("player_id", new String(item.get("player_id")));
        var assistPlayer = players.findRecord("player_id", new String(item.get("assist_player_id")));

        pointsToDisplay.push({
            scoringPlayer : fullName(scoringPlayer.data),
            assistPlayer : fullName(assistPlayer.data),
            point : item,
        });
    });
    return pointsToDisplay;
};

function getCoPlayers(team) {
    var players = Ext.getStore("Players");
    players.clearFilter();
    players.filter("team", team);

    var coPlayers = new Array();

    players.each(function(item, index, length) {
        var player = item.data;
        coPlayers.push(createPlayerOption(player));
    });
    return coPlayers;
};

function createPlayerOption(player) {
    return {
        text : fullName(player),
        value : player.player_id
    };
}
