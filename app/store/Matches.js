Ext.define('catcher.store.Matches', {
    extend : 'Ext.data.Store',
    config : {
        model : 'catcher.model.Match',
        storeId : 'Matches',
        proxy : {
            type : 'ajax',
            // url : 'app/data/data_zapasy.jsn',
            url : 'frisbee.cz/catcher/app/data/data_zapasy.jsn',
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