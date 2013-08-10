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
				title: "Nastaven� z�pasu",
				instructions: "",
				
				items:	[
					{
						xtype: "selectfield",
						label: "H�i�t�",
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
				text: "Ulo�it",
				ui: "confirm"
			}			
		],
		listeners: {
							 
		},														
	}				
});