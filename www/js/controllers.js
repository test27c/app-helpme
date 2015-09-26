angular.module('helpMe.controllers', [])


.controller("SignUpCtrl", function(Auth, $scope, $firebaseAuth, $cordovaOauth, $ionicLoading,$ionicHistory, $state, $rootScope) {
 
    $scope.fbLogin = function() {
      $ionicLoading.show({template: 'Please Wait...'}); 
        $cordovaOauth.facebook("1654397994837760", ["email"]).then(function(result) {
            Auth.$authWithOAuthToken("facebook", result.access_token).then(function(authData) {
                alert(JSON.stringify(authData));
                // alert("User " + authData.uid + " is logged in with " + authData.provider);
                $rootScope.username = authData.facebook.displayName;
                $rootScope.first_name = authData.facebook.cachedUserProfile.first_name;
                $rootScope.last_name = authData.facebook.cachedUserProfile.last_name;
                $rootScope.pic_url = authData.facebook.cachedUserProfile.picture.data.url;
                // alert(username);
                $ionicLoading.hide();
                $ionicHistory.nextViewOptions({
                    disableBack: true,
                    disableAnimate: true,
                    historyRoot: true
                });
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
                $state.go('app.playlists');
            }, function(error) {
                alert("ERROR: " + error);
            });
        }, function(error) {
            alert("ERROR: " + error);
            $ionicLoading.hide();
        });
    }

        $scope.googleLogin = function() { 
        $ionicLoading.show({template: 'Please Wait...'}); 
        $cordovaOauth.google("991712593344-se4bj4hk83fdhpjj4fc8dr131grqa3if.apps.googleusercontent.com", ["https://www.googleapis.com/auth/urlshortener", "https://www.googleapis.com/auth/userinfo.email"]).then(function(result) {
            Auth.$authWithOAuthToken("google", result.access_token).then(function(authData) {
                alert(JSON.stringify(authData));
                $rootScope.username = authData.google.displayName;
                $rootScope.first_name = authData.google.cachedUserProfile.given_name;
                $rootScope.last_name = authData.google.cachedUserProfile.family_name;
                $rootScope.pic_url = authData.google.cachedUserProfile.picture;

                $ionicLoading.hide();
                $ionicHistory.nextViewOptions({
                    disableBack: true,
                    disableAnimate: true,
                    historyRoot: true
                });
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
                $state.go('app.playlists');
            }, function(error) {
                alert("ERROR: " + error);
            });
        }, function(error) {
            alert(error);
            $ionicLoading.hide();
        });
    }
 
})

.controller('AppCtrl', function($scope, $ionicActionSheet) {

  $scope.logout = function(){
    $ionicActionSheet.show({
      destructiveText: 'Logout',
      titleText: 'Are you sure you want to logout?',
      cancelText: 'Cancel',
      cancel: function() {
        // add cancel code..
      },
      buttonClicked: function(index) {
        //Called when one of the non-destructive buttons is clicked,
        //with the index of the button that was clicked and the button object.
        //Return true to close the action sheet, or false to keep it opened.
        return true;
      },
      destructiveButtonClicked: function(){
        //Called when the destructive button is clicked.
        //Return true to close the action sheet, or false to keep it opened.
        ionic.Platform.exitApp()
      }
  });
 
     } 

})

.controller('MapCtrl', function($scope,$ionicPlatform, $ionicPopup, $cordovaGeolocation, $compile) {

  var position = [];
  $scope.current_pos = []; 
  $scope.directionpanel = "directionpanel";

  $scope.panelName = "petunjuk";
  $scope.start = "";
  $scope.end = "-6.3683426,106.8331007";

  navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);

  navigator.geolocation.watchPosition(function (position) {
    $scope.current_pos[0] = position.coords.latitude;
    $scope.current_pos[1] = position.coords.longitude;
    $scope.start = $scope.current_pos[0] + "," + $scope.current_pos[1];
  }, geolocationError);

   function geolocationSuccess(position) {
    $scope.current_pos.push(position.coords.latitude);
    $scope.current_pos.push(position.coords.longitude);
  }

   function geolocationError(err) {
    alert('ERROR(' + err.code + '): ' + err.message);
   }

  $scope.clicked = function(){
  
   alert(JSON.stringify($scope.start));
}

})

.controller('BrowseCtrl', function($scope, $timeout){
  $scope.title = 'List of product';
  $scope.productList = ['Samsung S4', 'Sony Experia 4Z', 'Motorolla Robo-214', 'Logitech B-125', 'Lavender'];

  $scope.doRefresh = function(){
    $timeout(function(){
      $scope.productList.push("Asus Fonepad 7 BE-3423");
      $scope.$broadcast("scroll.refreshComplete");
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
