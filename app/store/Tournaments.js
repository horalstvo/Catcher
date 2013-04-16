Ext.define('catcher.store.Tournaments', {
    extend : 'Ext.data.Store',
    requires: ['Ext.data.proxy.JsonP'],
    config : {
        model : 'catcher.model.Tournament',
        storeId : 'Tournaments',
        proxy : {
            type : 'jsonp',
            // url: 'app/data/data_turnaje.jsn',
            url : 'http://frisbee.cz/catcher/app/data/data_turnaje.php',
        },
        autoLoad : true
    }
});