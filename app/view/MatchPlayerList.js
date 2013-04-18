Ext.define("catcher.view.MatchPlayerList", {
    extend : "Ext.List",
    xtype : "matchPlayerList",
    requires : [ "Ext.Label" ],

    config : {
        styleHtmlContent : true,
        scrollVertical : true,
        items : [ {
            xtype : "label",
            docked : "top",
            name : "teamName"
        } ],
        store : "Players",
        itemTpl : "{number} {name} {surname}",
        style : 'font-size : 2em',
        onItemDisclosure : true,
    },

});
