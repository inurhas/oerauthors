Streamy.onDisconnect ( function(socket) {
  Streamy.Rooms.clearEmpty
});

var ot = Meteor.npmRequire ('ot');
