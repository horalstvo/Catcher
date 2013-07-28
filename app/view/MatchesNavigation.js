Ext.define("catcher.view.MatchesNavigation", {
    extend : "Ext.navigation.View",
    xtype : "matchesNavigation",
    requires : [ "catcher.view.MatchDetail", "catcher.view.MatchesList", "catcher.view.AddPointDetail", "catcher.view.ScoreList",
            "catcher.view.MatchPlayerList" ],
    config : {
        title : "Zápasy",
        iconCls : "time",
        id : "matchesNavigation",
        styleHtmlContent : true,

        items : [ {
            xtype : 'matchesList'
        } ],

        navigationBar : {
            items : [ {
                xtype : "button",
                iconMask : true,
                iconCls : "refresh",
                align : "right",
                name : "refreshConfirm",
                id : "refreshStores",
                handler : function() {
                    // window.location.reload();
                    var matchList = Ext.getCmp("matchesList");
                    if (typeof matchList != 'undefined') {
                        matchList.getStore().load();
                    }

                    var scoreList = Ext.getCmp("scoreList");
                    if (typeof scoreList != 'undefined') {
                        scoreList.getStore().load();
                    }

                    var match_id = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid).match_id;
                    if (typeof match_id != 'undefined' && typeof Ext.getCmp("matchDetail") != "undefined") {
                        var matches = Ext.getStore("Matches");
                        matches.load();
                        var match = matches.findRecord("match_id", match_id, false, false, false, true).data;
                        catcher.app.getController("MatchController").fillMatchDetailContent(match);
                    }
                }
            } ]
        }
    }
});