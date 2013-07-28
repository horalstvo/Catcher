Ext.define('catcher.controller.MatchController', {
    extend : 'Ext.app.Controller',

    config : {
        refs : {
            matchesNavigation : "matchesNavigation",
            matchDetail : "matchDetail",
            addPointDetail : "addPointDetail",
            editPointDetail : "editPointDetail",
            scoreList : "scoreList"
        },
        control : {
            "matchesList" : {
                disclose : "showMatchDetail",
                select : "showMatchDetail"
            },
            "matchesNavigation matchPlayerList[name=score]" : {
                disclose : "showAssistPlayer",
                select : "showAssistPlayer"
            },
            "matchesNavigation matchPlayerList[name=assist]" : {
                disclose : "addPoint",
                select : "addPoint"
            },
            "matchDetail button[name=scoreHome]" : {
                tap : "showScoreHome"
            },
            "matchDetail button[name=scoreAway]" : {
                tap : "showScoreAway"
            },
            "matchDetail button[name=addPointHome]" : {
                tap : "addPointHome"
            },
            "matchDetail button[name=addPointAway]" : {
                tap : "addPointAway"
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
        var session = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid);
        session.match_id = match.match_id;
        this.fillMatchDetailContent(match);
    },

    addPointHome : function() {
        var session = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid);
        var matchId = session.match_id;
        var match = Ext.getStore("Matches").findRecord("match_id", matchId, false, false, false, true).data;

        session.score_team_id = match.home_id;

        this.showAddPoint();
    },

    addPointAway : function() {
        var session = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid);
        var matchId = session.match_id;
        var match = Ext.getStore("Matches").findRecord("match_id", matchId, false, false, false, true).data;

        session.score_team_id = match.away_id;

        this.showAddPoint();
    },

    showAddPoint : function() {
        var session = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid);

        var team = Ext.getStore("Teams").findRecord("team_id", session.score_team_id, false, false, false, true).data;

        var players = Ext.getStore("Players");
        players.clearFilter();
        players.filter([ {
            filterFn : function(item) {
                return item.get('team') == session.score_team_id;
            }
        } ]);
        players.sort();

        this.getMatchesNavigation().push({
            xtype : "matchPlayerList",
            title : "Skóroval " + team.name_short,
            name : "score",
            store : players
        });
    },

    showAssistPlayer : function(list, record) {
        var session = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid);
        session.score_player_id = record.data.player_id;

        var players = Ext.getStore("Players");
        players.clearFilter();
        players.filter([ {
            filterFn : function(item) {
                return item.get('team') == session.score_team_id;
            }
        } ]);
        players.sort();

        var team = Ext.getStore("Teams").findRecord("team_id", session.score_team_id, false, false, false, true).data;

        this.getMatchesNavigation().push({
            xtype : "matchPlayerList",
            title : "Nahrával " + team.name_short,
            name : "assist",
            store : players
        });
    },

    addPoint : function(list, record) {
        var session = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid);
        var assist_player_id = record.data.player_id;

        var scorer = Ext.getStore("Players").findRecord("player_id", session.score_player_id, false, false, false, true).data;
        var assistent = Ext.getStore("Players").findRecord("player_id", assist_player_id, false, false, false, true).data;
        var message = "Skóroval " + fullName(scorer) + ",<br>nahrával " + fullName(assistent);

        Ext.Msg.confirm("Zadat bod?", message, function(response) {

            if (response == "yes") {
                catcher.app.getController("MatchController").addPointInternal(assist_player_id);
            }
        });
    },

    addPointInternal : function(assist_player_id) {
        var session = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid);
        var points = Ext.getStore("Points");
        var new_id = getNewId(points);

        var point = Ext.create("catcher.model.Point", {
            point_id : new_id,
            team_id : session.score_team_id,
            player_id : session.score_player_id,
            match_id : session.match_id,
            assist_player_id : assist_player_id,
            time : Date.now() / 1000
        });

        // Add the point and raise score.
        points.add(point);
        point.setDirty();

        points.sync();

        var matches = Ext.getStore("Matches");
        var match = matches.findRecord("match_id", session.match_id, false, false, false, true).data;
        if (match.home_id == session.score_team_id) {
            match.score_home++;
        } else {
            match.score_away++;
        }

        matches.findRecord("match_id", session.match_id, false, false, false, true).setDirty();
        matches.sync();

        this.fillMatchDetailContent(match);
        this.getMatchesNavigation().pop(2);
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
        this.fillMatchDetailContent(match);
    },

    fillMatchDetailContent : function(match) {
        this.getMatchDetail().query("button[name=scoreHome]")[0].setText(new String(match.score_home));
        this.getMatchDetail().query("button[name=scoreAway]")[0].setText(new String(match.score_away));
    }
});

function fullName(player) {
    return player.surname + " " + player.name + " #" + player.number;
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
            assistPlayer : assistPlayer != null ? fullName(assistPlayer.data) : "",
            pointId : item.get("point_id"),
            time : item.get("time")
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
            }, {
                name : 'time',
                type : 'date',
                dateFormat : 'timestamp'
            } ]
        }
    });

    return new Ext.data.Store({
        model : 'PointView',
        data : pointsToDisplay,
        sorters : [ {
            property : 'time',
            direction : 'DESC'
        } ]
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
