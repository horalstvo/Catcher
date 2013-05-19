Ext.define('catcher.view.TeamList', {
  extend: "Ext.dataview.NestedList",
  requires: ["catcher.view.PlayersDetail","Ext.dataview.DataView"],  
  xtype: "teamList",
  id: "teamList",  
  config: {
    store: "Evidence",
    fullscreen: true,
    title: 'Hráči',
    iconCls: "team",
    displayField: 'text',
    useTitleAsBackText: false,
    detailCard: {
      xtype: "playersDetail"
    },
    toolbar: {
      items: [
				{
					xtype: "button",
					hidden: true,
					iconCls: "add",
					align: "right",
					id: "addPlayer",
					target: "",
					iconMask: true,
					handler: function(){
						Ext.getCmp("addPlayer").hide();
						var players = Ext.getStore("Players");
						players.sort("player_id","ASC");
						var evidence = Ext.getStore("Evidence"); 
						var parent = evidence.getNodeById(this.target);
						var new_id = players.getAt(players.getCount()-1);
						new_id = parseInt(new_id.get("player_id"))+1;
						novy_hrac = {
							name:"Nový",
							surname: "Hráč",							
							team: this.target,
							number: 1,
							player_id: new_id,
							text: "Nový Hráč #1",
							leaf: true
						};						
						
						var name_short = Ext.getStore("Teams").findRecord("team_id",this.target);						
						Ext.getCmp("teamList").setBackText(name_short.get("name_short"));
																		 
						parent.appendChild(novy_hrac); // připojení do Evidence (Nestead List)																							
						players.add(novy_hrac); // uložení do Players a hack na insert do databáze
						var update = players.findRecord("player_id",new_id);
						update.setDirty(); // force dirty
						players.sync();
						
						Ext.getCmp("teamList").goToLeaf(parent.lastChild);
						catcher.app.getController("Evidence").showPlayer(false,{data:novy_hrac});
						            
					}					
				},
				{
					xtype: "button",
					align: "right",
					hidden: true,
					iconMask: true,
					iconCls: "delete",
					ui: "decline",
					id: "deletePlayer",
					handler: function(){
						Ext.Msg.confirm("Smazat hráče","Opravdu chcete hráče smazat?",
							function(response){
								if(response == "yes") catcher.app.getController("Evidence").deletePlayer()
							}              
						);						
					}
				}
			]
    },
    listeners: {
      leafitemtap: function(nestedList, list, index, target, record){
        catcher.app.getController("Evidence").showPlayer(list, record);
        Ext.getCmp("addPlayer").hide();
      },
      itemtap: function(nested, list, index, target, record){      	
      	if(record.isLeaf() == false){
					// nastavuji master tým, protože zatím nevím jak zjistit aktuálně zobrazený node      		
      		Ext.getCmp("addPlayer").target = record.getId();
      		Ext.getCmp("addPlayer").show();
      		Ext.getCmp("teamList").setBackText("Týmy");
				}else{					
      		var shortName = Ext.getStore("Teams").findRecord("team_id",Ext.getCmp("addPlayer").target);
					Ext.getCmp("teamList").setBackText(shortName.get("name_short"));
					Ext.getCmp("addPlayer").hide();
				}				
			},
			back:function(back,node){
				var addPlayer = Ext.getCmp("addPlayer"); // přidávací tlačítko  
				if(node.isLeaf()){
					Ext.getCmp("teamList").setBackText("Týmy");
					addPlayer.show(); // zobrazit, jsme na výpisu týmu, předchozí node byl leaf
				}else{					
					addPlayer.hide(); // skrýt add button, předchozí node byla soupiska týmu a jsme na přehledu týmů
				} 
			}			
    }
  },  
  
  initialize: function(){
    catcher.app.getController("Evidence").sestavEvidenci(false);    						    
  },
});
