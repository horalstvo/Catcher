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
<<<<<<< HEAD
				instructions : "U prvního výhozu přepni Čas běží, při skončení utkání přepni zpátky.",
=======
				instructions : "U prvního výhozu přepni Čas běží, při skončení utkání přepni Zápas skončil. Důležité kvůli online přehledu výsledků.",
>>>>>>> 50305f36381b3eff457eddabb990ec355c3594d3
				
				items:	[
          {
						xtype: "togglefield",
<<<<<<< HEAD
						label: "Čas běží",
						name: "in_play",
            value: 0
					},
					{
=======
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
>>>>>>> 50305f36381b3eff457eddabb990ec355c3594d3
						xtype: "selectfield",
						label: "Hřiště",
						name: "field",
						options: []
					},
          {
						xtype: "numberfield",
<<<<<<< HEAD
						label: "Délka utkání [min]",
=======
						label: "Délka utkání",
>>>>>>> 50305f36381b3eff457eddabb990ec355c3594d3
						name: "length",
					},          
          {
						xtype: "datetimepickerfield",
            dateTimeFormat: "j.n.Y H:i",
<<<<<<< HEAD
						label: "Začátek dle rozpisu",
=======
						label: "Datum a čas",
>>>>>>> 50305f36381b3eff457eddabb990ec355c3594d3
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