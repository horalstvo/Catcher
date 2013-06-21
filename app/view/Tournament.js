Ext.define("catcher.view.Tournament", {
	extend : "Ext.tab.Panel",
	xtype : "tournamentPanel",
	requires : [ "Ext.device.Device", "Ext.data.Model", "Ext.data.Store" ],

	// initialize: function(){
	// this.getTabBar().add({
	// xtype: "button",
	// ui: "decline",
	// id: "logout",
	// iconCls: "action",
	// iconMask: true,
	// docked: "right",
	// height: "30px",
	// margin: "10px 4px 0px 0px"
	// });
	// },

	config : {
		tabBarPosition : "bottom",
		id: "tournament",
		items : [ {
			xtype : "matchesNavigation"
		}, {
			xtype : "teamList"
		}, ],
	}
});