Ext.define("catcher.view.ScoreList", {
    extend : "Ext.List",
    xtype : "scoreList",
    requires : [ "catcher.view.EditPointDetail" ],

    config : {
        id : "scoreList",
        title : "Skóre ",
        iconCls : "time",
        styleHtmlContent : true,
        itemTpl : "{scoringPlayer} ({assistPlayer})",
        style : 'font-size : 1.4em',
        onItemDisclosure : true,
        listeners : {
            activate : function() {
                this.getStore().sort();
            }
        }
    },
});