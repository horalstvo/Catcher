Ext.define("catcher.view.MatchDetailSettings",{
	extend: "Ext.form.Panel",
	xtype: "matchDetailSettings",					
	requires: ["Ext.form.FieldSet","Ext.form.Select","Ext.field.Hidden","Ext.field.DatePicker","Ext.field.Toggle",,"Ext.field.Number"],
	
	config:{
    title : "Nastavení",
    iconCls : "settings",
    id: "matchDetailSettings",
		styleHtmlContent: true,    
		
		items:[
			{
				xtype: "fieldset",
				title: "Nastavení zápasu",
				instructions : "U prvního výhozu přepni Čas běží, při skončení utkání přepni Zápas skončil. Důležité kvůli online přehledu výsledků.",
				
				items:	[
          {
						xtype: "togglefield",
						label: "Zápas začal",
						name: "time_start",
            value: 0
					},
					{
						xtype: "togglefield",
						label: "Zápas skončil",
						name: "time_end",
            value: 0 
					},
					{
						xtype: "selectfield",
						label: "Hřiště",
						name: "field",
						options: []
					},
          {
						xtype: "numberfield",
						label: "Délka utkání",
						name: "length",
					},
          {
						xtype: "datepickerfield",
						label: "Čas utkání",
            dateFormat:"H:i",
						name: "time",
						value: ""
					},
          {
						xtype: "datepickerfield",
            dateFormat: "j.n.Y",
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