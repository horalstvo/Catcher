Ext.define('catcher.store.Players', {
    extend : 'Ext.data.Store',
    requires: ["Ext.data.proxy.Rest"],
    config : {
        model : 'catcher.model.Player',
        storeId : 'Players',
        proxy : {
            type : 'rest',
            url : 'http://www.frisbee.cz/catcher/app/scripts/data_loader.php?store=players&',            
        },
        sorters : "surname",
        // grouper: function(record){
        // return record.get("player_surname")[0];
        // },
        autoLoad : true
    }
});