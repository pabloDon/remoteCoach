var getMonth = function(year, month) {
  var ret = [];  
  var currentMonth = new Date(year, month, "01");
  var first_dayWeek = currentMonth.getDay();
  var print_blank = true;

  for (var i = 0; i < 6; i++) {
    var print_line = [];
    for (var j = 1; j <= 7; j++) {
      
      print_blank = print_blank && first_dayWeek != j%7;
      if (print_blank) {
        print_line.push(" ");
      } else {
        if (currentMonth.getMonth() != month)
          break;
        print_line.push(currentMonth.getDate());
        currentMonth.setDate(currentMonth.getDate() + 1);     
      }
    }
    ret.push(print_line);      
  }
  return ret;
};

var getParameterByName = function(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var getTrainingTypeColor = function(trainingTypes, id) {
  for (var i=0; i < trainingTypes.length; i++) {
    if (trainingTypes[i]._id == id)
      return trainingTypes[i].training_type;
  }
  return "default";
}

var getTrainingType = function(trainingTypes, id) {
  for (var i=0; i < trainingTypes.length; i++) {
    if (trainingTypes[i]._id == id)
      return trainingTypes[i].name;
  }
  return "N/A";
}

var getTraining = function(trainings, idTraining) {
  for (var i=0; i < trainings.length; i++) {
    if (trainings[i]._id == idTraining)
      return trainings[i];
  }
  return {};
}

var getTrainingComponent = function(training, trainingTypeSelected, compileDirective, scope, idTrainingDay) {
  var span = document.createElement("span");
  span.className = "tooltiptext";
  span.innerHTML = training.description;

  var spanTimes = document.createElement("span");
  spanTimes.className = "glyphicon glyphicon-remove times-training";
  spanTimes.setAttribute("ng-click", "removeTraining(\"" + idTrainingDay + "\")");
  compileDirective(spanTimes)(scope);

  var div = document.createElement("div");
  div.innerHTML = training.name;
  div.className = "alert-" + trainingTypeSelected + " training-day";
  div.setAttribute("id", idTrainingDay);
  div.appendChild(span);
  div.appendChild(spanTimes);

  return div;
};

var getTrainingComponentForUser = function(training, trainingTypeSelected, compileDirective, scope, idTrainingDay) {
  var span = document.createElement("span");
  span.className = "tooltiptext";
  span.innerHTML = training.description;

  var div = document.createElement("div");
  div.innerHTML = training.name;
  div.className = "alert-" + trainingTypeSelected + " training-day";
  div.setAttribute("id", idTrainingDay);
  div.appendChild(span);
  
  return div;
};

var getMonthFormat = function(month) {
  var labels = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  return labels[month];
}

var getUser = function() {
  //TODO
  return null;
}