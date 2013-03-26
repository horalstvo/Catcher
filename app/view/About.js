Ext.define("catcher.view.About",{
	extend: "Ext.Panel",
	xtype: "aboutPanel",
	requires: ['Ext.TitleBar'],	
	
	config:{
		title: "O aplikaci",
		iconCls: "info",
		styleHtmlContent: true,
		
		items:[
			{
				xtype: "titlebar",
				title: "O aplikaci",
				docked: "top"
			}
		],
		
		html: [
			"Základní info o aplikaci ..."
		].join("")		
	}				
});