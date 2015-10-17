Router.map( function () {
    this.route('myCourses', {
        path: '/'
    });
    this.route('course', {
        // get parameter via this.params
        path: '/:_id',
        waitOn : function(){
          return Meteor.subscribe('textcard');
        },
        onBeforeAction : function(){
          Streamy.join(urlsplit()[0])
          this.next();
        },
    });
});

urlsplit = function() {
    var urlCourse = Router.current().location.get().href
    var uniqueUrl = urlCourse.split("/");
    uniqueUrl = uniqueUrl[uniqueUrl.length - 1]
    var idCourseUrl = uniqueUrl.split("?#=");
    return idCourseUrl
}
