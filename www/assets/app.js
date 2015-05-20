var app = angular.module('MyApp', ['ionic', 'ngCordova']); /* ngCordova provides PhoneGap API access! */
var currentTour = 0;

app.config(function($stateProvider, $urlRouterProvider)
{
  $stateProvider.state('index', { url: '/home', templateUrl: 'home.html', controller: indexController });
  $stateProvider.state('information', { url: '/information', templateUrl: 'information.html', controller: informationController });
  $stateProvider.state('tourSelector', { url: '/tourSelector', templateUrl: 'tourSelector.html', controller: tourSelectorController });
  $urlRouterProvider.otherwise('/home'); /* Redirect the app to the home page on launch. */
});

app.run(function($ionicPlatform)
{
  $ionicPlatform.ready(function()
  {
    if (ionic.Platform.isIOS())
    {
      ionic.Platform.fullScreen();
      if (window.StatusBar)
      {
        return StatusBar.hide();
      }
    }
  });
});

/* A JavaScript wrapper for the ionic stack pop function. */
function goBack($ionicHistory)
{
  $ionicHistory.goBack();
}

function loadTourSelectorData($scope)
{
  var file = 'audiotour/json/tours.json';
  var ajaxObject = new XMLHttpRequest();
  ajaxObject.overrideMimeType("application/json");
  ajaxObject.open('GET', file, true);
  ajaxObject.onreadystatechange = function()
  {
     if (ajaxObject.readyState == 4)
     {
       var tourSelectorData = $.parseJSON(ajaxObject.responseText);
       $scope.objects = tourSelectorData.pages[currentTour].content;
     }
  }
  ajaxObject.send(null);
}

function indexController($scope, $ionicHistory)
{
  $scope.goBack = function()
  {
    goBack($ionicHistory);
  };
}

function informationController($scope, $ionicHistory)
{
  $scope.goBack = function()
  {
    goBack($ionicHistory);
  };
}

function tourSelectorController($scope, $ionicHistory)
{
  loadTourSelectorData($scope);
  $scope.goBack = function()
  {
    goBack($ionicHistory);
  };
  $scope.select = function($link)
  {
    if(isNaN($link))
    {
      alert("Must link to tableview");
    }
    else
    {
      currentTour = $link.valueOf();
      loadTourSelectorData($scope);
      window.location = "#/tourSelector";
    }
  };
}
