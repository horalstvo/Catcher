Ext.define("catcher.view.ScoreList", {
    extend : "Ext.List",
    xtype : "scoreList",
    requires : [ "catcher.view.EditPointDetail" ],

    config : {
        title : "Skóre ",
        iconCls : "time",
        styleHtmlContent : true,
        itemTpl : "{scoringPlayer} ({assistPlayer})",
        style : 'font-size : 1.4em',
        onItemDisclosure : true,
    },
});