Session.setDefault("activeCourse", null);
Session.setDefault("IDactiveEditor", 0);
Session.setDefault("activeCaret", 0);
Session.setDefault("prevTextLength", 0);
Session.setDefault("editorops", null);
Session.setDefault("coauthor", null);
Session.setDefault("browserUUID", guid());
Session.setDefault('activateEditor',false);

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}
