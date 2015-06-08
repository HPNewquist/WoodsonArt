var app = angular.module('WoodsonArt', ['ionic', 'ngCordova']); /* ngCordova provides PhoneGap API access! */
var currentTour = 0;
var loadedTourFile;
var storedTourSelectorData;
var storedArtworkTitle;
var storedArtworkImage;
var storedArtworkCaption;
var storedVideoData;
var storedVideoLink;

app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider)
{
  $stateProvider.state('index', { url: '/home', templateUrl: 'home.html', controller: indexController });
  $stateProvider.state('information', { url: '/information', templateUrl: 'information.html', controller: informationController });
  $stateProvider.state('information_visit', { url: '/information_visit', templateUrl: 'information_visit.html', controller: informationController });
  $stateProvider.state('information_location', { url: '/information_location', templateUrl: 'information_location.html', controller: informationLocationController });
  $stateProvider.state('information_learn', { url: '/information_learn', templateUrl: 'information_learn.html', controller: informationLearnController });
  $stateProvider.state('information_hours', { url: '/information_hours', templateUrl: 'information_hours.html', controller: informationController });
  $stateProvider.state('tourSelector', { url: '/tourSelector', templateUrl: 'tourSelector.html', controller: tourSelectorController, cache: true});
  $stateProvider.state('artworkSelectorTable', { url: '/artworkSelectorTable', templateUrl: 'artworkSelectorTable.html', controller: artworkSelectorTableController, cache: false});
  $stateProvider.state('artworkSelectorGrid', { url: '/artworkSelectorGrid', templateUrl: 'artworkSelectorGrid.html', controller: artworkSelectorGridController, cache: false});
  $stateProvider.state('artwork', { url: '/artwork', templateUrl: 'artwork.html', controller: artworkController, cache: false});
  $stateProvider.state('video', { url: '/video', templateUrl: 'video.html', controller: videoController, cache: false});
  $urlRouterProvider.otherwise('/home'); /* Redirect the app to the home page on launch. */
  $ionicConfigProvider.views.swipeBackEnabled(false);
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
           storedTourSelectorData = tourSelectorData.pages[i].content;
           $scope.objects = storedTourSelectorData;
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

function loadTourDataGallery($file, $scope)
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
       $scope.smallTitle1 = tourData.META_TITLE_SMALL_1;
       $scope.smallTitle2 = tourData.META_TITLE_SMALL_2;
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

function informationController($scope, $state, $ionicHistory)
{
  $scope.goBack = function()
  {
    goBack($ionicHistory);
  };
  $scope.goVisit = function()
  {
    $state.go("information_visit");
  }
  $scope.goHours = function()
  {
    $state.go("information_hours");
  }
  $scope.goLocation = function()
  {
    $state.go("information_location");
  }
  $scope.goLearn = function()
  {
    $state.go("information_learn");
  }
}

function informationLocationController($scope, $state, $ionicHistory)
{
  $scope.goBack = function()
  {
    goBack($ionicHistory);
  };
  if(google && google.maps)
  {
    var myLatlng = new google.maps.LatLng(44.9620, -89.6130);
    var mapOptions = { center: myLatlng, zoom: 16, mapTypeId: google.maps.MapTypeId.ROADMAP };
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    var marker = new google.maps.Marker({ position: myLatlng, map: map, title: 'Woodson Art Museum' });
  }
}

function informationLearnController($scope, $state, $ionicHistory)
{
  $scope.goBack = function()
  {
    goBack($ionicHistory);
  };
  $scope.dirWelcome = function()
  {
    storedVideoLink = "audiotour/videos/ui/DirectorsWelcome.mp4";
    storedArtworkTitle = "Director's Welcome";
    $state.go("video");
  }
  $scope.story = function()
  {
    storedVideoLink = "audiotour/videos/ui/OurStory.mp4";
    storedArtworkTitle = "Our Story";
    $state.go("video");
  }
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
      for(var i = 0; i < storedTourSelectorData.length; i++)
      {
        if(storedTourSelectorData[i].link == $link)
        {
          if(storedTourSelectorData[i].display == "table")
          {
            $state.go("artworkSelectorTable");
          }
          else if(storedTourSelectorData[i].display == "grid")
          {
            $state.go("artworkSelectorGrid");
          }
        }
        else
        {
          continue;
        }
      }
    }
  };
}

function artworkSelectorTableController($scope, $ionicHistory, $state)
{
  loadTourData(loadedTourFile, $scope);
  $scope.goBack = function()
  {
    goBack($ionicHistory);
  };
  $scope.select = function(title, image, caption, videoData)
  {
    select($scope, $state, title, image, caption, videoData);
  }
}

function artworkSelectorGridController($scope, $ionicHistory, $state)
{
  loadTourDataGallery(loadedTourFile, $scope);
  $scope.goBack = function()
  {
    goBack($ionicHistory);
  };
  $scope.select = function(title, image, caption, videoData)
  {
    select($scope, $state, title, image, caption, videoData);
  }
}

function select($scope, $state, title, image, caption, videoData)
{
  if(title === "")
  {
    console.log("blank");
  }
  else
  {
    storedArtworkTitle = title;
    storedArtworkImage = image;
    storedArtworkCaption = caption;
    storedVideoData = videoData;
    $state.go("artwork");
  }
}

function artworkController($scope, $state, $ionicHistory, $ionicModal)
{
  $scope.artworkTitle = storedArtworkTitle;
  $scope.artworkImage = storedArtworkImage;
  $scope.artworkCaption = storedArtworkCaption;
  $scope.videoData = storedVideoData;
  $scope.goBack = function()
  {
    goBack($ionicHistory);
  };
  $scope.playVideo = function($link)
  {
    storedVideoLink = $link;
    $state.go("video");
  }
}

function videoController($scope, $state, $ionicHistory)
{
  $scope.goBack = function()
  {
    goBack($ionicHistory);
  };
  $scope.link = storedVideoLink;
  $scope.videoTitle = storedArtworkTitle;
}
