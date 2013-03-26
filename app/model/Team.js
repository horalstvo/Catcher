Ext.define('catcher.model.Team', {
  extend: 'catcher.model.Player',
  config: {
	  idProperty: 'team_id',
	    fields: [
	    	{name: 'team_id', type: 'int'},
	      {name: 'name_short', type: 'string'},
	      {name: 'name_full', type: 'string'}
	  ]
	}
});