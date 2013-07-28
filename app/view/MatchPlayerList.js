Ext.define("catcher.view.MatchPlayerList", {
    extend : "Ext.List",
    xtype : "matchPlayerList",
    requires : [ "Ext.Label" ],

    config : {
        scrollVertical : true,
        store : "Players",
        itemTpl : "{surname} {name} ({number})",
        style : 'font-size : 1.2em',
        onItemDisclosure : true,
        listeners : {
            activate : function() {
                this.getStore().sort();
            }
        }
    },
});
