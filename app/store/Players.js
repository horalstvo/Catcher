Ext.define('catcher.store.Players', {
    extend : 'Ext.data.Store',
    requires: ['Ext.data.proxy.JsonP'],
    config : {
        model : 'catcher.model.Player',
        storeId : 'Players',
        proxy : {
            type : 'jsonp',
            // url : 'app/data/data_hraci.jsn',
            url : 'http://frisbee.cz/catcher/app/data/data_hraci.jsn',
            reader : {
                type : 'json'
            }
        },
        sorters : "surname",
        autoLoad : true
    }
});