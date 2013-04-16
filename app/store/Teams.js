Ext.define('catcher.store.Teams', {
    extend : 'Ext.data.Store',
    requires: ['Ext.data.proxy.JsonP'],
    config : {
        model : 'catcher.model.Team',
        storeId : 'Teams',
        proxy : {
            type : 'jsonp',
            // url : 'app/data/data_tymy.jsn',
            url : 'http://frisbee.cz/catcher/app/data/data_tymy.jsn',
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