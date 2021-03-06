var coachModule = angular.module('remoteCoachModule', ['ngRoute']);

coachModule.config(function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'templates/index.html',
    controller: 'IndexController'
  })
  .when('/acerca-de', {
    templateUrl: 'templates/about.html',
    controller: 'IndexController'
  })
  .when('/servicios', {
    templateUrl: 'templates/services.html',
    controller: 'IndexController'
  })
  .when('/contacto', {
    templateUrl: 'templates/contact.html',
    controller: 'IndexController'
  })
  
  .when('/admin/login', {
    templateUrl: 'templates/loginAdmin.html',
    controller: 'LoginController'
  })

  .when('/admin/index', {
    templateUrl: 'templates/admin.html',
    controller: 'AdminController'
  })

  .when('/admin/configuration', {
    templateUrl: 'templates/trainingtypes.html',
    controller: 'ConfigController'
  })

  .when('/admin/trainings', {
    templateUrl: 'templates/trainingsIndex.html',
    controller: 'TrainingController'
  })
  .when('/admin/trainings/new', {
    templateUrl: 'templates/form-training.html',
    controller: 'TrainingController'
  })
  .when('/admin/trainings/:userId', {
    templateUrl: 'templates/trainings.html',
    controller: 'TrainingController'
  })
  .when('/admin/trainings/:userId/:month/:year', {
    templateUrl: 'templates/trainings.html',
    controller: 'TrainingController'
  })

  .when('/admin/users/', {
    templateUrl: 'templates/users.html',
    controller: 'UserController'
  })
  .when('/admin/users/new', {
    templateUrl: 'templates/form-user.html',
    controller: 'UserController'
  })

  .when('/user/index', {
    templateUrl: 'templates/index-user.html',
    controller: 'UserAdminController'
  })

  .when('/user/calendar', {
    templateUrl: 'templates/calendar-user.html',
    controller: 'UserAdminController'
  })
  .when('/user/calendar/:month/:year', {
    templateUrl: 'templates/calendar-user.html',
    controller: 'UserAdminController'
  })

  .when('/user/messages', {
    templateUrl: 'templates/index-messages.html',
    controller: 'UserAdminController'
  })
  .when('/user/messages/new', {
    templateUrl: 'templates/new-message.html',
    controller: 'UserAdminController'
  })
  .when('/user/message/:messageId', {
    templateUrl: 'templates/user-message.html',
    controller: 'UserAdminController'
  })

  .when('/user/login', {
    templateUrl: 'templates/loginUser.html',
    controller: 'LoginController'
  })

  .otherwise({redirectTo: '/'});
});

coachModule.controller('IndexController', function($scope, $http, $routeParams, restService) {
  $scope.isContainerFull = true;
  console.log("Index");
  $scope.contact = {};
  if ($routeParams.pack) {
    if ($routeParams.pack == "ironman") {
      $scope.contact.body = "Estoy interesado en el pack IRONMAN y quiero que me envíen más información.";
    } else if ($routeParams.pack == "delfin") {
      $scope.contact.body = "Estoy interesado en el pack DELFIN y quiero que me envíen más información.";
    } else if ($routeParams.pack == "amateur") {
      $scope.contact.body = "Estoy interesado en el pack AMATEUR y quiero que me envíen más información.";
    }
  }

  verifyData = function() {
    return $scope.contact.name && $scope.contact.email && $scope.contact.body && $scope.contact.body.length > 10;
  };

  $scope.sendContact = function() {
    if (verifyData()) {
        restService.sendContactForm($scope.contact).then(function(response) {
          if (response.data.length != 0) {
            $scope.contact = {};
          }
        });
    }
  }
});

coachModule.controller('AdminController', function($scope, $http) {
  console.log("Admin");
});

coachModule.controller('ConfigController', function($scope, restService) {
  console.log("Training Type");

  $scope.trainingType = {};
  $scope.typeTrainings = [];
  
  restService.getTrainingsType().then(function(response) {
      console.log(response.data);
      $scope.typeTrainings = response.data;
  });    
  
  $scope.submitTrainingType = function() {
    console.log($scope.trainingType);
    
    restService.saveTrainingType($scope.trainingType).then(function(response) {
      console.log(response.data);
      $scope.typeTrainings.push(response.data);
      $scope.trainingType = {};
    });    
  }
});