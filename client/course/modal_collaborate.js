Template.modalCollaborate.helpers({
    coAuthorBG: function() {
        return Session.get("coAuthorBG");
    },
    listCoAuthors: function() {
        var idCourseUrl = Session.get("activeCourse");
        var idCourseDB = Courses.findOne({
            _id: idCourseUrl
        })
        return idCourseDB.coauthors
    },
    coAuthorName: function() {
        return Session.get("coAuthorName");
    }
});

Template.modalCollaborate.events({
    "click #selectColorCoAuthor": function(event, template) {
        $('#modalSelectColorCoAuthor').openModal();
    },
    "click #urlCoAuthors": function(event, template) {
        setSavingBtn("urlCoAuthors");
    },
    "click #filled-in-box-color": function(event, template) {
        setSavingBtn("filled-in-box-color");
    },
    "click #saveCoAuthorsBtn": function(event, template) {
        if (document.getElementById("saveCoAuthorsBtn").classList.contains('disabled')) {
            return
        }
        if (Session.get("coAuthorUrlId") == null) {
            Session.set("modalGeneralMessage", "<p>please create new co Author or edit from the list !!!</p>")
            $('#modalGeneralMessage').openModal({
                complete: function() {
                    Session.set("modalGeneralMessage", null)
                }
            });
        } else {
            var idCourseToSave = Session.get("activeCourse")
            var urlIdToSave = Session.get("coAuthorUrlId")
            var urlToSave = Session.get("coAuthorUrl")
            var nameToSave = document.getElementById('inputCoAuthorName').value
            var colorToSave = Session.get("coAuthorBG")
            Meteor.call("updateCoAuthors", idCourseToSave, urlIdToSave, urlToSave,
                nameToSave, colorToSave);
            Session.set("modalGeneralMessage",'<h3>file saved </h3>' +
                '<span>co-Author Name : </span><span><b>' + nameToSave +
                '</b></span><br /><span>url : </span><span><b>' + urlToSave +
                '</b></span>');
            $('#modalGeneralMessage').openModal({
                complete: function() {Session.set("modalGeneralMessage", null)}
            });
            coAuthorInit()
        }
    },
    "click #newCoAuthorUrl": function() {
        var uuid = guid()
        Session.set("coAuthorUrlId", uuid)
        var urlCoAuthors = window.location.host + '/' + Session.get("activeCourse") + "?#=" + uuid
        Session.set("coAuthorUrl", urlCoAuthors)
        Session.set("coAuthorName", "Anonym");
        document.getElementById('inputCoAuthorName').value = "Anonym"
        document.querySelector('[for="inputCoAuthorName"]').className = 'active';
        Meteor.call("addCoAuthors", Session.get("activeCourse"), uuid, urlCoAuthors,
            "Anonym", Session.get("coAuthorBG"))
        $('.collapsible').collapsible();
    }
});

Template.modalCollaborate.onRendered(function() {
    this.autorun(function() {
        var coAuthorsCount = coAuthors().length;
        Tracker.afterFlush(function() {
            this.$(".collapsible").collapsible({
                accordion: false
            });
        }.bind(this));
    }.bind(this));
})

Template.modalSelectColorCoAuthor.events({
    "click .selectedColorBtn": function(event, template) {
        Session.set("coAuthorBG", $(event.currentTarget).attr("color-value"))
        $('#modalSelectColorCoAuthor').closeModal();
    }
});

Template.listOfCoAuthorsUrl.events({
    "click .deleteCoAuthors": function(event, template) {
        var idCourseUrl = Session.get("activeCourse");
        Meteor.call("deleteCoAuthors", idCourseUrl, template.data.urlid)
    },
    "click .editCoAuthors": function(event, template) {
        var idCourseUrl = Session.get("activeCourse");
        Session.set("coAuthorName", template.data.name);
        document.getElementById('inputCoAuthorName').value = template.data.name
        document.querySelector('[for="inputCoAuthorName"]').className = 'active';
        Session.set("coAuthorBG", template.data.color);
        Session.set("coAuthorUrl", template.data.url);
        Session.set("coAuthorUrlId", template.data.urlid);
        var divBtn = document.getElementById("urlCoAuthors")
        if (!divBtn.hasAttribute('checked')) {
            divBtn.setAttribute('checked', 'checked')
        }
        var btnSave = document.getElementById("saveCoAuthorsBtn");
        btnSave.className = "btn-floating blue " + checkSavingBtn();
    }
});

Template.listOfCoAuthorsUrl.onRendered(function() {
    var btnCopy = new ZeroClipboard(document.getElementById("copyCoAuthors_" + this.data.urlid));
    btnCopy.on("ready", function(readyEvent) {
        btnCopy.on("aftercopy", function(event) {
            alert("Copied text to clipboard: " + event.data["text/plain"]);
        });
    });
});

var coAuthors = function() {
    var idCourseUrl = Session.get("activeCourse");
    var idCourseDB = Courses.findOne({
        _id: idCourseUrl
    })
    return idCourseDB.coauthors
}

function setSavingBtn(clickableDiv) {
    var divBtn = document.getElementById(clickableDiv)
    if (divBtn.hasAttribute('checked')) {
        divBtn.removeAttribute('checked');
        var btnSave = document.getElementById("saveCoAuthorsBtn");
        btnSave.className = btnSave.className + " disabled";
    } else {
        divBtn.setAttribute('checked', 'checked');
        var btnSave = document.getElementById("saveCoAuthorsBtn");
        btnSave.className = "btn-floating blue " + checkSavingBtn();
    }
}

function checkSavingBtn() {
    var checklistBtnUrl = document.getElementById("urlCoAuthors")
    var checklistBtnColor = document.getElementById("filled-in-box-color");
    if (checklistBtnUrl.hasAttribute('checked') &&
        checklistBtnColor.hasAttribute('checked')) {
        return ""
    } else {
        return "disabled"
    }
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}
