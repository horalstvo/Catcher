Ext.define("catcher.view.MatchDetailSettings",{
	extend: "Ext.form.Panel",
	xtype: "matchDetailSettings",					
	requires: ["Ext.form.FieldSet","Ext.form.Select","Ext.field.Hidden","Ext.field.DatePicker","Ext.field.Toggle","Ext.field.Number","Ext.ux.DateTimePicker"],
	
	config:{
    title : "Nastavení",
    iconCls : "settings",
    id: "matchDetailSettings",
// 		styleHtmlContent: true,    
		
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
						xtype: "datetimepickerfield",
            dateTimeFormat: "j.n.Y H:i",
						label: "Datum a čas",
						name: "time",
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
        name: "submit",
				text: "Uložit",
				ui: "confirm"
			}			
		],
		listeners: {
		},														
	}				
});