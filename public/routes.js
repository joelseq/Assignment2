(function() {
  'use strict';

  assignmentApp
    .config([
      '$stateProvider',
      '$urlRouterProvider',
      '$locationProvider',
      function($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise('/home');

        $stateProvider

          .state('home', {
            url: '/',
            templateUrl: 'views/home.html',
            controller: 'MainCtrl'
          })

          .state('chat', {
            url: '/chat',
            templateUrl: 'views/chat.html',
            controller: 'ChatCtrl'
          });

        //use the HTML5 History API
        $locationProvider.html5Mode(true);
      }
    ]);
})();
