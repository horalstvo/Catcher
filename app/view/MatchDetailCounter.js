Ext.define("catcher.view.MatchDetailCounter", {
  extend : "Ext.Panel",
  xtype : "matchDetailCounter",      
  requires : [ "Ext.SegmentedButton"],
  config: {
    title : "Zápas",
    iconCls : "bookmarks",
    id: "matchDetailCounter",
    layout : "vbox",
    styleHtmlContent : true,
    
    items : [{
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
        style : "font-size: 5em; margin-top : 20px",
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
    }]
  }
});