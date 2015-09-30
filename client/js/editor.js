//Template.hello.helpers({
//    counter: function () {
//        return Session.get('counter');
//    }
//});
//
//Template.hello.events({
//    'click button': function () {
//        // increment the counter when button is clicked
//        Session.set('counter', Session.get('counter') + 1);
//    }
//});
//
//var exampleEditor
//var hasil
//Template.hello.rendered = function (){
//    var elem = document.querySelector('.cardstext');
//    exampleEditor = carota.editor.create(elem);
//    // Set up our custom inline - a smiley emoji
//    var smiley = document.querySelector('#smiley img');
//    exampleEditor.customCodes = function(obj) {
//        if (obj.smiley) {
//            // Must return an object that encapsulates the inline
//            return {
//                // measure: must return width, ascent and descent
//                measure: function( /*formatting*/ ) {
//                    return {
//                        width: 24,
//                        ascent: 24,
//                        descent: 0
//                    };
//                },
//                // draw: implements the appearance of the inline on canvas
//                draw: function(ctx, x, y, width, ascent, descent, formatting) {
//                    ctx.drawImage(smiley, x, y - ascent, width, ascent);
//                }
//            }
//        }
//    };
//
//    // Setting up the button so user can insert a smiley
//    carota.dom.handleEvent(document.querySelector('#smiley'), 'click', function() {
//        exampleEditor.insert({
//            smiley: true
//        });
//    });
//
//    // Wire up undo/redo commands
//    var undo = document.querySelector('#undo'),
//        redo = document.querySelector('#redo');
//
//    carota.dom.handleEvent(undo, 'click', function() {
//        exampleEditor.performUndo(false);
//    });
//
//    carota.dom.handleEvent(redo, 'click', function() {
//        exampleEditor.performUndo(true);
//    });
//
//    var updateUndo = function() {
//        undo.disabled = !exampleEditor.canUndo(false);
//        redo.disabled = !exampleEditor.canUndo(true);
//    };
//
//    // Wire up the toolbar controls
//    ['font', 'size', 'bold', 'italic', 'underline',
//        'strikeout', 'align', 'script', 'color'
//    ].forEach(function(id) {
//        var elem = document.querySelector('#' + id);
//
//        // When the control changes value, update the selected range's formatting
//        carota.dom.handleEvent(elem, 'change', function() {
//            var range = exampleEditor.selectedRange();
//            var val = elem.nodeName === 'INPUT' ? elem.checked : elem.value;
//            range.setFormatting(id, val);
//        });
//
//        // When the selected range coordinates change, update the control
//        exampleEditor.selectionChanged(function(getFormatting) {
//            var formatting = getFormatting();
//            var val = id in formatting ? formatting[id] : carota.runs.defaultFormatting[id];
//            if (elem.nodeName === 'INPUT') {
//                if (val === carota.runs.multipleValues) {
//                    elem.indeterminate = true;
//                } else {
//                    elem.indeterminate = false;
//                    elem.checked = val;
//                }
//            } else {
//                elem.value = val;
//            }
//        });
//    });
//
//    var valign = document.querySelector('#valign')
//    carota.dom.handleEvent(valign, 'change', function() {
//        exampleEditor.setVerticalAlignment(valign.value);
//    });
//
//    var updateTimer = null;
//    var manuallyChangingJson = 0;
//
//    // Whenever the document changes, re-display the JSON format and update undo buttons
//    exampleEditor.contentChanged(function() {
//        Cardstext.update({
//            _id:"vsAvr6Jx6HZbBQQff"
//        },{
//            content: exampleEditor.save()
//        })
//        updateUndo();
//    });
//
//    // Load one of the hidden chunks of HTML
//    var load = function(selector) {
//        var html = document.querySelector(selector);
//        if (html) {
//            var runs = carota.html.parse(html, {
//                carota: {
//                    color: 'orange',
//                    bold: true,
//                    size: 14
//                }
//            });
//            exampleEditor.load(runs);
//        }
//    };
//
//    // Set up the page links so they call load
//    var pageLinks = document.querySelectorAll('#pageLinks a');
//    for (var n = 0; n < pageLinks.length; n++) {
//        (function() {
//            var pageLink = pageLinks[n];
//            var ref = pageLink.attributes['href'].value;
//            if (ref[0] === '#') {
//                carota.dom.handleEvent(pageLink, 'click', function() {
//                    load(ref);
//                    return false;
//                });
//            }
//        })();
//    }
//    load('#welcome');
//    exampleEditor.load(sampleJsonData)
//}
//
////var CardInit = Meteor.subscribe("firstInit","vsAvr6Jx6HZbBQQff") 
////Meteor.autorun(function() {
////    if (CardInit.ready()) {
////        var firstDataInit = Cardstext.find({_id:"vsAvr6Jx6HZbBQQff"}).fetch();
////        exampleEditor.load(firstDataInit.content);
////    }  
////});
//
//Meteor.autosubscribe(function() {
//  Cardstext.find({_id:"vsAvr6Jx6HZbBQQff"}).observe({
//    changed: function(test){ 
//        exampleEditor.load(test.content)
//    }
//  });
//});
