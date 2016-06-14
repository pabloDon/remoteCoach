coachModule.controller('LoginController', function($scope, restService, userService, $location) {
  console.log("Login");

  $scope.credentials = {};

  $scope.loginUser = function() {
    restService.loginUser($scope.credentials).then(function(response) {
      if (response.data._id != null) {
        userService.saveUser(response.data);
        $location.path( "/user/index" );
      } else {
        $scope.credentials = {};
        console.log("ERROR. Invalid credentials")
      }
    }); 
  };

  $scope.loginAdmin = function() {
    restService.loginAdmin($scope.credentials).then(function(response) {
      if (response.data._id != null) {
        userService.saveUser(response.data);
        $location.path( "/admin/index" );
      } else {
        $scope.credentials = {};
        console.log("ERROR. Invalid credentials")
      }
    });
  }
});