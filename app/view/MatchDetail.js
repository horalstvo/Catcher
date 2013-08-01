Ext.define("catcher.view.MatchDetail", {
    extend : "Ext.Panel",
    xtype : "matchDetail",    
    requires : [ "Ext.SegmentedButton" ],    

    config : {
        title : "Match Detail",
        id: "matchDetail",
        layout : "vbox",
        styleHtmlContent : true,

        items : [{
            xtype : "segmentedbutton",
            layout : {
                align : "stretchmax",
                pack : "center",
                type : "hbox"
            },
            style : "font-size: 3em",
            items : [ {
                xtype : "button",
                flex : 1,
                name : "scoreHome",
                text : "[home]",
            }, {
                xtype : "button",
                flex : 1,
                name : "scoreAway",
                text : "[away]",
            } ],
        }, {
            xtype : "segmentedbutton",
            layout : {
                align : "stretchmax",
                pack : "center",
                type : "hbox"
            },
            style : "font-size: 5em; margin-top : 20px",
            items : [ {
                xtype : "button",
                flex : 1,
                name : "addPointHome",
                text : "+",
            }, {
                xtype : "button",
                flex : 1,
                name : "addPointAway",
                text : "+",
            } ],
        } ],
        listeners : {
            painted : function() {
                Ext.getCmp("tournament").getTabBar().hide();                
            },
            show : function(){
            this.query('.button').forEach(function(c){
//               zøejmì bug sencha, vrací jinou tøídu, než ve skuteènosti má mít   
//               var pressedCls = c.getPressedCls();
              var pressedCls = "x-button-pressed";         
              c.removeCls(pressedCls);
            });
          }
      },
    }
});