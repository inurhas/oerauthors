//// When a new connection has been received
//  Meteor.default_server.stream_server.register(function onNewConnected(socket) {
//    var handlers_registered = false;
//    
//    // On closed, call disconnect handlers
//    socket.on('close', function onSocketClosed() {
//        console.log(socket)
//    });
//    
//    // This little trick is used to register protocol handlers on the 
//    // socket._meteorSession object, so we need it to be set
//    socket.on('data', function onSocketData(raw_data) {
//        console.log(raw_data)
////        console.log('r')
//    });
//      
//    socket.on('open', function onSocketOpen(test){
//        console.log(test)
//    });
//  });
//var sharejs = Meteor.npmRequire('share');
//var socketIO = Meteor.npmRequire('socket.io');
//var io = socketIO.listen(3333);
////var syncServers = {};
//io.set('origins', process.env.origin || '*:*');
//var usedSocketIds = {};
//console.log(io)
//io.on('connection', function(socket){
//    socket.on('event', function(data){
//        console.log(data)
//    });
//    socket.on('disconnect', function(data){
//        console.log(data)
//    });
//});

//io.on('connection', function (socket) {
//  socket.emit('news', { hello: 'world' });
//  socket.on('my other event', function (data) {
//    console.log(data);
//  });
//});
//
//Textcard.find({}).observeChanges({
//    added: function (id, record) {
//        var path_io = io.of('/courses/' + id)
//        console.log(path_io)
//        path_io.on('connection', function(socket) {
//        });
//    }
//})
