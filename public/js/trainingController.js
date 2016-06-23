coachModule.controller('TrainingController', function($scope, restService, userService, $routeParams, $compile, $location) {
  if (userService.redirectLoginIfNotAdmin()) {
    $location.path( "#/admin/login" );
    return;
  }

  $scope.trainingSelected = null;
  $scope.training = {};
  $scope.typeTrainings = [];
  $scope.trainings = [];

  $scope.getFormatDate = function(month, year) {
    return getMonthFormat(month) + "/" + year;
  }

  $scope.removeTraining = function(idTrainingDay) {
    restService.removeTrainingDay(idTrainingDay).then(function(response) {
      document.getElementById(idTrainingDay).remove();
    });  
  }

  //Get catalogs
  restService.getTrainingsType().then(function(response) {
    console.log(response.data);
    $scope.typeTrainings = response.data;
  });
  restService.getTrainings().then(function(response) {
    console.log(response.data);
    $scope.trainings = response.data;
  });

  //Get User
  if ($routeParams.userId) {
    restService.getUser($routeParams.userId).then(function(response) {
      console.log(response.data);
      $scope.user = response.data;
    });  
  }
  
  //Get Calendar trainings
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
  restService.getTrainingsByUserAndMonth($routeParams.userId, $scope.month, $scope.year).then(function(response) {
    console.log(response.data);    
    if (response.data.length > 0) {      
      for (var i=0; i < response.data.length; i++) {
        var wod = response.data[i];
        var training = getTraining($scope.trainings, wod.training);
        var trainingType = getTrainingTypeColor($scope.typeTrainings, training.training_type);
        var dayToAssign = new Date(wod.created_at).getDate();
        var divComponent = getTrainingComponent(training, trainingType, $compile, $scope, wod._id);
        document.getElementById(dayToAssign).appendChild(divComponent);
      }
    }    
  });  

  $scope.getPrevMonth = function() {
    var month = $scope.month;
    var year = $scope.year;
    if (month == 0) {
      year--;
      month = 11;
    } else {
      month--;
    }
    return "#/admin/trainings/" + $routeParams.userId + "/" + month + "/" + year;
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
    return "#/admin/trainings/" + $routeParams.userId + "/" + month + "/" + year;
  }
  
  //Functions
  $scope.showTraining = function(training) {
    $scope.training = training;
  };

  $scope.resetForm = function() {
    $scope.training = {};
  } 

  $scope.removeForm = function() {
    if ($scope.training._id != null) {
      restService.removeTraining($scope.training).then(function(response) {
      });
    }
  };

  $scope.refreshForm = function() {
    if ($scope.training._id != null) {
      restService.updateTraining($scope.training).then(function(response) {
      });
    }
  };

  $scope.selectTraining = function(idTraining) {
    if ($scope.trainingSelected == idTraining) {
      $scope.trainingSelected = null;
    } else {
      $scope.trainingSelected = idTraining;
    }
  };

  $scope.getTrainingTypeColor = getTrainingTypeColor;

  $scope.assignTraining = function(idTd) {
    if (idTd == " ")
      return;
    if ($scope.trainingSelected != null) {
      var training = getTraining($scope.trainings, $scope.trainingSelected);
      var trainingTypeSelected = getTrainingTypeColor($scope.typeTrainings, training.training_type);      

      var schemaTrainingDay = {
        "user_id" : $scope.user._id,
        "training" : training._id,
        "created_at" : new Date($scope.year, $scope.month, idTd)
      };
      restService.saveTrainingDay(schemaTrainingDay).then(function(response) {
        console.log(response.data);
        document.getElementById(idTd).appendChild(getTrainingComponent(training, trainingTypeSelected, $compile, $scope, response.data._id));
        $scope.trainingSelected = null;
      });
      
    }
  };

  $scope.submitTraining = function() {
    restService.saveTraining($scope.training).then(function(response) {
      console.log(response.data);
      $scope.trainings.push($scope.training);
      $scope.training = {};
    });
  };

  $scope.resetFilter = function() {
    $scope.nameFilter = "";
    $scope.textFilter = "";
  };
});