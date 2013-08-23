Ext.define("catcher.view.TeamRoster", {
    extend : "Ext.List",
    xtype : "teamRoster",
    id: "teamRoster",

    config : {        
        mode: "MULTI",        
        store : "Rosters",
        itemTpl : "<strong>{nick} #{number}</strong> <small>({surname} {name})</small>",
        onItemDisclosure : false,
        loadingText: "Stahuji kompletní soupisku týmu",                
        items:[
          {
            docked: 'top',
            xtype: 'toolbar',
            title: 'Soupiska',
            defaults: {
              iconMask: true
            },
            items:[
              {
                xtype: "button",
                align:"left",
                iconCls: "delete",
                ui: "decline",
                handler: function(){
                  this.up("modalPanel").hide();
                }
              },
              {
                xtype: "spacer"
              },
              {
                xtype: "button",
                align:"right",
                iconCls: "check2",
                ui: "confirm",
                handler: function(){
                  console.log(this.up("teamRoster").getSelection());                  
                }
              }
            ]
          },
        ],
        listeners : {
            painted : function() {              
              var active_team = Ext.getCmp("addPlayer").target;
              var store = this.getStore();
              var active_team_master = Ext.getStore("Teams").findRecord("team_id",active_team,false,false,false,true).get("master_id");
              var list = this;
              store.clearFilter();
              store.getProxy().setExtraParam("team",active_team);
              store.load(function(){              
                store.filter([ {
                  filterFn : function(item) {
                      return item.get('team') == active_team_master;
                  }
                } ]);
                var aktivni = Ext.getStore("Players");
                var select = new Array;
                aktivni.filter("team",active_team);
                aktivni.each(function(item){
                  var toPush = store.findRecord("player_id",item.get("player_id"),false,false,false,true);
                  if(toPush !== null) select.push(toPush);                   
                });
                list.select(select);
              });
            },
        }
    },
});
