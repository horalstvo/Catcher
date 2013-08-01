Ext.define("catcher.view.MatchesList", {
    extend : "Ext.List",
    xtype : "matchesList",    

    config : {
        title : "Zápasy",
        iconCls : "time",
        styleHtmlContent : true,
        style : 'font-size : 1.4em',
        id : "matchesList",
        items : [],

        store : "Matches",
        loadingText: "Aktualizuji data z www.frisbee.cz",
        itemTpl : "{home_name_full} vs. {away_name_full} ({score_home}:{score_away}) - {time:date('G:i')}",
        onItemDisclosure : true,
        listeners : {
            painted : function() {
                var store = Ext.getStore("Matches");
                store.getProxy().setExtraParams({});
                store.clearFilter();
                store.load(function(){
                  var session = Ext.getStore("Session").findRecord("uuid", Ext.device.Device.uuid);                
                  store.filter("tournament_id", session.get("tournament_id")*1);
                });                
                Ext.getCmp("tournament").getTabBar().show();
                Ext.getCmp("matchesList").deselectAll();
            }
        }
    },
});