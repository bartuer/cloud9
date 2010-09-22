/**
 * Searchreplace Module for the Ajax.org Cloud IDE
 */
require.def("ext/searchreplace/searchreplace",
    ["core/ide",
     "core/ext",
     "ace/PluginManager",
     "text!ext/searchreplace/searchreplace.xml"],
    function(ide, ext, plugins, markup) {

return ext.register("ext/searchreplace/searchreplace", {
    name    : "Searchreplace",
    dev     : "Ajax.org",
    type    : ext.GENERAL,
    alone   : true,
    markup  : markup,
    hotkeys : {"searchreplace":1},
    hotitems: {},
    
    nodes   : [],
    
    init : function(amlNode){
        this.nodes.push(
            mnuEdit.appendChild(new apf.divider()),
            mnuEdit.appendChild(new apf.item({
                caption : "Search & Replace",
                onclick : this.toggleDialog.bind(this)
            }))
        );

        this.hotitems["searchreplace"] = this.nodes[1];

        var _self = this;

        this.txtFind       = winSearchReplace.selectSingleNode("a:vbox/a:textbox[1]");
        this.txtFind.addEventListener("keydown", function(e) {
            if (e.keyCode == 13)
                _self.findNext();
        });
        this.txtReplace    = winSearchReplace.selectSingleNode("a:vbox/a:textbox[2]");
        this.txtReplace.addEventListener("keydown", function(e) {
            if (e.keyCode == 13)
                _self.replace();
        });
        //buttons
        this.btnReplace    = winSearchReplace.selectSingleNode("a:vbox/a:hbox/a:button[1]");
        this.btnReplace.onclick = this.replace.bind(this);
        this.btnReplaceAll = winSearchReplace.selectSingleNode("a:vbox/a:hbox/a:button[2]");
        this.btnReplaceAll.onclick = this.replaceAll.bind(this);
        this.btnClose      = winSearchReplace.selectSingleNode("a:vbox/a:hbox/a:button[3]");
        this.btnClose.onclick = this.toggleDialog.bind(this);
        this.btnFind       = winSearchReplace.selectSingleNode("a:vbox/a:hbox/a:button[4]");
        this.btnFind.onclick = this.findNext.bind(this);

        plugins.registerCommand("find", function(editor, selection) {
            _self.$editor = editor;
            _self.$selection = selection;
            _self.toggleDialog();
        });
    },

    toggleDialog: function() {
        if (!winSearchReplace.visible)
            winSearchReplace.show();
        else
            winSearchReplace.hide();
        return false;
    },

    findNext: function() {
        if (!this.$editor)
            return;
        var txt = this.txtFind.getValue();
        console.log("trying to search for text: " + txt);
        if (!txt)
            return;
        if (this.$crtSearch != txt) {
            this.$crtSearch = txt;
            this.$editor.find(txt);
        }
        else {
            this.$editor.findNext();
        }
    },

    replace: function() {
        if (!this.$editor)
            return;
        this.$editor.replace(this.txtReplace.getValue() || "");
        this.$editor.find(this.$crtSearch);
    },

    replaceAll: function() {
        if (!this.editor)
            return;
        this.$crtSearch = null;
        this.$editor.replaceAll(this.txtReplace.getValue() || "");
    },
    
    enable : function(){
        this.nodes.each(function(item){
            item.enable();
        });
    },
    
    disable : function(){
        this.nodes.each(function(item){
            item.disable();
        });
    },
    
    destroy : function(){
        this.nodes.each(function(item){
            item.destroy(true, true);
        });
        this.nodes = [];
    }
});

    }
);