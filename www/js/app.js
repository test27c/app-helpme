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
  $rootScope.current_static_pos = [];
  $rootScope.helping_people = false;
  
  var options = { enableHighAccuracy: true };
  navigator.geolocation.watchPosition(function (position) {
    $rootScope.$apply(function() {
      $rootScope.current_pos[0] = position.coords.latitude;
      $rootScope.current_pos[1] = position.coords.longitude;
    });
  }, geolocationError, options);

  navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, options);
   function geolocationSuccess(position) {
    $rootScope.current_static_pos[0] = position.coords.latitude;
    $rootScope.current_static_pos[1] = position.coords.longitude;
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
    // var lat = $rootScope.current_pos[0];
    // var long = $rootScope.current_pos[1];
    // function onConfirm(idx) {
    //   alert('button '+idx+' pressed');
    // }
    
    // GeoAlert.begin(lat,long, function() {
    //   console.log('TARGET');
    //   GeoAlert.end();
    //   navigator.notification.confirm(
    //     'You are near a target!',
    //     onConfirm,
    //     'Target!',
    //     ['Cancel','View']
    //   );
      
    // });
    
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

  .state('app.chat', {
      url: '/chat',
      views: {
        'menuContent': {
          templateUrl: 'templates/chat.html',
          controller: 'ChatCtrl'
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

  .state('app.singlemap', {
    url: '/singlemap',
    views: {
      'menuContent': {
        templateUrl: 'templates/mapsingle.html',
        controller: 'MapSingleCtrl'
      }
    }
  })
  
  .state('app.status', {
    url: '/status',
    views: {
      'menuContent': {
        templateUrl: 'templates/status.html',
        controller: 'StatusCtrl'
      }
    }
  })
  
  .state('app.yourprofile', {
    url: '/yourprofile',
    views: {
      'menuContent': {
        templateUrl: 'templates/yourprofile.html',
        controller: 'YourProfileCtrl'
      }
    }
  })
  
  .state('app.achievement', {
    url: '/achievement',
    views: {
      'menuContent': {
        templateUrl: 'templates/achievements.html',
        controller: 'AchievementCtrl'
      }
    }
  })

  .state('app.request', {
    url: '/request',
    views: {
      'menuContent': {
        templateUrl: 'templates/request.html',
        controller: 'RequestCtrl'
      }
    }
  })

  .state('app.helping', {
    url: '/helping',
    views: {
      'menuContent': {
        templateUrl: 'templates/helping.html',
        controller: 'HelpingCtrl'
      }
    }
  })

  .state('app.panic', {
    url: '/panic',
    views: {
      'menuContent': {
        templateUrl: 'templates/panic.html',
        controller: 'PanicCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/signUp');

});

}());
