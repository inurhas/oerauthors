//Alerts = new Meteor.Collection("alerts")
//
//Meteor.publish("alerts", function(){
// Alerts.find();
//});
//
//Alerts.remove({}); // remove all
//Alerts.insert({message: "Some message to show on every client."});

Meteor.publish("firstInit", function(idCard){
    return Cardstext.find({_id:idCard});
})

Meteor.publish("courses", function(idCard){
    return Courses.find({});
})

Meteor.publish("textcard", function(idCard){
    return Textcard.find({});
})
//Meteor.Method({
//    findCardtext:function(id){
//        return Textcard.findOne({_id:id});
//    }
//})
