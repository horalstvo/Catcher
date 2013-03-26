Ext.define("catcher.view.PlayersDetail",{
	extend: "Ext.form.Panel",
	xtype: "playersDetail",
	id: "playersDetail",				
	requires: ["Ext.form.FieldSet","Ext.form.Select","Ext.field.Hidden"],
	
	config:{
		styleHtmlContent: true,
		
		items:[
			{
				xtype: "fieldset",
				title: "Informace o hráči",
				instructions: "Nejčastěji je třeba změnit číslo hráče, pokud se liší z centrální databáze ČALD.",
				
				items:	[
					{
						xtype: "selectfield",
						label: "Číslo hráče",
						name: "number",
						options: []
					},
					{
						xtype: "textfield",
						label: "Jméno",
						name: "name",
						value: ""
					},
					{
						xtype: "textfield",
						label: "Příjmení",
						name: "surname",
						value: ""
					},
					{
						xtype: "selectfield",
						label: "Tým",
						name: "team",
						options: []
					},
					{
						xtype: "hiddenfield",
						name: "player_id",
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
	 		activate: function(){
	 			Ext.getCmp("deletePlayer").show();
			},
			deactivate: function(){			
			 	Ext.getCmp("deletePlayer").hide();
			}							 
		},														
	}				
});