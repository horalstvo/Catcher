Ext.define('catcher.model.Point', {
    extend : 'Ext.data.Model',
    config : {
        idProperty : 'point_id',
        fields : [ {
            name : 'team_id',
            type : 'int'
        }, {
            name : 'player_id',
            type : 'int'
        }, {
            name : 'assist_player_id',
            type : 'int'
        }, {
            name : 'match_id',
            type : 'int'
        }, ]
    },
});