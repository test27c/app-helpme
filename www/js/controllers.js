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
                $rootScope.uid = authData.uid;
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
                $rootScope.uid = authData.uid;

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

.controller('AppCtrl', function($scope, $ionicActionSheet, $firebaseObject, $rootScope) {

$scope.onlineUsers = 0;

var listRef = new Firebase('https://fbchat27c.firebaseio.com/presence/');
var userRef = listRef.push();
var amOnline = new Firebase('https://fbchat27c.firebaseio.com/.info/connected');
amOnline.on('value', function(snapshot) { 
  if (snapshot.val()) {
    userRef.set(true);
    userRef.onDisconnect().remove();
  }
});

listRef.on('value', function(snap) {
  $scope.onlineUsers = snap.numChildren();
});

username_status = $rootScope.username;
user_pic_url_status = $rootScope.pic_url;


// Create users new data in database
var ref = new Firebase('https://fbchat27c.firebaseio.com');
var usersRef = ref.child("users");
usersRef.child($rootScope.uid).set({ username: username_status, user_pp: user_pic_url_status });

  // userRef.once("value", function(snapshot) {
  //   alert('test');
  //   snapshot.child($rootScope.uid).set({ username: username_status, user_pp: user_pic_url_status });
  //   if(snapshot.child($rootScope.uid).exists()){
  //     snapshot.child($rootScope.uid).update({ username: username_status, user_pp: user_pic_url_status });
  //   } else {
  //     snapshot.child($rootScope.uid).set({ username: username_status, user_pp: user_pic_url_status });
  //   }
  // });

  $scope.logout = function(){
    $ionicActionSheet.show({
      destructiveText: 'Logout',
      titleText: 'Are you sure you want to logout?',
      cancelText: 'Cancel',
      cancel: function() {
        // add cancel code..
      },
      buttonClicked: function(index) {
        return true;
      },
      destructiveButtonClicked: function(){
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

////////////////////////////////////////HOME CONTROLLER////////////////////////////////////////////////////////////

.controller('PlaylistsCtrl', function($scope, $cordovaSocialSharing, $cordovaCamera, $compile, Auth, $firebaseObject ,$ionicPopup, $rootScope) {

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
  var users = fb.child("users");

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
    });     
  }

  // initialize infinite scroll
  $scope.numberOfItemsToDisplay = 5;
  // $scope.timelines.todos;
  $scope.addMoreItem = function(done) {
    if ($scope.timelines.todos.length > $scope.numberOfItemsToDisplay)
      $scope.numberOfItemsToDisplay += 5; // load 20 more items
    $scope.$broadcast('scroll.infiniteScrollComplete'); // need to call this when finish loading more data
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

   $scope.like = function(index){
    // var testt = "test";
    var index = JSON.stringify(index - 1);
    // $scope.timelines.todos[index].useful_points += 1;
    // https://fbchat27c.firebaseio.com/timeline/todos/17/user_who_likes
    if($scope.timelines.todos[index].hasOwnProperty("user_who_likes") !== true) {
        $scope.timelines.todos[index].user_who_likes = [];
    }

    if ($scope.timelines.todos[index].user_who_likes.indexOf($rootScope.username) > -1) {
        //In the array!
        $scope.timelines.todos[index].useful_points -= 1;
        var index_hapus = $scope.timelines.todos[index].user_who_likes.indexOf($rootScope.username);
        // Remove the user
        if (index_hapus > -1) {
            $scope.timelines.todos[index].user_who_likes.splice(index_hapus, 1);
        }
        // $scope.timelines.todos[index].user_who_likes.remove($rootScope.username);
    } else {
        //Not in the array
        $scope.timelines.todos[index].useful_points += 1;
        $scope.timelines.todos[index].user_who_likes.push($rootScope.username);
    }
    // $scope.timelines.todos[index].user_who_likes.push($rootScope.username);
   }

   $scope.unlike = function(index){
    // var testt = "test";
    var index = JSON.stringify(index - 1);
    $scope.timelines.todos[index].useful_points -= 1;
    $scope.likeClicked[selectedIndex]=true;
    $scope.timelines.todos[index].user_who_likes.remove($rootScope.username);
    // $scope.timelines.todos[index].push("something");
    // $scope.timelines.todos[index].useful_points += 1;
    // alert(JSON.stringify($scope.timelines.todos[index].useful_points+1));
    // var index_ref = "timeline/todos/" + index
    // var like_status = $firebaseObject(fb.child(index_ref));
    // like_status.$bindTo($scope, "like_status");
    // alert(JSON.stringify($scope.like_status.useful_points));
    // $scope.like_status.user_who_like.push({ user_pic_url_status});
   }

  $scope.share_status = function(message, sender) {
    $cordovaSocialSharing.share("Help me, something happened!\n" + message + "\n\nInfo by: "+ sender , "", null, "#Help Me!");
  }

    // Create todo list
    $scope.list = function(){
    username_status = $rootScope.username;
    user_pic_url_status = $rootScope.pic_url;

    fbAuth = fb.getAuth();
      if(fbAuth) {
        var timelines = $firebaseObject(fb.child("timeline/"));
        timelines.$bindTo($scope, "timelines");
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
                user_id = $scope.timelines.todos.length + 1;
                user_lat = $scope.current_pos[0];
                user_long = $scope.current_pos[1];
                user_image = status_images;
                useful_point = 0;


                $scope.timelines.todos.push({ id: user_id,
                                        title: result, 
                                        date: created_status, 
                                        username: username_status, 
                                        user_pp: user_pic_url_status, 
                                        user_latitude: user_lat, 
                                        user_longitude: user_long,
                                        useful_points: useful_point,
                                        user_images: user_image,
                                      });
            } else {
                alert("Action not completed");
            }
        });
    }
} )

.controller('PlaylistCtrl', function($scope, $stateParams) {
});