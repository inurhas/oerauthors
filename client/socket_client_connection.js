////var socket = io('http://localhost:3000');
//console.log(document.location.hostname)
//var socket = io.connect(document.location.hostname, {port: 3333});
//socket.on('news', function (data) {
//    console.log(data);
//    socket.emit('my other event', { my: 'data' });
//});
// // Uppon close
//
//var self = this;
//
//Meteor.default_connection._stream.on('disconnect', function onClose() {
//    // If it was previously connected, call disconnect handlers
//    if(Meteor.default_connection._stream.status().connected) {
//      _.each(self.disconnectHandlers(), function forEachDisconnectHandler(cb) {
//        cb.call(self);
//      });
//    }
//});
//
//// Attach message handlers
//Meteor.default_connection._stream.on('message', function onMessage(data) {
//
//    // Parse the message
//    var parsed_data = JSON.parse(data);
//
//    // Retrieve the msg value
//    var msg = parsed_data.msg;
//
//    // And dismiss it
//    delete parsed_data.msg;
//
//    // If its the connected message
//    if(msg === 'connected') {
//      // Call each handlers
//      _.each(self.connectHandlers(), function forEachConnectHandler(cb) {
//        cb.call(self);
//      });
//    }
//    else if(msg) {
//      // Else, call the appropriate handler
//      self.handlers(msg).call(self, parsed_data);
//    }
//});

//var courseUrl = window.location.href;
//console.log(courseUrl);
//var socket = new BCSocket(courseUrl, {reconnect: true});
////var sjs = new sharejs.Connection(socket);

//var s = new BCSocket(null, {reconnect: true});
//var sjs = new window.sharejs.Connection(s);


//// Client
//Streamy.on('my_message', function(data) {
//  console.log(data);
//});