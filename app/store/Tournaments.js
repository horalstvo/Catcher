Ext.define('catcher.store.Tournaments', {
    extend : 'Ext.data.Store',
    config : {
        model : 'catcher.model.Tournament',
        storeId : 'Tournaments',
        proxy : {
            type : 'ajax',
            // url: 'app/data/data_turnaje.jsn',
            url : 'frisbee.cz/catcher/app/data/data_turnaje.jsn',
            reader : {
                type : 'json'
            }
        },
        autoLoad : true
    }
});