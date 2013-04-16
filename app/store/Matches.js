Ext.define('catcher.store.Matches', {
    extend : 'Ext.data.Store',
    requires: ['Ext.data.proxy.JsonP'],
    config : {
        model : 'catcher.model.Match',
        storeId : 'Matches',
        proxy : {
            type : 'jsonp',
            // url : 'app/data/data_zapasy.jsn',
            url : 'http://frisbee.cz/catcher/app/data/data_zapasy.jsn',
            reader : {
                type : 'json'
            }
        },
        sorters : {
            property : "time",
            direction : "ASC"
        },
        // grouper: function(record){
        // return record.get("home_name_short")[0];
        // },
        autoLoad : true
    }
});