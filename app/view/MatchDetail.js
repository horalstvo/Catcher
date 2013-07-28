Ext.define("catcher.view.MatchDetail", {
    extend : "Ext.Panel",
    xtype : "matchDetail",
    requires : [ "Ext.SegmentedButton" ],

    config : {
        title : "Match Detail",
        layout : "vbox",
        styleHtmlContent : true,

        items : [ {
            xtype : "segmentedbutton",
            layout : {
                align : "stretchmax",
                pack : "center",
                type : "hbox"
            },
            style : "font-size: 3em",
            items : [ {
                xtype : "button",
                flex : 1,
                name : "scoreHome",
                text : "[home]",
            }, {
                xtype : "button",
                flex : 1,
                name : "scoreAway",
                text : "[away]",
            } ],
        }, {
            xtype : "segmentedbutton",
            layout : {
                align : "stretchmax",
                pack : "center",
                type : "hbox"
            },
            style : "font-size: 5em",
            items : [ {
                xtype : "button",
                flex : 1,
                name : "addPointHome",
                text : "+",
            }, {
                xtype : "button",
                flex : 1,
                name : "addPointAway",
                text : "+",
            } ],
        } ],
        listeners : {
            painted : function() {
                Ext.getCmp("tournament").getTabBar().hide();
            }
        }
    },
});