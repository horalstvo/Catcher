Ext.define("catcher.view.ScoreList", {
    extend : "Ext.List",
    xtype : "scoreList",
    requires : [ "catcher.view.EditPointDetail" ],
    loadingText: "Aktualizuji data z www.frisbee.cz",

    config : {
        id : "scoreList",
        title : "Skóre ",
        iconCls : "time",
        styleHtmlContent : true,
        itemTpl : "Stav: {score_home}:{score_away}, <small>{time:date('G:i, d.m')}</small><br /><strong>S: {scoringPlayer}</strong><br />A: {assistPlayer}",
        style : 'font-size : 1.4em',
        onItemDisclosure : true,
        listeners : {
            activate : function() {
                this.getStore().sort();
            }
        }
    },
});