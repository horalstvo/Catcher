Ext.define("catcher.view.MatchDetailScore",{
	extend: "Ext.form.Panel",
	xtype: "matchDetailScore",					
	requires: ["Ext.form.FieldSet","Ext.form.Select","Ext.field.Hidden"],
	
	config:{
    title : "Skóre a spirit",
    iconCls : "compose",
    id: "matchDetailScore",
		styleHtmlContent: true,
		
		items:[
			{
				xtype: "fieldset",
				title: "Výsledné skóre a spirit",
				instructions: "",
				
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