Template.myCourses.helpers({
    courses: function() {
        return Courses.find({}).fetch()
    }
});

Template.listOwnCourses.events({
    'click .listOfCourse': function(evt, tmpl) {
        Session.set("activeCourse", tmpl.data._id);
        var path = "/" + tmpl.data._id
        Router.go(path)
    }
})

Template.course.helpers({
    cards: function() {
        return listOfCards()
    },
    idCourse: function() {
        var idCourseUrl = urlsplit()[0];
        var idCourseDB = Courses.findOne({
            _id: idCourseUrl
        })
        if (idCourseDB != undefined) {
            Session.set("activeCourse", idCourseUrl)
            return idCourseUrl
        } else if (Session.get("activeCourse") != null) {
            return Session.get("activeCourse");
        } else {
            return null
        }
    }
});

function listOfCards() {
    var idCourseUrl = urlsplit()[0];
    var idCourseDB = Courses.findOne({
        _id: idCourseUrl
    })
    if (idCourseDB != undefined) {
        Session.set("activeCourse", idCourseUrl)
        return Courses.findOne({
            _id: idCourseUrl
        })
    } else if (Session.get("activeCourse") != null) {
        return Courses.findOne({
            _id: Session.get("activeCourse")
        })
    } else {
        return null
    }
}

Template.course_toolbar_header.helpers({
    cards: function() {
        return listOfCards()
    }
});

Template.card.events({
    "click .cardLi": function(event, template) {
        var idCardtext = template.data._id
            // Session.set('IDactiveEditor', template.data._id);
        var divToolbar = document.querySelector('.activeEditor');
        if (divToolbar) {
            var dActive = document.getElementById(divToolbar.id);
            var divID = divToolbar.id.split('_')[1]
            dActive.className += "cardToolbar"
            dActive.className = dActive.className.replace("activeEditor", "");
            document.getElementById("contentEditor_" + divID).style.display = "block";
        }
        document.getElementById("contentEditor_" + idCardtext).style.display = "none";
        var dShow = document.getElementById('editor_' + idCardtext);
        dShow.className = dShow.className.replace("cardToolbar", "")
        document.getElementById('editor_' + idCardtext).className += " activeEditor";
    }
});

Template.cardtext.helpers({
    content: function() {
        var idCardtext = this._id;
        var cardContents = Textcard.findOne({
            _id: idCardtext
        });
        var divElement = document.createElement("div")
        divElement.setAttribute("class", "editor")
        var editor = new Quill(divElement);
        editor.setContents(cardContents.content);
        var div = editor.container.innerHTML
        div = div.replace('contenteditable="true"', '')
        var htmlEditor = div
        editor.destroy();
        return htmlEditor;
    }
});

allEditor = {};
Template.cardtext.onRendered(function() {
    var idCardtext = this.data._id;
    Meteor.call("findCardtext", idCardtext, function(err, res) {
        if (err) {
            console.log(err)
        } else {
            var quillEditor = loadEditor(idCardtext);
            var otQuill = {
                quill: quillEditor,
                enable: true
            }
            allEditor[idCardtext] = otQuill
        }
    })
});

Template.toolbareditor.events({
    'click .ql-size': function(evt, tmpl) {
        var modalFontsize = '#modalFontSize_' + tmpl.data._id
        $('#modalFontSize').openModal();
    }
})

Template.cardtext.events({
    "click .editorQuill": function(event, template) {
        var idCardtext = template.data._id
        // if (Session.get('IDactiveEditor') != idCardtext) {
        //     Streamy.rooms(urlsplit()[0]).emit('usedEditor', {
        //         'idEditor': idCardtext,
        //         'author':authorUrl().author.urlid
        //     });
        // }
        Session.set('IDactiveEditor', template.data._id);
    }
});

TextcardContent = function() {
    var cardContents = Textcard.findOne({
        _id: Session.get("textcard")
    });
    if (cardContents && cardContents.content)
        return cardContents
}

authorUrl = function(){
  var selectedCourse = Courses.findOne({_id:urlsplit()[0]})
  if (selectedCourse.authors.urlid == Meteor.userId()){
      var allauthors = {
        author : selectedCourse.authors,
        coauthors : selectedCourse.coauthors
      }
      return allauthors
  } else {
      var urlCoAuthors = _.find(selectedCourse.coauthors, function(obj){return obj.urlid == urlsplit()[1]})
      if (urlCoAuthors != undefined){
        var coauthors = _.filter(selectedCourse.coauthors, function(obj){return obj.urlid != urlsplit()[1]})
        coauthors.push(selectedCourse.authors)
        var allauthors = {
          author : urlCoAuthors,
          coauthors : coauthors
        }
        return allauthors
      }
      return null
  }
}

