Ext.define('catcher.store.Players', {  
  extend: 'Ext.data.Store',
  config: {
  	model: 'catcher.model.Player',
	  storeId: 'Players',
	  proxy: {
      type: 'ajax',
      url: 'app/data/data_hraci.jsn',
      reader: {
          type: 'json'
      }
	  },
	  sorters: "surname",
// 	  grouper: function(record){  	
// 			return record.get("player_surname")[0];
// 		},
		autoLoad: true
	}  
});