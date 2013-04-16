Ext.define('catcher.store.Evidence', {
    extend : 'Ext.data.TreeStore',
    config : {
        model : 'catcher.model.Evidence',
        storeId : 'Evidence',
        defaultRootProperty : 'items',
        root : {
            text : "Players",
            items : new Array
        },
        autoLoad : true,
        listeners : {
            updaterecord : function() {
                // console.log("test");
            }
        }
    }
});