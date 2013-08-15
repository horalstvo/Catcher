Ext.define("catcher.view.Tournament", {
    extend : "Ext.tab.Panel",
    xtype : "tournamentPanel",
    requires : [ "Ext.device.Device", "Ext.data.Model", "Ext.data.Store" ],
  
    config : {
      tabBarPosition : "bottom",
      id : "tournament",
      items : [
        {xtype : "matchesNavigation"},
        {xtype : "teamList"},        
      ],
      listeners:{
        initialize: function(){
          this.getTabBar().add({
            xtype: "button",
            ui: "decline",
            id: "logout",
            iconCls: "power_on",
            iconMask: true,
            right: "1%",        
            height: "50%",
            margin: "10 0 0 0",
            handler : function() {
              Ext.Msg.confirm("Odhlášení", "Opravdu se chcete odhlásit?", function(response) {
                  if (response == "yes") {                
                      var store = Ext.getStore("Session");
                      store.remove(store.findRecord("uuid",Ext.device.Device.uuid));
                      Ext.getStore("Matches").removeAll();
                      Ext.getStore("Players").removeAll();
                      Ext.getStore("Points").removeAll();
                      Ext.getStore("Teams").removeAll();
                      Ext.getStore("Evidence").removeAll();
                      Ext.getCmp("playersDetail").destroy();                
                      Ext.Viewport.removeAll(); 
                      Ext.Viewport.add(
                        {xtype : "main"}
                      );
                      Ext.Msg.alert("Zařízení odhlášeno ze správy turnaje");                
                  }
              });
            }        
          });
        },
      }
    }
});