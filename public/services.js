(function() {

  assignmentApp.factory('socket', function(socketFactory) {
    var myIoSocket = io.connect(serverBaseUrl);

    var socket = socketFactory({
      ioSocket: myIoSocket
    });

    return socket;
  });

  assignmentApp.factory('userService', function($http) {
    let self = this;

    self.sendGet = function() {
      return $http.get('http://localhost:3000/users');
    };

    return self;

  });
})();
