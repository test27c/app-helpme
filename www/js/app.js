(function(){

var helpMe = angular.module('helpMe', ['ionic', 'firebase','ngCordova', 'ngCordovaOauth','ngMap', 'helpMe.controllers', 'helpMe.services', 'helpMe.directives']);
 
helpMe.run(function($ionicPlatform, GeoAlert) {
    $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }   //Begin the service
    //hard coded 'target'
    // var lat = 30.224090;
    // var long = -92.019843;
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