function loadContentEditor(idCardtext, div) {
    var retainOps = null;
    var cardContents = Textcard.findOne({
        _id: idCardtext
    });
    var editor = new Quill(div + idCardtext, {
        modules: {
            'link-tooltip': true,
            'toolbar': {
                container: '#toolbareditor_' + idCardtext
            }
        },
        // styles: false
        styles: false
    });

    var cursorManager = editor.addModule('multi-cursor', {
        timeout: 4000
    });

    if (authorUrl() != null){
      var authorship = editor.addModule('authorship', {
          authorId: authorUrl().author.urlid, // from url collaborate setting
          color: authorUrl().author.color,
          enabled: true
      });
      _.each(authorUrl().coauthors, function(obj){
        authorship.addAuthor(obj.urlid,obj.color)
      })
    } else {
      editor.editor.disable();
    }

    $('.hideAuthorship').on("click", function() {
        authorship.disable();
    })

    editor.setContents(cardContents.content)
    return editor
}

function loadEditor(idCardtext) {
    var editor = loadContentEditor(idCardtext, '#editor_')
    // editor.onModuleLoad('authorship', function(toolbar) {
    //   console.log('Toolbar has been added');
    // });
    editor.on('text-change', function(delta, source) {
        var editablediv = document.getElementById(editor.id);
        if (source === 'api') {
            var editablediv = document.getElementById(editor.id);
            var divText = editablediv.firstChild;
            var prevTextLength = Session.get("prevTextLength");
            var newTextLength = editor.getLength();
            var positionCaret = Session.get("activeCaret") + (newTextLength - prevTextLength);
            if (positionCaret < 0) {
                positionCaret = 0
            }
            // console.log(retainOps,positionCaret)
            if (Session.get("IDactiveEditor") == idCardtext) {
                if (Session.get('retainOps') <= Session.get("activeCaret") ||
                    Session.get('retainOps') === undefined) {
                    editor.setSelection(positionCaret, positionCaret);
                    Session.set("activeCaret", positionCaret);
                    Session.set("prevTextLength", editor.getLength());
                } else {
                    editor.setSelection(Session.get("activeCaret"), Session.get("activeCaret"))
                    Session.set("activeCaret", Session.get("activeCaret"));
                    Session.set("prevTextLength", editor.getLength());
                }
            }
        } else if (source === 'user') {
            if (editor.getSelection()) {
                var caretPosition = editor.getSelection().end;
                Session.set("activeCaret", caretPosition);
            };
            var newContent = editor.getContents()
            console.log(delta)
            Meteor.call("updateDelta", idCardtext, newContent, delta, Session.get("browserUUID"));
            Streamy.rooms(urlsplit()[0]).emit('content_ops', {
                'idEditor': idCardtext,
                'body': newContent,
                'ops': delta,
                'author': authorUrl().author.urlid
            });
            Session.set("IDactiveEditor", idCardtext);
            Session.set("prevTextLength", editor.getLength());
        };
    });

    //Caret Position on Click
    editor.on('selection-change', function(range, source) {
        if (source === 'api') {
            cursorquill(range, editor, idCardtext)
        } else if (source === 'user') {
            var caretPosition = editor.getSelection();
            cursorquill(range, editor, idCardtext);
            Session.set("IDactiveEditor", idCardtext);
            if (range && range.start == range.end){
              function sourceType(){
                window.onkeydown = function(e){
                  if (e.keyIdentifier == "Up" || e.keyIdentifier == "Down" ||
                  e.keyIdentifier == "Right" || e.keyIdentifier == "Left" ){
                     return "arrowPress"
                  } else { return "notArrowPress" }
                };
              }
              console.log(window.event)
              Streamy.rooms(urlsplit()[0]).emit('usedEditor', {
                  'idEditor': idCardtext,
                  'author':authorUrl().author.urlid,
                  'position':range.end,
                  'name':authorUrl().author.name,
                  'color':authorUrl().author.color,
                  'sourceType':sourceType(),
              });
            }
        }
    });
    return editor
}

Template.cardimage.helpers({
    content: function() {
        return Textcard.findOne({
            _id: this._id
        })
    }
})

