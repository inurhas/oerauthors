Template.myCourses.helpers({
    courses: function() {
        return Courses.find({}).fetch()
    }
});

Template.listOwnCourses.events({
    'click .listOfCourse': function(evt, tmpl) {
        Session.set("activeCourse", tmpl.data._id);
        var path = "/courses/" + tmpl.data._id
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
})

function urlsplit() {
    var urlCourse = Router.current().location.get().href
    var uniqueUrl = urlCourse.split("courses/")[1];
    var idCourseUrl = uniqueUrl.split("?#=");
    return idCourseUrl
}

Template.course.events({
    'click .addNewTextcard': function(evt, tmpl) {
        //Meteor.call("deleteAllCardsInCourse",Session.get("activeCourse"))
        var divElement = document.createElement("div")
        divElement.setAttribute("class", "editor")
        var editor = new Quill(divElement);
        var delta = editor.getContents();
        Meteor.call("addDelta", delta, function(error, result) {
            Meteor.call("addNewCardsToCourse", Session.get("activeCourse"), result, "textcard");
        });
    },
    'click .modalAddCards': function(evt, tmpl) {
        $('#modalAddCard').openModal();
    },
    'click .modalShowTodos': function(evt, tmpl) {
        $('#modalShowTodos').openModal();
    },
    'click .modalShowMessages': function(evt, tmpl) {
        $('#modalShowMessages').openModal();
    },
    'click .modalAuthorSettings': function(evt, tmpl) {
        $('#modalAuthorSettings').openModal();
    }
})

Template.course.onRendered(function() {
    var courseUrl = "http://localhost:3000" + Iron.Location.get().path
    var sortableUl = document.getElementById('listOfCourseCards')
    var editableList = Sortable.create(sortableUl, {
        delay: 0,
        animation: 200,
        draggable: ".cardLi",
        handle: ".dragbtnli",
        store: {
            /**
             * Get the order of elements. Called once during initialization.
             * @param   {Sortable}  sortable
             * @returns {Array}
             */
            get: function(sortable) {
                var order = localStorage.getItem(sortable.options.group);
                return order ? order.split('|') : [];
            },

            /**
             * Save the order of elements. Called onEnd (when the item is dropped).
             * @param {Sortable}  sortable
             */
            set: function(sortable) {
                var order = sortable.toArray();
                var ordered = []
                for (var i = 0, len = order.length; i < len; i++) {
                    var selector = '[data-id=' + order[i] + ']'
                    var listElement = document.querySelector(selector);
                    ordered.push({
                        _id: order[i].split('_')[1],
                        type: listElement.getAttribute('type')
                    })
                }
                Meteor.call("updateCardsPosition", Session.get("activeCourse"), ordered);
            }
        }
    });
    Typerange()
})

function Typerange() {
    var range_type = 'input[type=range]';
    var range_mousedown = false;

    $(range_type).each(function() {
        var thumb = $('<span class="thumb"><span class="value"></span></span>');
        $(this).after(thumb);
    });

    var range_wrapper = '.range-field';
    $(document).on("touchstart", range_wrapper, function(e) {
        var thumb = $(this).children('.thumb');
        if (thumb.length <= 0) {
            thumb = $('<span class="thumb"><span class="value"></span></span>');
            $(this).append(thumb);
        }

        range_mousedown = true;
        $(this).addClass('active');

        if (!thumb.hasClass('active')) {
            thumb.velocity({
                height: "30px",
                width: "30px",
                top: "-20px",
                marginLeft: "-15px"
            }, {
                duration: 300,
                easing: 'easeOutExpo'
            });
        }
        var left = e.originalEvent.touches[0].pageX - $(this).offset().left;
        var width = $(this).outerWidth();

        if (left < 0) {
            left = 0;
        } else if (left > width) {
            left = width;
        }
        thumb.addClass('active').css('left', left);
        thumb.find('.value').html($(this).children('input[type=range]').val());

    });

    $(document).on("touchend", range_wrapper, function() {
        range_mousedown = false;
        $(this).removeClass('active');
    });

    $(document).on("touchmove", range_wrapper, function(e) {

        var thumb = $(this).children('.thumb');
        if (range_mousedown) {
            if (!thumb.hasClass('active')) {
                thumb.velocity({
                    height: "30px",
                    width: "30px",
                    top: "-20px",
                    marginLeft: "-15px"
                }, {
                    duration: 300,
                    easing: 'easeOutExpo'
                });
            }
            var left = e.originalEvent.touches[0].pageX - $(this).offset().left;
            var width = $(this).outerWidth();

            if (left < 0) {
                left = 0;
            } else if (left > width) {
                left = width;
            }
            thumb.addClass('active').css('left', left);
            thumb.find('.value').html($(this).children('input[type=range]').val());
        }

    });

    $(document).on("touchend", range_wrapper, function() {
        if (!range_mousedown) {

            var thumb = $(this).children('.thumb');

            if (thumb.hasClass('active')) {
                thumb.velocity({
                    height: "0",
                    width: "0",
                    top: "10px",
                    marginLeft: "-6px"
                }, {
                    duration: 100
                });
            }
            thumb.removeClass('active');
        }
    });
}

Template.card.events({
  "click .cardLi": function(event, template){
     var idCardtext = template.data._id
     Session.set('IDactiveEditor',template.data._id);
     var divToolbar = document.querySelector('.activeEditor');
     if (divToolbar) {
         var dActive = document.getElementById(divToolbar.id);
         var divID = divToolbar.id.split('_')[1]
         dActive.className += "cardToolbar"
         dActive.className = dActive.className.replace("activeEditor", "");
         document.getElementById("contentEditor_"+divID).style.display = "block";
     }
     document.getElementById("contentEditor_"+idCardtext).style.display = "none";
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
        var htmlEditor = editor.destroy();
        return htmlEditor;
    }
});

Template.cardtext.onRendered(function(){
      var idCardtext = this.data._id;
      Meteor.call("findCardtext",idCardtext, function(err, res){
          if (err){
              console.log(err)
          }else{
              loadEditor(idCardtext)
          }
      })
});

Template.toolbareditor.events({
    'click .ql-size': function(evt, tmpl) {
        var modalFontsize = '#modalFontSize_' + tmpl.data._id
        $('#modalFontSize').openModal();
    }
})

TextcardContent = function() {
    var cardContents = Textcard.findOne({
        _id: Session.get("textcard")
    });
    if (cardContents && cardContents.content)
        return cardContents
}

function loadContentEditor(idCardtext, div){
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
      styles: false
  });
  var cursorManager = editor.addModule('multi-cursor', {
      timeout: 1000
  });
  var authorship = editor.addModule('authorship', {
      authorId: Session.get("browserUUID"), // from url collaborate setting
      color: '#f44336',
      enabled: true
  });

  $('.hideAuthorship').on("click", function() {
      authorship.disable();
  })

  editor.setContents(cardContents.content)
  return editor
}

