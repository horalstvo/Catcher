Ext.define("catcher.view.MatchDetailScore",{
	extend: "Ext.form.Panel",
	xtype: "matchDetailScore",					
	requires: ["Ext.form.FieldSet","Ext.form.Select","Ext.field.Hidden"],
	
	config:{
    title : "Skóre + spirit",
    iconCls : "compose",
    id: "matchDetailScore",
		styleHtmlContent: true,
		
		items:[
			{
				xtype: "fieldset",
				title: "Výsledné skóre a spirit",
				instructions : "Po konci zápasu lze přímo zapsat Spirit, případně natvrdo upravit skóre. Pokud se zadá skóre jiné, než je pomocí skórovacího systémů s hráči, budou další body doplněny anonymními hráči.",
				
				items:	[
// 					{
// 						xtype: "selectfield",
// 						label: "Hřiště",
// 						name: "field",
// 						options: []
// 					},
//           {
// 						xtype: "datepickerfield",
// 						label: "Datum",
// 						name: "date",
// 						value: ""
// 					},
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