Ext.define("catcher.view.MatchDetail", {
    extend : "Ext.Panel",
    xtype : "matchDetail",
    requires : [ "Ext.carousel.Carousel", "catcher.view.MatchPlayerList", "Ext.SegmentedButton" ],

    config : {
        title : "Match Detail",
        layout : "vbox",
        styleHtmlContent : true,

        items : [ {
            xtype : "segmentedbutton",
            styleHtmlContent : true,
            style : "font-size: 3em",
            layout : {
                align : "stretchmax",
                pack : "center",
                type : "hbox"
            },
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
            xtype : "carousel",
            flex : 1,
            layout : {
                align : "stretchmax",
                pack : "center",
            },
            items : [ {
                xtype : "matchPlayerList",
                name : "homeTeam"
            }, {
                xtype : "matchPlayerList",
                name : "awayTeam"
            } ],
        } ]
    },
});