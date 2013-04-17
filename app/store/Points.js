Ext.define('catcher.store.Points', {
    extend : 'Ext.data.Store',
    config : {
        model : 'catcher.model.Point',
        storeId : 'Points',
        proxy : {
            type : 'jsonp',
            url : 'http://www.frisbee.cz/catcher/app/scripts/data_loader.php?store=points',
        },
        autoLoad : true
    }
});