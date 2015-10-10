angular.module('helpMe.controllers', ['angularMoment','ngCordova', 'helpMe.services'])


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

.controller('MapCtrl', function($scope, $rootScope, $ionicPopup) {

  var position = [];
  $scope.current_pos = $rootScope.current_pos;
  $scope.directionpanel = "directionpanel";


  $scope.panelName = "petunjuk";
  $scope.end = "-6.3683426,106.8331007";
  $scope.start = $rootScope.current_pos[0] + "," + $rootScope.current_pos[1];


  $scope.clicked = function(){
  
   alert(JSON.stringify($scope.start));
}

})

.controller('ChatController',
           ["$scope", "messageService",
  function($scope ,  messageService) {
    $scope.user = "";
    $scope.text = "";
    $scope.messages = messageService.getAll();

    $scope.addMessage = function() {
      var user = $scope.user || "anonymous";
      if ($scope.text != "") {
        messageService.add({user: user, text: $scope.text});
      }
      
      $scope.text = "";
    };
}])

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

.controller('PlaylistsCtrl', function($scope, $cordovaSocialSharing, $cordovaCamera, $compile, Auth, $firebaseObject ,$ionicPopup, $rootScope) {

  // initialize infinite scroll
  $scope.canWeLoadMoreContent = function() {
    return ($scope.timelines.todos.length > 49) ? false : true;
  }  

  // show kilometer
  var position = [];
  $scope.current_pos = $rootScope.current_pos; 
  user_lat = '';
  user_long = '';
  user_images = '';
  status_images = '';

  // firebase initialization
  fb = new Firebase("https://fbchat27c.firebaseio.com/");
  username_status = $rootScope.username;
  user_pic_url_status = $rootScope.pic_url;

  function take_image(){
    var options = {
      quality: 75,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      targetWidth: 500,
      targetHeight: 300,
      allowEdit: true,
      correctOrientation:true,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imageData){
      status_images = imageData;
      // if(!status_images){
      //   alert('Image was not captured');
      // } else{
      //   alert('New Status :) ' + status_images);
      // }
    });     
  }

    // Show kilometer
    function deg2rad(deg) {
      return deg * (Math.PI/180)
    }
   

    $scope.getDistanceFromLatLonInKm = function(lat1,lon1,lat2,lon2) {
    var lat1 = parseFloat(lat1);
    var lon1 = parseFloat(lon1);
    var lat2 = parseFloat(lat2);
    var lon2 = parseFloat(lon2);
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return parseFloat(JSON.stringify(d)).toFixed(1);
   }

   $scope.like = function(){
     alert(($scope.timelines.todos).length);
   }

  $scope.share_status = function(message, sender) {
    $cordovaSocialSharing.share("Help me, something happened!\n" + message + "\n\nInfo by: "+ sender , "", null, "#Help Me!");
  }

    // Create todo list
    $scope.list = function(){
    fbAuth = fb.getAuth();
    if(fbAuth) {
        // var syncObject = $firebaseObject(fb.child("users/" + fbAuth.uid));
        var timelines = $firebaseObject(fb.child("timeline/"));
        var s = $firebaseObject(fb.child("timeline/"));
        timelines.$bindTo($scope, "timelines");

        var liked_status = $firebaseObject(fb.child('timeline/todos'+($scope.timelines.todos).length));
    }
    }

    $scope.create = function() {
      status_images = '';
    if (confirm('Take picture?')) {
        // Save it!
        take_image();
    } else{
      // alert('error happended');
    }      
        $ionicPopup.prompt({
            title: 'Enter new situation',
            inputType: 'text'
        })
        .then(function(result) {
            if(result !== "") {
                if($scope.timelines.hasOwnProperty("todos") !== true) {
                    $scope.timelines.todos = [];
                }
                created_status = (Date.now()).toString();
                user_lat = $scope.current_pos[0];
                user_long = $scope.current_pos[1];
                user_image = status_images;
                useful_point = 0;
                user_like= [];


                $scope.timelines.todos.push({title: result, 
                                        date: created_status, 
                                        username: username_status, 
                                        user_pp: user_pic_url_status, 
                                        user_latitude: user_lat, 
                                        user_longitude: user_long,
                                        useful_points: useful_point,
                                        user_likes: user_like,
                                        user_images: user_image
                                      });
            } else {
                alert("Action not completed");
            }
        });
    }
} )

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
