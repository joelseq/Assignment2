(function() {
  'use strict';

  assignmentApp
    .config([
      '$stateProvider',
      '$urlRouterProvider',
      '$locationProvider',
      function($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise('/');
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
      }
    ]);
})();
