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
        $('#modalAuthorSettings').openModal({
          ready: function() { coAuthorInit() },  //call function from course_session.js
          complete: function() { coAuthorInit() }, //call function from course_session.js
        });
    },
    'click .modalAccountsSetting': function(evt, tmpl){
        $('#modalAccountsSetting').openModal();
    }
})

Template.course.onRendered(function() {
    var courseUrl = "http://localhost:3000" + Iron.Location.get().path
    var sortableUl = document.getElementById('listOfCourseCards');
    var editableList = Sortable.create(sortableUl, {
        delay: 0,
        animation: 200,
        draggable: ".cardLi",
        handle: ".dragbtnli",
        store: {

            get: function(sortable) {
                var order = localStorage.getItem(sortable.options.group);
                return order ? order.split('|') : [];
            },

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

Template.modalGeneralMessage.helpers({
  inputMessage:function(){
    return Session.get("modalGeneralMessage");
  }
})
