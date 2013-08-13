Ext.define("catcher.view.MatchDetail", {
    extend : "Ext.tab.Panel",
<<<<<<< HEAD
    xtype : "matchDetail",            

    config : {
      id : "matchDetail",
      tabBarPosition : "bottom",
        items:[
          {xtype: "matchDetailCounter"},
          {xtype: "matchDetailSettings"},
          {xtype: "matchDetailScore"},
        ]        
        ,
=======
    xtype : "matchDetail",

    config : {
        id : "matchDetail",
        tabBarPosition : "bottom",
        items : [ {
            xtype : "matchDetailCounter"
        }, {
            xtype : "matchDetailSettings"
        }, {
            xtype : "matchDetailScore"
        }, ],
>>>>>>> 50305f36381b3eff457eddabb990ec355c3594d3
        listeners : {
            painted : function() {
                Ext.getCmp("tournament").getTabBar().hide();
            },
<<<<<<< HEAD
            show : function(){
            this.query('.button').forEach(function(c){
//               zřejmě bug sencha, vrací jinou třídu, než ve skutečnosti má mít   
//               var pressedCls = c.getPressedCls();
              var pressedCls = "x-button-pressed";         
              c.removeCls(pressedCls);
            });
          }          
      },
=======
            show : function() {
                this.query('.button').forEach(function(c) {
                    // zřejmě bug sencha, vrací jinou třídu, než ve skutečnosti má mít
                    // var pressedCls = c.getPressedCls();
                    var pressedCls = "x-button-pressed";
                    c.removeCls(pressedCls);
                });
            }
        },
>>>>>>> 50305f36381b3eff457eddabb990ec355c3594d3
    }
});