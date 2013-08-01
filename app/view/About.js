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
			"<h2>Maribor build verze 0.9</h2> <p>Pre-alpha verze aplikace, určeno pro testování skórování vybraných zápasů</p><p>Jestli něco nefunguje, tak nahlásit TM (Kačer, Ondra)</p> <p>Nápady a podněty tamtéž </p>"
		].join("")		
	}				
});