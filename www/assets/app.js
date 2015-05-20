var app = angular.module('WoodsonArt', ['ionic', 'ngCordova']); /* ngCordova provides PhoneGap API access! */
var currentTour = 0;
var loadedTourFile;

app.config(function($stateProvider, $urlRouterProvider)
{
  $stateProvider.state('index', { url: '/home', templateUrl: 'home.html', controller: indexController });
  $stateProvider.state('information', { url: '/information', templateUrl: 'information.html', controller: informationController });
  $stateProvider.state('tourSelector', { url: '/tourSelector', templateUrl: 'tourSelector.html', controller: tourSelectorController, cache: true});
  $stateProvider.state('artworkSelector', { url: '/artworkSelector', templateUrl: 'artworkSelector.html', controller: artworkSelectorController, cache: false});
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
       for(var i = 0; i < tourSelectorData.pages.length; i++)
       {
         if(tourSelectorData.pages[i].id == currentTour)
         {
           $scope.objects = tourSelectorData.pages[i].content;
         }
         else
         {
            continue;
         }
       }
     }
  }
  ajaxObject.send(null);
}

function loadTourData($file, $scope)
{
  var ajaxObject = new XMLHttpRequest();
	ajaxObject.overrideMimeType("application/json");
	ajaxObject.open('GET', $file, true);
	ajaxObject.onreadystatechange = function ()
	{
		 if (ajaxObject.readyState == 4)
		 {
			 var tourData = $.parseJSON(ajaxObject.responseText);
       $scope.objectTitle = tourData.META_TITLE;
       $scope.objects = tourData.DATA;
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

function tourSelectorController($scope, $ionicHistory, $state)
{
  /* Reload - $state.transitionTo($state.current, $state.$current.params, { reload: true, inherit: true, notify: true }); */
  loadTourSelectorData($scope);
  $scope.goBack = function()
  {
    goBack($ionicHistory);
  };
  $scope.select = function($link)
  {
    if(isNaN($link))
    {
      loadedTourFile = $link;
      $state.go("artworkSelector");
    }
  };
}

function artworkSelectorController($scope, $ionicHistory)
{
  loadTourData(loadedTourFile, $scope);
  $scope.goBack = function()
  {
    goBack($ionicHistory);
  };
}
