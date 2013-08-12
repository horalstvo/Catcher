Ext.define("catcher.view.MatchDetail", {
    extend : "Ext.tab.Panel",
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
        listeners : {
            painted : function() {
                Ext.getCmp("tournament").getTabBar().hide();
            },
            show : function() {
                this.query('.button').forEach(function(c) {
                    // zřejmě bug sencha, vrací jinou třídu, než ve skutečnosti má mít
                    // var pressedCls = c.getPressedCls();
                    var pressedCls = "x-button-pressed";
                    c.removeCls(pressedCls);
                });
            },
        },
    }
});