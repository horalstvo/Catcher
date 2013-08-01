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
						var novy_hrac = Ext.create("catcher.model.Player",{
              nick: "AAA nick",
							name:"Nový",
							surname: "Hráč",							
							team: this.target,
							number: 1,
							player_id: false,
							text: "Nový Hráč #1"
						});
            
            novy_hrac.data.leaf = true;                        						
						
						var name_short = Ext.getStore("Teams").findRecord("team_id",this.target);						
						Ext.getCmp("teamList").setBackText(name_short.get("name_short"));
																		 
// 						parent.appendChild(novy_hrac); // připojení do Evidence (Nestead List)																							
						players.add(novy_hrac);
            novy_hrac.dirty = true;						
						players.sync();
            novy_hrac.dirty = false; // wtf?? proč nefunguje metoda setDirty()??
            novy_hrac.destroy();
            var cilovy_team = this.target;
            players.load(function(){
              catcher.app.getController("Evidence").sestavEvidenci(cilovy_team);
            });                        
						
// 						Ext.getCmp("teamList").goToLeaf(parent.lastChild);
// 						catcher.app.getController("Evidence").showPlayer(false,{data:novy_hrac});
						            
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
      painted: function(){
//         tohle se možná bude hodit, ale zatím to není potřeba (přestavění evidence vždy při jejím zobrazení)
//         catcher.app.getController("Evidence").sestavEvidenci(false);
      },
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
  }
});