function cursorquill(range, editor, idCardtext) {
    if (range) {
        // show toolbar base on active editor
        var divToolbar = document.querySelector('.activeToolbar');
        if (divToolbar) {
            var dActive = document.getElementById(divToolbar.id);
            dActive.className += "cardToolbar"
            dActive.className = dActive.className.replace("activeToolbar", "");
        }
        var dHide = document.getElementById('toolbareditor_' + idCardtext);
        dHide.className = dHide.className.replace("cardToolbar", "")
        document.getElementById('toolbareditor_' + idCardtext).className += " activeToolbar";
        dHide.className = dHide.className.replace("  activeToolbar", " activeToolbar")
        if (range.start == range.end) {
            Session.set("activeCaret", range.end);
            Session.set("IDactiveEditor", idCardtext);
            Session.set("prevTextLength", editor.getLength());
        } else {
            Session.set("activeCaret", range.end);
            var text = editor.getText(range.start, range.end);
            if (syncContent(editor, idCardtext)) {
                var textlength = editor.getLength();
                editor.deleteText(0, textlength);
                var newContents = Textcard.findOne({
                    _id: idCardtext
                })
                editor.updateContents(newContents.content)
            }
        }
    }
    // else {
    //     var divToolbar = document.querySelector('.activeEditor');
    //     if (divToolbar) {
    //         var dActive = document.getElementById(divToolbar.id);
    //         var divID = divToolbar.id.split('_')[1]
    //         dActive.className += "cardToolbar"
    //         dActive.className = dActive.className.replace("activeEditor", "");
    //         document.getElementById("contentEditor_" + divID).style.display = "block";
    //     }
    // }
}

function syncAuthor(authorIdOps) {
    if (authorIdOps == Streamy.id()) {
        return false
    } else {
        return true
    }
}

function syncContent(editor, idCardtext) {
    var existingContent = editor.getContents();
    var contentsInCollection = Textcard.findOne({
        _id: idCardtext
    })
    var divElement = document.createElement("div")
    var tempEditor = new Quill(divElement);
    tempEditor.setContents(contentsInCollection.content);
    var textExisting = editor.getText();
    var textTemp = tempEditor.getText();
    tempEditor.destroy();
    if (textExisting == textTemp) {
        return false
    } else {
        return true
    }
}

// Override Meteor._debug to filter for custom msgs
Meteor._debug = (function(super_meteor_debug) {
    return function(error, info) {
        if (!(info && _.has(info, 'msg')))
            super_meteor_debug(error, info);
    }
})(Meteor._debug);

Template.toolbareditor.events({
    "click .testStreamy": function(event, template) {
        // Streamy.rooms(urlsplit()[0]).emit('ops', {
        //     'body': 'streamy'
        // })
        // console.log(timerTest);
        // window.clearInterval(timerTest);
    }
});

Streamy.on('content_ops', function(data) {
    var editor = allEditor[data.idEditor].quill
    var authorIdOps = data.__from
    if (syncAuthor(authorIdOps)) {
        Session.set('retainOps', data.ops.ops[0].retain)
        var cursorManager = editor.getModule('multi-cursor');
        if (_.isEmpty(cursorManager.cursors)==false){
          cursorManager.moveCursor(data.author, data.ops.ops[0].retain);
        }
        // allEditor[data.idEditor].quill.setContents(data.body);
        editor.updateContents(data.ops)
        editor.editor.disable();
        allEditor[data.idEditor].enable = false;
        var enableAfter = setTimeout(function() {
            editor.editor.enable();
            allEditor[data.idEditor].enable = true;
        }, 4000)
    }
})

Streamy.on('usedEditor', function(data) {
    var authorIdOps = data.__from
    var editor = allEditor[data.idEditor].quill
    if (syncAuthor(authorIdOps)) {
        console.log(data.sourceType)
        if (data.sourceType == "notArrowPress"){
          Materialize.toast('someone edit ' + data.idEditor + '!', 2000, 'rounded')
        }
        var cursorManager = editor.getModule('multi-cursor');
        var colorAuthor = data.color
        var colorAuthor_last = colorAuthor.split(",")[2]
        var b_color = colorAuthor_last.split(")")[0]
        colorAuthor = colorAuthor.replace("rgb","rgba");
        colorAuthor = colorAuthor.replace(colorAuthor_last,b_color+",0.7)");
        cursorManager.setCursor(data.author,data.position,data.name, colorAuthor);
        if (data.idEditor == Session.get('IDactiveEditor')) {
            editor.editor.disable();
            allEditor[data.idEditor].enable = false;
            var enableAfter = setTimeout(function() {
                editor.editor.enable();
                allEditor[data.idEditor].enable = true;
            }, 5000)
        }
    }
})
