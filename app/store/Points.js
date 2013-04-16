Ext.define('catcher.store.Points', {
    extend : 'Ext.data.Store',
    requires: ['Ext.data.proxy.JsonP'],
    config : {
        model : 'catcher.model.Point',
        storeId : 'Points',
        proxy : {
            type : 'jsonp',
            url : 'http://frisbee.cz/catcher/app/data/data_body.jsn',
            // url : 'app/data/data_body.jsn',
            reader : {
                type : 'json'
            }
        },
        autoLoad : true
    }
});