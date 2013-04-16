Ext.define('catcher.store.Points', {
    extend : 'Ext.data.Store',
    config : {
        model : 'catcher.model.Point',
        storeId : 'Points',
        proxy : {
            type : 'ajax',
            url : 'frisbee.cz/catcher/app/data/data_body.jsn',
            // url : 'app/data/data_body.jsn',
            reader : {
                type : 'json'
            }
        },
        autoLoad : true
    }
});