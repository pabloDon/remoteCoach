coachModule.factory('restService', function($http) {
  return {
    getTrainings : function() {
      var promise = $http.get("/rest/trainings").then(function(response) {
        return response.data;
      });
      return promise;
      
    },
    saveTraining: function(training) {
      var promise = $http.post("/rest/trainings/new", training).success(function(data, status) {
        return data;
      });
      return promise;
    },
    removeTraining: function(training) {
      var promise = $http.post("/rest/trainings/delete", training).success(function(data, status) {
        return data;
      });
      return promise;
    },
    updateTraining: function(training) {
      var promise = $http.post("/rest/trainings/update", training).success(function(data, status) {
        return data;
      });
      return promise;
    },
    getTrainingById : function(trainingId) {
      var promise = $http.get("/rest/trainings/" + trainingId).then(function(response) {
        return response.data;
      });
      return promise;
    },
    getTrainingsByUserAndMonth : function(userId, month, year) {
      var promise = $http.get("/rest/trainings/" + userId + "/" + month + "/" + year).then(function(response) {
        return response.data;
      });
      return promise;
    },
    getTrainingByUserToday : function(userId) {
      var promise = $http.get("/rest/trainingsToday/" + userId).then(function(response) {
        return response.data;
      });
      return promise;
    },
    saveTrainingDay : function(trainingDay) {
      var promise = $http.post("/rest/saveTrainingDay", trainingDay).success(function(data, status) {
        return data;
      });
      return promise;
    },
    removeTrainingDay : function(idTrainingDay) {
      var promise = $http.post("/rest/removeTrainingDay", {"idTrainingDay": idTrainingDay}).success(function(data, status) {
        return data;
      });
      return promise;
    },
    getTrainingsType : function() {
      var promise = $http.get("/rest/trainingtypes").then(function(response) {
        return response.data;
      });
      return promise;
    },
    saveTrainingType: function(trainingType) {
      var promise = $http.post("/rest/trainingtypes/new", trainingType).success(function(data, status) {
        return data;
      });
      return promise;
    },
    getTrainingTypeById: function(trainingTypeId) {
      var promise = $http.get("/rest/trainingtypes/" + trainingTypeId).then(function(response) {
        return response.data;
      });
      return promise;
    },
    getUsers: function() {
      var promise = $http.get("/rest/users/").then(function(response) {
        return response.data;
      });
      return promise;
    },
    getClubs: function() {
      var promise = $http.get("/rest/clubs/").then(function(response) {
        return response.data;
      });
      return promise;
    },
    getClients: function() {
      var promise = $http.get("/rest/clients/").then(function(response) {
        return response.data;
      });
      return promise;
    },
    saveUser: function(user) {
      var promise = $http.post("/rest/users/new", user).success(function(data, status) {
        return data;
    });
      return promise;
    },
    getUser: function(userId) {
      var promise = $http.get("/rest/users/" + userId).then(function(response) {
        return response.data;
      });
      return promise;
    },
    getAdminId: function() {
      var promise = $http.get("/rest/idAdmin").then(function(response) {
        return response.data;
      });
      return promise;
    },
    loginUser: function(user) {
      var promise = $http.post("/rest/loginUser", user).success(function(data, status) {
        return data;
      });
      return promise;
    },
    loginAdmin: function(admin) {
      var promise = $http.post("/rest/loginAdmin", admin).success(function(data, status) {
        return data;
      });
      return promise;
    },

    getMessages: function(userId) {
      var promise = $http.get("/rest/messages/" + userId).then(function(response) {
        return response.data;
      });
      return promise;
    },
    getMessage: function(messageId) {
      var promise = $http.get("/rest/message/" + messageId).then(function(response) {
        return response.data;
      });
      return promise;
    },
    sendMessage: function(message) {
      var promise = $http.post("/rest/messages/new", message).success(function(data, status) {
        return data;
      });
      return promise;
    },
    
    getLatestArticles: function() {
      var promise = $http.get("/rest/latest10articles").then(function(response) {
        return response.data;
      });
      return promise;
    }
  };
});