function loadEditor(idCardtext) {
    var editor = loadContentEditor(idCardtext,'#editor_')
    Textcard.find({
        _id: idCardtext
    }).observeChanges({
        changed: function(id, deltaNew) {
            if (id == idCardtext) {
                var newContents = Textcard.findOne({
                    _id: idCardtext
                })
                var authorIdOps = newContents.editorops.author
                if (syncAuthor(authorIdOps)) {
                    var authorship = editor.getModule('authorship');
                    authorship.addAuthor(authorIdOps, 'rgba(155,167,51,0.5)');
                    retainOps = newContents.editorops.opsauthor.ops[0].retain
                    editor.updateContents(newContents.editorops.opsauthor)
                    // editor.setContents(newContents.content)
                }
            }
        }
    });

    editor.on('text-change', function(delta, source) {
        var editablediv = document.getElementById(editor.id);
        if (source == 'api') {
            var editablediv = document.getElementById(editor.id);
            var divText = editablediv.firstChild;
            var prevTextLength = Session.get("prevTextLength");
            // console.log(prevTextLength)
            var newTextLength = editor.getLength();
            var positionCaret = Session.get("activeCaret") + (newTextLength - prevTextLength);
            if (positionCaret<0){positionCaret=0}
            // console.log(retainOps,positionCaret)
            if (Session.get("IDactiveEditor") == idCardtext) {
                if (retainOps <= Session.get("activeCaret") ||
                    retainOps===undefined ) {
                    editor.setSelection(positionCaret, positionCaret);
                    Session.set("activeCaret", positionCaret);
                    Session.set("prevTextLength", editor.getLength());
                } else {
                    editor.setSelection(Session.get("activeCaret"), Session.get("activeCaret"))
                    Session.set("activeCaret", Session.get("activeCaret"));
                    Session.set("prevTextLength", editor.getLength());
                }
            }
        } else if (source == 'user') {
            if (editor.getSelection()) {
                var caretPosition = editor.getSelection().end;
                Session.set("activeCaret", caretPosition);
                // console.log(caretPosition)
            }
            var newContent = editor.getContents()
            // console.log(delta)
            Meteor.call("updateDelta", idCardtext, newContent, delta, Session.get("browserUUID"));
            Session.set("IDactiveEditor", idCardtext);
            Session.set("prevTextLength", editor.getLength());
        }
    });

    //Caret Position on Click
    editor.on('selection-change', function(range, source) {
        if (source == 'api') {
            cursorquill(range, editor, idCardtext)
        } else if (source == 'user') {
            var caretPosition = editor.getSelection();
            cursorquill(range, editor, idCardtext)
        }
    });
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
    } else {
      var divToolbar = document.querySelector('.activeEditor');
      if (divToolbar) {
          var dActive = document.getElementById(divToolbar.id);
          var divID = divToolbar.id.split('_')[1]
          dActive.className += "cardToolbar"
          dActive.className = dActive.className.replace("activeEditor", "");
          document.getElementById("contentEditor_"+divID).style.display = "block";
      }
    }
}

