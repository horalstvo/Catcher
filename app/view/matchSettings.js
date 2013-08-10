Ext.define("catcher.view.MatchSettings",{
	extend: "Ext.form.Panel",
	xtype: "matchSettings",
	id: "matchSettings",				
	requires: ["Ext.form.FieldSet","Ext.form.Select","Ext.field.Hidden"],
	
	config:{
		styleHtmlContent: true,
		
		items:[
			{
				xtype: "fieldset",
				title: "Nastavení zápasu",
				instructions: "",
				
				items:	[
					{
						xtype: "selectfield",
						label: "Høištì",
						name: "field",
						options: []
					},
          {
						xtype: "datePicker",
						label: "Datum",
						name: "date",
						value: ""
					},
					{
						xtype: "hiddenfield",
						name: "match_id",
						value: ""
					}
				]				
			},
			{
				xtype: "button",
				text: "Uložit",
				ui: "confirm"
			}			
		],
		listeners: {
							 
		},														
	}				
});