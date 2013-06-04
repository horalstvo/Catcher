Ext.define('catcher.controller.MatchController', {
    extend : 'Ext.app.Controller',

    config : {
        refs : {
            matchesNavigation : "matchesNavigation",
            matchDetail : "matchDetail",
            addPointDetail : "addPointDetail",
            editPointDetail : "editPointDetail",
            scoreList : "scoreList",
        },
        control : {
            "matchesList" : {
                disclose : "showMatchDetail",
                select : "showMatchDetail"
            },
            "matchPlayerList" : {
                disclose : "showAddPoint",
                select : "showAddPoint"
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
                disclose : "showEditPoint",
                select : "showEditPoint"
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
        fillMatchDetailContent(this.getMatchDetail(), match);
        var session = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid);
        session.match_id = match.match_id;
    },

    showAddPoint : function(list, record) {
        var scoringPlayer = record.data;

        this.getMatchesNavigation().push({
            xtype : "addPointDetail",
            title : "Score " + fullName(scoringPlayer),
            data : scoringPlayer
        });

        var addPointDetail = this.getAddPointDetail();
        var coPlayers = getCoPlayers(scoringPlayer.team);
        addPointDetail.query("selectfield[name=assistPlayer]")[0].setOptions(coPlayers);
    },

    addPoint : function() {
        var scoringPlayer = this.getAddPointDetail().getData();

        var session = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid);
        var matches = Ext.getStore("Matches");
        var matchId = session.match_id;

        var assistPlayerId = this.getAddPointDetail().query("selectfield[name=assistPlayer]")[0].getValue();

        var points = Ext.getStore("Points");
        var new_id = getNewId(points);

        var point = Ext.create("catcher.model.Point", {
            point_id : new_id,
            team_id : scoringPlayer.team,
            player_id : scoringPlayer.player_id,
            match_id : matchId,
            assist_player_id : assistPlayerId,
            time : Date.now() / 1000
        });
        // Add the point and raise score.
        points.add(point);
        point.setDirty();
        console.log(points, new_id);
        points.sync();

        var match = matches.findRecord("match_id", matchId, false, false, false, true).data;
        if (match.home_id == scoringPlayer.team) {
            match.score_home++;
        } else {
            match.score_away++;
        }

        matches.findRecord("match_id", matchId, false, false, false, true).setDirty();
        matches.sync();

        this.getMatchesNavigation().pop(); // Back to the match overview (update scores).
        fillMatchDetailContent(this.getMatchDetail(), match);
    },

    showScoreHome : function() {
        var matchId = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid).match_id;
        var match = Ext.getStore("Matches").findRecord("match_id", matchId, false, false, false, true).data;
        this.getMatchesNavigation().push({
            xtype : "scoreList",
            title : "Skóre " + match.home_name_short,
            store : getTeamScore(match.match_id, match.home_id)
        });
    },

    showScoreAway : function() {
        var matchId = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid).match_id;
        var match = Ext.getStore("Matches").findRecord("match_id", matchId, false, false, false, true).data;
        this.getMatchesNavigation().push({
            xtype : "scoreList",
            title : "Skóre " + match.away_name_short,
            store : getTeamScore(match.match_id, match.away_id)
        });
    },

    showEditPoint : function(list, record) {
        var point = Ext.getStore("Points").findRecord("point_id", record.data.pointId).data;

        this.getMatchesNavigation().push({
            xtype : "editPointDetail",
            data : record.data
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
        Ext.getStore("Points").sync();

        // Back and reload.
        this.getMatchesNavigation().pop();
        var matchId = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid).match_id;
        var scoringPlayer = Ext.getStore("Players").findRecord("player_id", values.scoringPlayer).data;
        this.getScoreList().setStore(getTeamScore(matchId, scoringPlayer.team));
        this.getScoreList().deselectAll();
    },

    deletePoint : function() {
        var values = this.getEditPointDetail().getValues();
        var store = Ext.getStore("Points");
        var remove = store.findRecord("point_id", values.pointId);
        store.remove(remove);
        store.sync();

        var matchId = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid).match_id;
        var match = Ext.getStore("Matches").findRecord("match_id", matchId, false, false, false, true).data;

        var scoringPlayer = Ext.getStore("Players").findRecord("player_id", values.scoringPlayer).data;

        if (match.home_id == scoringPlayer.team) {
            match.score_home--;
        } else {
            match.score_away--;
        }

        Ext.getStore("Matches").findRecord("match_id", matchId, false, false, false, true).setDirty();
        Ext.getStore("Matches").sync();

        // Back and reload.
        this.getMatchesNavigation().pop();
        this.getScoreList().setStore(getTeamScore(matchId, scoringPlayer.team));
        this.getScoreList().deselectAll();
        fillMatchDetailContent(this.getMatchDetail(), match);
    },
});

function fillMatchDetailContent(matchDetail, match) {
    matchDetail.query("button[name=scoreHome]")[0].setText(new String(match.score_home));
    matchDetail.query("button[name=scoreAway]")[0].setText(new String(match.score_away));

    var homePlayers = Ext.create("catcher.store.Players");
    homePlayers.filter("team", match.home_id);

    var awayPlayers = Ext.create("catcher.store.Players");
    awayPlayers.filter("team", match.away_id);

    var homePlayerList = matchDetail.query("matchPlayerList[name=homeTeam]")[0];
    homePlayerList.setStore(homePlayers);
    homePlayerList.deselectAll();
    homePlayerList.query("label[name=teamName]")[0].setHtml(match.home_name_full);

    var awayPlayerList = matchDetail.query("matchPlayerList[name=awayTeam]")[0];
    awayPlayerList.setStore(awayPlayers);
    awayPlayerList.deselectAll();
    awayPlayerList.query("label[name=teamName]")[0].setHtml(match.away_name_full);
    // awayPlayerList.query("titlebar[name=teamName]")[0].setTitle(match.away_name_full);
}

function fullName(player) {
    return player.name + " " + player.surname + " #" + player.number;
}

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
            pointId : item.get("point_id"),
        });
    });

    Ext.define("PointView", {
        extend : "Ext.data.Model",
        config : {
            fields : [ {
                name : 'scoringPlayer',
                type : 'string'
            }, {
                name : 'assistPlayer',
                type : 'string'
            }, {
                name : 'pointId',
                type : 'int'
            } ]
        }
    });

    return new Ext.data.Store({
        model : 'PointView',
        data : pointsToDisplay
    });
}

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
}

function createPlayerOption(player) {
    return {
        text : fullName(player),
        value : player.player_id
    };
}

function getNewId(store) {
    store.clearFilter();
    var id = 0;

    store.each(function(item, index, length) {
        var itemId = parseInt(item.get("point_id"));
        if (itemId > id) {
            id = itemId;
        }
    });
    return ++id;
}
