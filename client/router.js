Router.map( function () {
    this.route('myCourses', {
        path: '/'
    });
    this.route('course', {
        // get parameter via this.params
        path: '/courses/:_id',
        waitOn : function(){
          return Meteor.subscribe('textcard');
        }
//        onBeforeAction: function (pause) {
//            var textcard = Textcard.findOne({_id: this.params._id})
//            if (textcard && textcard.content) {
//                this.next();
//            }else {
//                Textcard.findOne({_id: this.params._id})
//                this.next();
//            }
//        }
    });
});
