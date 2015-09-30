//Courses = new Meteor.Collection("courses");
//Textcard = new Meteor.Collection ("textcard");
//editorOps = new Meteor.Collection ("editorops")
Meteor.setInterval(function(){
    Textcard.remove({});
    Courses.remove({});
    addOneCours();
}, 7200000)

Meteor.methods({
    addDelta:function(content){
        var id = Textcard.insert({
            owner:"irawan",
            metadata: [
                "coba",
                "ilmu",
                "baru",
                "test"
            ],
            status: "share",
            content: content,
            editorops: {
                author:null,
                opsauthor:null
            }
        });
        return id
    },
    updateDelta:function(idTextcard, newContent, delta, authorops){
        Textcard.update({_id:idTextcard},{
            $set:{
                'content': newContent,
                'editorops.author': authorops,
                'editorops.opsauthor': delta,
            }
        });
    },
    findCardtext:function(id){
        return Textcard.findOne({_id:id});
    }
})

//Meteor.methods({
//    addEditorOps: function(editorId){
//        editorOps.insert({
//            editorId : editorId,
//            opsHistory : []
//        })
//    },
//    addHistOps: function(editorId, delta){
//        editorOps.update({editorId:editorId},{
//            $addToSet:{
//                opsHistory:delta
//            }
//        })
//    }
//});

Meteor.methods({
    deleteAllCardsInCourse: function(idCourse){
        Courses.update({_id: idCourse},{
            $set:{
                cards:[]
            }
        })
    },
    addNewCardsToCourse: function (idCourse, idCard, type){
        Courses.update({_id: idCourse},{
            $addToSet: {
                cards: {
                    _id: idCard,
                    type: type
                }
            }
        })
    },
    updateCardsPosition: function (idCourse, orderedCards){
        Courses.update({_id: idCourse},{
            $set:{
                cards:orderedCards
            }
        })
    },
    addCoAuthors : function(idCourse, urlId, url, color) {
        Courses.update({_id: idCourse},{
            $addToSet: {
                coauthors: {
                    urlid:urlId,
                    url:url,
                    name:"Anonym",
                    color:color
                }
            }
        })
    },
    updateCoAuthors : function(idCourse, urlId, url, name, color){
        Courses.update({_id: idCourse, "coauthors.urlid":urlId},{
            $set: {
                coauthors: {
                    urlid:urlId,
                    url:url,
                    name:name,
                    color:color
                }
            }
        })
    }
});

//var Schema = {};
//Schema.Card = new Simpleschema ({
//    type : {
//        type : String,
//        label : type,
//        max : 200
//    },
//    owner : {
//        type : String,
//        max : 200
//    },
//    metadata : {
//        type : [object]
//    },
//    status : {
//        type : String,
//        allowedValues: ['share', 'privat']
//    },
//    content : {
//        type : [object]
//    }
//})
//
//Schema.Course = new Simpleschema({
//    authors : {
//        type : [object]
//    },
//    metadata : {
//        type : [object]
//    },
//    revision : {
//        type : [object]
//    },
//    status : {
//        type : String,
//        allowedValues: ['share', 'privat']
//    },
//    cards : {
//        type : Schema.Card
//    }
//})
//
//Textcard.attachSchema(Schema.Card);
//Courses.attachSchema(Schema.Course);
//Textcard.remove({})

//editorOps.remove({})
//Courses.remove({})
//if (Textcard.find().count()<3) {
//    Textcard.insert({
//        owner:"irawan",
//        metadata: [
//            "coba",
//            "ilmu",
//            "baru",
//            "test"
//        ],
//        status: "share",
//        content: {
//            text : "I am a very simple card"
//        },
//    });
//}
//
if (Courses.find().count()==0){
    Courses.insert({
        authors : "irawan",
        coauthors : [
            {
                urlid:"scsUIH80B-IHKJBIK-dasd-0987KHK",
                url:"http://localhost:3000/course/4234344234234?#=scsUIH80B-IHKJBIK-dasd-0987KHK",
                name:"Anonym",
                color:"rgba(155,167,51,0.5)"
            }
        ],
        metadata : [
            "satu",
            "dua",
            "tiga"
        ],
        revision : [
            {
                number : 0,
                cards : []
            },

        ],
        status : "share",
        cards : [],
    })
}

function addOneCours(){
  if (Courses.find().count()==0){
      Courses.insert({
          authors : "irawan",
          coauthors : [
              {
                  urlid:"scsUIH80B-IHKJBIK-dasd-0987KHK",
                  url:"http://localhost:3000/course/4234344234234?#=scsUIH80B-IHKJBIK-dasd-0987KHK",
                  name:"Anonym",
                  color:"rgba(155,167,51,0.5)"
              }
          ],
          metadata : [
              "satu",
              "dua",
              "tiga"
          ],
          revision : [
              {
                  number : 0,
                  cards : []
              },

          ],
          status : "share",
          cards : [],
      })
  }
}
//
//Textcard.update({_id:"PXRPH5kfzbqp55wwj"},{
//    $set:{
//        content:{
//            text:""
//        }
//    }
//})
//
//Textcard.update({_id:"KAhWu5yywnBomL5F3"},{
//    $set:{
//        content:{
//            text:""
//        }
//    }
//})
