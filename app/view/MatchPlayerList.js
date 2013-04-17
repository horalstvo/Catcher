Ext.define("catcher.view.MatchPlayerList", {
    extend : "Ext.List",
    xtype : "matchPlayerList",

    config : {
        title : "Team_name",
        styleHtmlContent : true,
        scrollVertical : true,
        items : [],
        store : "Players",
        itemTpl : "{number} {name} {surname}",
        style : 'font-size : 2em',
        onItemDisclosure : true,
    },

});
