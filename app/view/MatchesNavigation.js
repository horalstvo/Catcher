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
                    var scoreList = Ext.getCmp("scoreList");
                    var matchDetail = Ext.getCmp("matchDetail");
                    var points = Ext.getStore("Points");
                    points.sync();
                    
                    var matches = Ext.getStore("Matches");
                    var match_id = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid).match_id;
                    
                    if (typeof matchList != 'undefined') {
                        matchList.getStore().load();
                    }

                    
                    if (typeof scoreList != 'undefined') {                                          
                      points.clearFilter();
                      points.load(function(){
                        scoreList.getStore().load();
                      });                                                                  
                    }

                                                           
                    if (typeof match_id != 'undefined' && typeof matchDetail != 'undefined') {                        
                        Ext.Viewport.setMasked({
                          xtype : 'loadmask',
                          message : 'Aktualizuji data z www.frisbee.cz',
                          indicator : true
                        });                                                
                        matches.load(function(){
                          var match = matches.findRecord("match_id", match_id, false, false, false, true).data;
                          Ext.Viewport.setMasked(false);
                          catcher.app.getController("MatchController").fillMatchDetailContent(match);                          
                        });                                                  
                    }
                }
            } ]
        }
    }
});