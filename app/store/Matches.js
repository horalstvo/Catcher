Ext.define('catcher.store.Matches', {
    extend : 'Ext.data.Store',
    requires: ["Ext.data.proxy.JsonP"],
    config : {
        model : 'catcher.model.Match',
        storeId : 'Matches',
        proxy : {
            type : 'jsonp',
            url : 'http://www.frisbee.cz/catcher/app/scripts/data_loader.php?store=matches',            
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