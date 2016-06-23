
coachModule.controller('UserAdminController', function($scope, restService, userService, $location, $routeParams, $compile) {
  if (userService.redirectLoginIfNotUser()) {
    $location.path( "/user/login" );
    return;
  }

  $scope.typeTrainings = [];
  $scope.trainings = [];
  $scope.todayTraining = null;
  $scope.messages = [];
  $scope.message = {};
  $scope.articles = [];

  //Get catalogs
  restService.getTrainingsType().then(function(response) {
    $scope.typeTrainings = response.data;
  });
  restService.getTrainings().then(function(response) {
    $scope.trainings = response.data;
  });

  //User from session  
  $scope.user = userService.getUser();
  
  //Today training
  restService.getTrainingByUserToday($scope.user._id).then(function(response) {
    if (response.data.length != 0) {
      $scope.todayTraining = [];
      for (var i=0; i < response.data.length; i++) {
        $scope.todayTraining.push(getTraining($scope.trainings,response.data[i].training));
      }
    }
  }); 
  $scope.getTrainingType = getTrainingType;  
  
  //Inbox
  restService.getMessages($scope.user._id).then(function(response) {
      $scope.messages = response.data;
      $scope.last10messages = $scope.messages.slice(0,10);
  });
  
  $scope.submitMessage = function() {
    restService.getAdminId().then(function(response) {
      $scope.message.to = response.data;
      $scope.message.from = $scope.user._id;
      $scope.message.read = false;
      restService.sendMessage($scope.message).then(function(response) {
        if (response.data) {
          $scope.message = {};
        }
      })
    });
  };

  if($routeParams.messageId) {
    restService.getMessage($routeParams.messageId).then(function(response) {
      if(response.data.length == 1)
        $scope.message = response.data[0];
    });
  }

  //Calendar
  //Get Calendar trainings
  if (window.location.hash.indexOf("calendar") > -1) {
    if ($routeParams.month && $routeParams.year && 
        parseInt($routeParams.month) >= 0 && parseInt($routeParams.month) <= 12 && 
        parseInt($routeParams.year) >= 2014 && parseInt($routeParams.year) <= 2030) {
      $scope.month = parseInt($routeParams.month);
      $scope.year = parseInt($routeParams.year);
    } else {
      var d = new Date();    
      $scope.month = d.getMonth();
      $scope.year = d.getFullYear();
    }  
    $scope.monthDays = getMonth($scope.year, $scope.month);
    restService.getTrainingsByUserAndMonth($scope.user._id, $scope.month, $scope.year).then(function(response) {
      console.log(response.data);    
      if (response.data.length > 0) {      
        for (var i=0; i < response.data.length; i++) {
          var wod = response.data[i];
          var training = getTraining($scope.trainings, wod.training);
          var trainingType = getTrainingTypeColor($scope.typeTrainings, training.training_type);
          var dayToAssign = new Date(wod.created_at).getDate();
          var divComponent = getTrainingComponentForUser(training, trainingType, $compile, $scope, wod._id);
          document.getElementById(dayToAssign).appendChild(divComponent);
        }
      }    
    }); 
    $scope.getFormatDate = function(month, year) {
      return getMonthFormat(month) + "/" + year;
    }

    $scope.getPrevMonth = function() {
      var month = $scope.month;
      var year = $scope.year;
      if (month == 0) {
        year--;
        month = 11;
      } else {
        month--;
      }
      return "#/user/calendar/" + month + "/" + year;
    }

    $scope.getNextMonth = function() {
      var month = $scope.month;
      var year = $scope.year;
      if (month == 11) {
        year++;
        month = 0;
      } else {
        month++;
      }
      return "#/user/calendar/" + month + "/" + year;
    };
  }

  //Logout
  $scope.logout = function() {
    userService.resetUser();
    $location.path( "/" );
  }

  //Articles
  if (window.location.hash.indexOf("index") > -1) {
    restService.getLatestArticles().then(function(response) {
      if (response.data) {
        $scope.articles = response.data;
      }
    })
  }
});