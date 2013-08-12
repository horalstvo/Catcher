Ext.define('catcher.controller.MatchController', {
    extend : 'Ext.app.Controller',

    config : {
        refs : {
            matchesNavigation : "matchesNavigation",
            matchDetail : "matchDetail",
            addPointDetail : "addPointDetail",
            editPointDetail : "editPointDetail",
            scoreList : "scoreList",
            matchDetailSettings : "matchDetailSettings"
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
            "matchDetail button[name=deletePointHome]" : {
                tap : "deletePointHome"
            },
            "matchDetail button[name=deletePointAway]" : {
                tap : "deletePointAway"
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
        this.fillMatchDetailSettings(match);
    },

    deletePointHome : function() {
        var playersSize = Ext.getStore("Players").size;
        if (playersSize > 0) {
            this.showScoreHome();
        } else {
            var session = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid);
            var match = Ext.getStore("Matches").findRecord("match_id", session.match_id, false, false, false, true).data;
            var lastPointId = this.getLastPointId(match.match_id, match.home_id);
            if (lastPointId > 0) {
                this.removePointFromStore(lastPointId);
            }
        }
    },

    deletePointAway : function() {
        var playersSize = Ext.getStore("Players").size;
        if (playersSize > 0) {
            this.showScoreAway();
        } else {
            var session = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid);
            var match = Ext.getStore("Matches").findRecord("match_id", session.match_id, false, false, false, true).data;
            var lastPointId = this.getLastPointId(match.match_id, match.away_id);

            if (lastPointId > 0) {
                this.removePointFromStore(lastPointId);
            }
        }
    },

    getLastPointId : function(match_id, team_id) {
        var teamPoints = Ext.getStore("Points");
        teamPoints.clearFilter();
        teamPoints.filter([ {
            filterFn : function(item) {
                return item.get('match_id') == match_id && item.get('team_id') == team_id;
            }
        } ]);
        teamPoints.sort();

        var lastPoint = teamPoints.first()
        console.log("last point: ", lastPoint);

        if (lastPoint != undefined) {
            return lastPoint.get("point_id");
        }
        return 0;
    },

    addPointHome : function() {
        var session = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid);
        var match = Ext.getStore("Matches").findRecord("match_id", session.match_id, false, false, false, true).data;
        session.score_team_id = match.home_id;
        var playersSize = Ext.getStore("Players").size;
        if (playersSize > 0) {
            this.showAddPoint();
        } else {
            session.score_player_id = null;
            this.addPointInternal(null);
        }
    },

    addPointAway : function() {
        var session = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid);
        var match = Ext.getStore("Matches").findRecord("match_id", session.match_id, false, false, false, true).data;
        session.score_team_id = match.away_id;

        var playersSize = Ext.getStore("Players").size;
        if (playersSize > 0) {
            this.showAddPoint();
        } else {
            session.score_player_id = null;
            this.addPointInternal(null);
        }
    },

    showAddPoint : function() {
        var session = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid);
        var team = Ext.getStore("Teams").findRecord("team_id", session.score_team_id, false, false, false, true).data;

        this.getMatchesNavigation().push({
            xtype : "matchPlayerList",
            title : "Skóroval " + team.name_short,
            name : "score",
            store : this.getPlayersByTeam(session.score_team_id)
        });
    },

    showAssistPlayer : function(list, record) {
        var session = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid);
        session.score_player_id = record.data.player_id;
        var team = Ext.getStore("Teams").findRecord("team_id", session.score_team_id, false, false, false, true).data;

        this.getMatchesNavigation().push({
            xtype : "matchPlayerList",
            title : "Nahrával " + team.name_short,
            name : "assist",
            store : this.getPlayersByTeam(session.score_team_id)
        });
    },

    getPlayersByTeam : function(team_id) {
        var players = Ext.getStore("Players");
        players.clearFilter();
        players.filter([ {
            filterFn : function(item) {
                return item.get('team') == team_id;
            }
        } ]);
        players.sort();
    },

    addPoint : function(list, record) {
        var session = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid);
        var assist_player_id = record.data.player_id;

        var scorer = Ext.getStore("Players").findRecord("player_id", session.score_player_id, false, false, false, true).data;
        var assistent = Ext.getStore("Players").findRecord("player_id", assist_player_id, false, false, false, true).data;
        var message = "Bod: " + fullName(scorer) + "<br />Asistence: " + fullName(assistent);

        Ext.Msg.confirm("Zadat bod?", message, function(response) {
            if (response == "yes") {
                var matchController = catcher.app.getController("MatchController");
                matchController.addPointInternal(assist_player_id);
                matchController.getMatchesNavigation().pop(2);
            }
        });
    },

    addPointInternal : function(assist_player_id) {
        var session = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid);
        var points = Ext.getStore("Points");
        var matches = Ext.getStore("Matches");

        var point = Ext.create("catcher.model.Point", {
            team_id : session.score_team_id,
            player_id : session.score_player_id,
            match_id : session.match_id,
            assist_player_id : assist_player_id,
            time : Math.round(+new Date() / 1000)
        });

        console.log("adding point: ", point);

        // nezbytné kvůli pomalému připojení, bez callbacku se nestihne stáhnout aktualizovaný points store, a pak je celá naše režije v pr...
        Ext.data.Store.prototype.syncWithListener = function(onWriteComplete, syncMethod) {

            this.on('write', onWriteComplete, this, {
                single : true
            });

            var syncResult = syncMethod ? syncMethod.apply(this) : this.sync();

            if (syncResult.added.length === 0 && syncResult.updated.length === 0 && syncResult.removed.length === 0) {

                this.removeListener('write', onWriteComplete, this, {
                    single : true
                });
                onWriteComplete(this);
            }

            return syncResult;
        };

        // přidat bod do interní DB, synchronizovat a označit jako zpracované
        point.setDirty();
        points.add(point);
        Ext.Viewport.setMasked({
            xtype : "loadmask",
            message : "Ukládám bod na frisbee.cz"
        });
        points.syncWithListener(function() {
            var controller = catcher.app.getController("MatchController");
            controller.updateMatchPoints(point.get("match_id"));
            controller.updateMatchInfo(point.get("match_id"));
        });
    },

    updateMatchInfo : function(match_id) {
        var matches = Ext.getStore("Matches");
        matches.getProxy().setExtraParam("id", match_id);
        matches.load(function() {
            var match = matches.findRecord("match_id", match_id, false, false, false, true);
            var controller = catcher.app.getController("MatchController");
            controller.fillMatchDetailContent(match.data);
        });
        matches.getProxy().setExtraParams({});
    },

    // nastavení počitadla u všech bodů konkrétního zápasu
    updateMatchPoints : function(match_id) {
        var points = Ext.getStore("Points");
        points.getProxy().setExtraParam("match_id", match_id);
        points.load(function() {
            Ext.Viewport.setMasked(false);
        });
        points.getProxy().setExtraParams({});
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
        var point = Ext.getStore("Points").findRecord("point_id", record.data.pointId, false, false, false, true).data;

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

        var point = Ext.getStore("Points").findRecord("point_id", values.pointId, false, false, false, true);
        point.set("player_id", values.scoringPlayer);
        point.set("assist_player_id", values.assistPlayer);
        Ext.getStore("Points").sync();

        // Back and reload.
        this.getMatchesNavigation().pop();
        var matchId = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid).match_id;
        var scoringPlayer = Ext.getStore("Players").findRecord("player_id", values.scoringPlayer, false, false, false, true).data;
        this.getScoreList().setStore(getTeamScore(matchId, scoringPlayer.team));
        this.getScoreList().deselectAll();
    },

    deletePoint : function() {
        var values = this.getEditPointDetail().getValues();
        this.removePointFromStore(values.pointId);
    },

    removePointFromStore : function(pointId) {
        var points = Ext.getStore("Points");
        var remove = points.findRecord("point_id", pointId, false, false, false, true);
        var match_id = remove.get("match_id");
        var match_id = remove.get("match_id");

        points.remove(remove);

        console.log("Point to remove: ", remove);

        points.sync();
        this.updateMatchPoints(match_id);
        this.updateMatchInfo(match_id);
    },

    fillMatchDetailContent : function(match) {
        this.getMatchDetail().query("button[name=scoreHome]")[0].setText(new String(match.score_home));
        this.getMatchDetail().query("button[name=scoreAway]")[0].setText(new String(match.score_away));
        getTeamScore(match.match_id, match.home_id);
        getTeamScore(match.match_id, match.away_id);
        Ext.getStore("Points").clearFilter();
    },

    fillMatchDetailSettings : function(match) {
        this.getMatchDetailSettings().setValues({
            match_id : match.match_id,
            field : match.field,
            date : match.time,
            time : match.time,
            length : match.length,
        });
    }
});

function fullName(player) {
    return player.nick + " #" + player.number + " <small>(" + player.surname + " " + player.name + ")</small>";
}

function fullNameInput(player) {
    return player.nick + " #" + player.number + " (" + player.surname + " " + player.name + ")";
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
            scoringPlayer : scoringPlayer != null ? fullName(scoringPlayer.data) : "",
            assistPlayer : assistPlayer != null ? fullName(assistPlayer.data) : "",
            pointId : item.get("point_id"),
            time : item.get("time"),
            score_home : item.get("score_home"),
            score_away : item.get("score_away")
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
            }, {}, {
                name : 'score_home',
                type : 'int'
            }, {}, {
                name : 'score_away',
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
        text : fullNameInput(player),
        value : player.player_id
    };
}