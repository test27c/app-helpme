(function(){

var helpMe = angular.module('helpMe', ['ionic', 'firebase','ngCordova', 'ngCordovaOauth','ngMap', 'helpMe.controllers', 'helpMe.services', 'helpMe.directives']);
 
helpMe.run(function($ionicPlatform, $cordovaGeolocation, $rootScope, GeoAlert) {
    $ionicPlatform.ready(function() {

$ionicPlatform.registerBackButtonAction(function(e) {

  e.preventDefault();

  function showConfirm() {
    var confirmPopup = $ionicPopup.confirm({
      title: '<strong>Exit X-Wing Companion?</strong>',
      template: 'Are you sure you want to exit XWC?'
    });

    confirmPopup.then(function(res) {
      if (res) {
        ionic.Platform.exitApp();
      } else {
        // Don't close
      }
    });
  }

  // Is there a page to go back to?
  if ($rootScope.$viewHistory.backView) {
    // Go back in history
    $rootScope.$viewHistory.backView.go();
  } else {
    // This is the last page: Show confirmation popup
    showConfirm();
  }

  return false;
}, 101);



  $rootScope.current_pos = []; 

  navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);

  navigator.geolocation.watchPosition(function (position) {
    $rootScope.current_pos[0] = position.coords.latitude;
    $rootScope.current_pos[1] = position.coords.longitude;
  }, geolocationError);

   function geolocationSuccess(position) {
    $rootScope.current_pos.push(position.coords.latitude);
    $rootScope.current_pos.push(position.coords.longitude);
  }

   function geolocationError(err) {
    alert('ERROR(' + err.code + '): ' + err.message);
   }


      
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }   
    // Begin the service
    // hard coded 'target'
    var lat = -6.1797975;
    var long = 106.9934987;
    function onConfirm(idx) {
      alert('button '+idx+' pressed');
    }
    
    GeoAlert.begin(lat,long, function() {
      console.log('TARGET');
      GeoAlert.end();
      navigator.notification.confirm(
        'You are near a target!',
        onConfirm,
        'Target!',
        ['Cancel','View']
      );
      
    });
    
  });
})
 
helpMe.config(function($stateProvider, $urlRouterProvider){
  $stateProvider

  .state('signUp', {
    url: '/signUp',
    templateUrl: 'templates/sign.html',
    controller: 'SignUpCtrl'
  })

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.map', {
    url: '/map',
    views: {
      'menuContent': {
        templateUrl: 'templates/map.html',
        controller: 'MapCtrl'
      }
    }
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html',
          controller: 'BrowseCtrl'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/signUp');

});

}());