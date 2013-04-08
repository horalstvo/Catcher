Ext.define("catcher.view.ScoreList", {
    extend : "Ext.List",
    xtype : "scoreList",

    config : {
        title : "Skóre týmu",
        iconCls : "time",
        styleHtmlContent : true,

        items : [], 

        itemTpl : "{scoringPlayer} ({assistPlayer})",
        onItemDisclosure : true,
    },
});