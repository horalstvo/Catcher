Ext.define('catcher.model.Match', {
  extend: 'Ext.data.Model',
  config: {
	  idProperty: 'match_id',
	    fields: [
	    	{name: 'match_id', type: 'int'},
	    	{name: 'tournament_id', type: 'int'},
	      {name: 'home_id', type: 'int'},
	      {name: 'away_id', type: 'int'},
	      {name: 'home_name_short', type: 'string'},
	      {name: 'away_name_short', type: 'string'},
	      {name: 'home_name_full', type: 'string'},
	      {name: 'away_name_full', type: 'string'},
	      {name: 'score_home', type: 'int'},
	      {name: 'score_away', type: 'int'},
	      {name: 'spirit_home', type: 'int'},
	      {name: 'spirit_away', type: 'int'},
	      {name: 'field', type: 'int'},
	      {name: 'time', type: 'date', dateFormat: "timestamp"},
<<<<<<< HEAD
        {name: 'time_end', type: 'date', dateFormat: "timestamp"},
        {name: 'time_start', type: 'date', dateFormat: "timestamp"},
        {name: 'length', type: 'int'},
        {name: 'in_play', type: 'boolean'}
=======
        {name: 'time_start', type: 'date', dateFormat: "timestamp"},
        {name: 'time_end', type: 'date', dateFormat: "timestamp"},
        {name: 'length', type: 'int'}
>>>>>>> 50305f36381b3eff457eddabb990ec355c3594d3
	  ]
	}
});