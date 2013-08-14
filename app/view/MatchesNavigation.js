Ext.define("catcher.view.MatchesNavigation", {
    extend : "Ext.navigation.View",
    xtype : "matchesNavigation",
    requires : [ "catcher.view.MatchDetail", "catcher.view.MatchesList", "catcher.view.AddPointDetail", "catcher.view.ScoreList", "catcher.view.MatchPlayerList" ],
    config : {
        title : "Zápasy",
        iconCls : "time",
        id : "matchesNavigation",

        items : [ {
            xtype : 'matchesList'
        } ],

        navigationBar : {
            id:"navigace",
            defaults: {
                iconMask: true
            },
            items : [ 
            {
              xtype: "button",
              iconCls:"star",
              name:"all",
              align:"left",
              ui:"decline",
              filtr:true,
              handler:function(){
                this.up("navigationview").showInfo("all","Všechny zápasy");
              }
            },
            {
              xtype: "button",
              iconCls:"time",
              name:"next",
              align:"left",
              filtr:true,
              handler:function(){
                this.up("navigationview").showInfo("next","Neodehraná utkání");
              }
            },
            {
              xtype: "button",
              iconCls:"trash",
              name:"past",
              align:"left",
              filtr:true,
              handler:function(){
                this.up("navigationview").showInfo("past","Odehrané zápasy");
              }
            }
            ,{
                xtype : "button",                
                iconCls : "refresh",
                ui:"confirm",                
                align : "right",
                name : "refreshConfirm",
                id : "refreshStores",
                handler : function() {                        
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
    },
    
    showInfo:function(show,msg){
      var btn = this.query("button[filtr=true]");
      btn.forEach(function(element){
        if(element.name != show) element.setUi("dark");
        if(element.name == show) element.setUi("decline");  
      });
      if(msg != false) {      
        Ext.Viewport.setMasked({
          xtype : 'loadmask',
          message: msg,
          indicator: false
        });
      }
      var store = Ext.getCmp("matchesList").getStore();
      store.clearFilter();
      if(show!="all"){
        store.filterBy(function(record){                    
          if(show == "past"){                            
            if(record.get("time_end").getTime() > 0) return true;
            return false;
          }
          if(show == "next"){                
            if(record.get("time_end").getTime() == 0) return true;
            return false;
          }
        });
      }
      if(msg != false) {
        window.setTimeout(function(){
          Ext.Viewport.setMasked(false);
        },1000);
      }
    }
});