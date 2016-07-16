(function() {

  assignmentApp
    .controller('MainCtrl', [
      '$scope',
      '$rootScope',
      '$mdDialog',
      'socket',
      '$http',
      function($scope, $rootScope, $mdDialog, socket, $http) {
        $scope.messages = [];
        $scope.room = "";


        //Modal setup
        //listen for new message
        //Notify server of the new message
      }
    ]);

  assignmentApp
    .controller('ChatCtrl', [
      
    ]);

})();
