Ext.define('catcher.controller.Evidence', {
    extend : 'Ext.app.Controller',

    config : {
        refs : {
            karticka : "playersDetail"
        },
        control : {
            "playersDetail button" : {
                tap : "updatePlayer"
            },
        }
    },

    deletePlayer : function() {
        var store = Ext.getStore("Players");
        var data = this.getKarticka().getValues(); // data o hráči ke smazání
        store.remove(store.findRecord("player_id", data.player_id, false, false, false, true)); // odstranit hráče z tabulky Players
        var parentNode = Ext.getStore("Evidence").findRecord("team_id", data.team, false, false, false, true); // parentNode (tým node)
        var child = parentNode.findChild("player_id", data.player_id); // node mazaném hráče v TreeStore
        Ext.getCmp("teamList").onBackTap(); // vyvolat back event
        parentNode.removeChild(child); // odstranit node s hráčem
        store.sync();
    },

    updatePlayer : function() {
        var form = this.getKarticka();
        var store = Ext.getStore("Players");

        store.clearFilter();
        values = form.getValues();

        // aktualizace dat o upravovaném hráči
        var data = store.findRecord("player_id", values.player_id, false, false, false, true);
        data.set("name", values.name);
        data.set("surname", values.surname);
        data.set("team", values.team);
        data.set("number", values.number);
        data.set("nick", values.nick);
        
        store.sync();

        Ext.Viewport.setMasked({
            xtype : 'loadmask',
            message : 'Aktualizuji databázi hráčů'
        });
        catcher.app.getController("Evidence").sestavEvidenci(values.team);
    },

    showPlayer : function(list, record) {

        // nastavit options pro select = číslo hráče
        i = 0;
        var numbers = new Array();
        while (i < 100) {
            numbers.push({
                text : i,
                value : i
            });
            i++;
        }

        // naplnit hráčovu kartičku
        this.getKarticka().setValues({
            name : record.data.name,
            surname : record.data.surname,
            player_id : record.data.player_id,
            nick : record.data.nick
        });

        // nastavit options pro select = tým
        var teams = new Array();
        Ext.getStore("Teams").each(function(radek) {
            teams.push({
                text : radek.get("name_full"),
                value : radek.get("team_id")
            });
        });

        // nastavit selected hodnoty pro Tým a Číslo hráče
        this.getKarticka().query("selectfield[name=team]")[0].setOptions(teams).setValue(record.data.team);
        this.getKarticka().query("selectfield[name=number]")[0].setOptions(numbers).setValue(record.data.number);
    },

    sestavEvidenci : function(team_id) {
        var data = new Array;
        var teams = Ext.getStore("Teams");
        var players = Ext.getStore("Players");
        var evidence = Ext.getStore("Evidence");
        var nl = Ext.getCmp("teamList");

        players.clearFilter();

        teams.each(function(radek) {
            var team = {
                text : radek.get("name_full"),
                team_id : radek.get("team_id"),
                items : new Array
            };
            data.push(team);
            players.filter("team", radek.get("team_id"));
            players.each(function(detail) {
                var index = data.length - 1;
                var jmeno = [ detail.get("name"), detail.get("surname") ];
                data[index].items.push({
                    text : jmeno.join(" ") + " #" + detail.get("number"),
                    player_id : detail.get("player_id"),
                    name : detail.get("name"),
                    surname : detail.get("surname"),
                    team : detail.get("team"),
                    number : detail.get("number"),
                    nick : detail.get("nick"),
                    leaf : true
                });
            });
            players.clearFilter();
        });
        players.clearFilter();

        evidence.setData({
            text : "Hráči",
            items : data
        });

        Ext.Viewport.setMasked(false);

        if (team_id > 0) {
            Ext.Msg.alert("OK", "Záznam upraven", function() {
                var parent = evidence.findRecord("team_id", team_id, false, false, false, true);
                nl.goToNode(parent);
                Ext.getCmp("addPlayer").show();
            });
        }

    }
});