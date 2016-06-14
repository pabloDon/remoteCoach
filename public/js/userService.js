coachModule.factory('userService', function($http) {
  return {
    saveUser : function(user) {
    	sessionStorage.userInfo = JSON.stringify(user);
    },
    getUser : function() {
    	if (sessionStorage.userInfo != null) {
	    	return JSON.parse(sessionStorage.userInfo);
	    }
	    return {};
    },
    resetUser : function() {
        sessionStorage.userInfo = null;
    },
    redirectLoginIfNotUser : function() {
    	var user = this.getUser();
    	return !user._id;
    },
    redirectLoginIfNotAdmin : function() {
    	var user = this.getUser();
    	return !user._id && user.role != 'admin';
    }
  }
});
