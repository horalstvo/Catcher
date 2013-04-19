Ext.define("catcher.view.MatchPlayerList", {
    extend : "Ext.List",
    xtype : "matchPlayerList",
    requires : [ "Ext.Label" ],

    config : {
        scrollVertical : true,
        items : [ {
            xtype : "label",
            docked : "top",
            name : "teamName",
            style : 'font-size : 1em'
        } ],
        store : "Players",
        itemTpl : "{number} {name} {surname}",
        style : 'font-size : 1.4em',
        onItemDisclosure : true,
    },

});
