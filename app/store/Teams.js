Ext.define('catcher.store.Teams', {
    extend : 'Ext.data.Store',
    config : {
        model : 'catcher.model.Team',
        storeId : 'Teams',
        proxy : {
            type : 'ajax',
            // url : 'app/data/data_tymy.jsn',
            url : 'frisbee.cz/catcher/app/data/data_tymy.jsn',
            reader : {
                type : 'json'
            }
        },
        sorters : "name_short",
        grouper : function(record) {
            return record.get("name_short")[0];
        },
        autoLoad : true
    }
});