
coachModule.controller('UserController', function($scope, restService, userService) {
  if (userService.redirectLoginIfNotAdmin()) {
    $location.path( "/admin/login" );
    return;
  }
  var showOnly = getParameterByName("showonly");
  $scope.isThereParams = showOnly != null;
  
  $scope.users = [];
  $scope.user = {};

  var rest = null;
  if (showOnly == 'clubs') {
    rest = restService.getClubs();
  } else if (showOnly == 'clients') {
    rest = restService.getClients()
  } else {
    rest = restService.getUsers();
  }

  rest.then(function(response) {
    console.log(response.data);
    $scope.users = response.data;
  });

  $scope.submitUser = function() {
    console.log($scope.user);
    restService.saveUser($scope.user).then(function(response) {
      console.log(response.data);
      $scope.users.push(response.data);
      $scope.user = {};
    });
  }; 

  $scope.resetFilter = function() {
    $scope.nameFilter = "";
    $scope.surnameFilter = "";
    $scope.textFilter = "";
  };
});