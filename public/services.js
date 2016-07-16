(function() {

  assignmentApp.factory('socket', function(socketFactory) {
    var myIoSocket = io.connect(serverBaseUrl);

    var socket = socketFactory({
      ioSocket: myIoSocket
    });

    return socket;
  });

})();
