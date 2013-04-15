Ext.define("catcher.view.ScoreList", {
    extend : "Ext.List",
    xtype : "scoreList",
    requires : [ "catcher.view.EditPointDetail" ],

    config : {
        title : "Skóre týmu",
        iconCls : "time",
        styleHtmlContent : true,
        itemTpl : "{scoringPlayer} ({assistPlayer})",
        onItemDisclosure : true,
    },
});