Ext.define("catcher.view.MatchDetailSettings",{
	extend: "Ext.form.Panel",
	xtype: "matchDetailSettings",					
	requires: ["Ext.form.FieldSet","Ext.form.Select","Ext.field.Hidden","Ext.field.DatePicker","Ext.field.Toggle"],
	
	config:{
    title : "Nastavení",
    iconCls : "settings",
    id: "matchDetailSettings",
		styleHtmlContent: true,
		
		items:[
			{
				xtype: "fieldset",
				title: "Nastavení zápasu",
				instructions: "",
				
				items:	[
          {
						xtype: "togglefield",
						label: "Čas běží",
						name: "start",
            value: 1
					},
					{
						xtype: "selectfield",
						label: "Hřiště",
						name: "field",
						options: []
					},
          {
						xtype: "datepickerfield",
						label: "Čas utkání",
            dateFormat:"h:i",
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