function syncAuthor(authorIdOps) {
    if (authorIdOps == Session.get("browserUUID")) {
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
    if (textExisting == textTemp) {
        return false
    } else {
        return true
    }
}

// Override Meteor._debug to filter for custom msgs
Meteor._debug = (function (super_meteor_debug) {
  return function (error, info) {
    if (!(info && _.has(info, 'msg')))
      super_meteor_debug(error, info);
  }
})(Meteor._debug);

var nick = new ReactiveVar();
var room = new ReactiveVar('lobby');

// Add a local only collection to manage messages
Messages = new Mongo.Collection(null);

// -------------------------------------------------------------------------- //
// -------------------------------- Handlers -------------------------------- //
// -------------------------------------------------------------------------- //

/**
 * Try to retrieve a client by its nickname
 * @param  {String} nick Nickname to look for
 * @return {Client}      Client object or null|undefined if not found
 */
function findClient(nick) {
  return Clients.findOne({ 'nick': nick});
}

/**
 * Generic method to insert a message in the chat panel
 * @param  {String} room Room name concerned
 * @param  {String} body Body message
 * @param  {String} from Session id of the sender
 */
function insertMessage(room, body, from) {
  // Do nothing if not logged in
  if(!nick.get())
    return;

  var c = from ? Clients.findOne({ 'sid': from }): null;

  if(from && !c)
    c = { 'nick': from };

  Messages.insert({
    'room': room,
    'body': body,
    'from': c && c.nick
  });
  //
  // $('.chat__messages').scrollTo($('li.chat__messages__item:last'));
}

// On connected, subscribe to collections
Streamy.onConnect(function() {
  Meteor.subscribe('clients');
  Meteor.subscribe('rooms', Streamy.id());
});

// On disconnect, reset nick name
Streamy.onDisconnect(function() {
  nick.set('');
  Messages.remove({});
});

Streamy.on('nick_ack', function(data) {
  nick.set(data.nick);
});

// On a lobby message, insert the message
Streamy.on('lobby', function(data) {
  insertMessage('lobby', data.body, data.__from);
});

// More generic, when receiving from a room this message, insert it
Streamy.on('text', function(data) {
  insertMessage(data.__in.toLowerCase(), data.body, data.__from);
});

// On private message
Streamy.on('private', function(data) {
  insertMessage(null, data.body, data.__from);
});

// Someone has joined
Streamy.on('__join__', function(data) {
  // Dismiss if self
  if(data.sid === Streamy.id())
    return;

  var c = Clients.findOne({ 'sid': data.sid });
  var msg = ((c && c.nick) || "Someone") + " has joined";

  insertMessage(data.room.toLowerCase(), msg);
});

// Someone has left
Streamy.on('__leave__', function(data) {
  var c = Clients.findOne({ 'sid': data.sid });
  var msg = ((c && c.nick) || 'Someone') + " has left";

  insertMessage(data.room.toLowerCase(), msg);
});
