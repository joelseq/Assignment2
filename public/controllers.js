(function() {

  assignmentApp
    .controller('MainCtrl', [
      '$scope',
      '$rootScope',
      'socket',
      '$state',
      '$alert',
      'userService',
      function($scope, $rootScope, socket, $state, $alert, userService) {

        $scope.checkUser = function(username) {
          let found = false;
          let users = [];

          userService.sendGet().success(function(us) {
            users = us;

            users.forEach(function(user) {
              if($scope.username === user.username)
                found = true;
            });

            if(!found) {
              $rootScope.currentUser = $scope.username;

              socket.emit('new user', {
                username: $scope.username
              });

              $state.go('chat');
            } else {
              $alert({
                content: "Username already exists",
                animation: 'fadeZoomFadeDown',
                type: 'material',
                duration: 3
              });
            }
          });

        };
      }
    ]);

  assignmentApp
    .controller('ChatCtrl', [
      '$scope',
      '$rootScope',
      '$mdDialog',
      'socket',
      '$http',
      '$state',
      function($scope, $rootScope, $mdDialog, socket, $http, $state) {
        if($rootScope.currentUser == undefined) {
          $state.go('home');
        }

        //Array of message objects
        $scope.messages = [];

        $http.get('http://localhost:3000/msg').success(function(messages) {
          $scope.messages = messages;
        });

        socket.on('message created', (data) => {
          //Push the new message to our $scope.messages
          $scope.messages.push(data);
          //Clear the textarea
          $scope.message = "";
        });

        $scope.send = function(msg) {
          //Notify the server that there is a new message with the message as packet
          socket.emit('new message', {
            message: msg,
            username: $rootScope.currentUser
          });
        };

      }
    ]);

})();
