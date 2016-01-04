angular.module('helpMe.controllers', ['angularMoment','ngCordova', 'helpMe.services'])


.controller("SignUpCtrl", function(Auth, $scope, $firebaseAuth, $cordovaOauth, $ionicLoading,$ionicHistory, $state, $rootScope) {
 
    $scope.fbLogin = function() {
      $ionicLoading.show({template: 'Please Wait...'}); 
        $cordovaOauth.facebook("1654397994837760", ["email"]).then(function(result) {
            Auth.$authWithOAuthToken("facebook", result.access_token).then(function(authData) {
                // alert(JSON.stringify(authData));
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
                // alert(JSON.stringify(authData));
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

.controller('AppCtrl', function($scope, $ionicActionSheet, $ionicHistory, $firebaseObject, $rootScope) {

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
usersRef.child($rootScope.uid).child('reputation').once('value', function(snapshot) {
   if (snapshot.val() === null) {
       usersRef.child($rootScope.uid).set({ username: username_status, user_pp: user_pic_url_status, reputation: 0});
    } else {
      usersRef.child($rootScope.uid).update({ username: username_status, user_pp: user_pic_url_status});
    }
});

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
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
        ionic.Platform.exitApp()
      }
  }); 
 
     } 

})

.controller('MapCtrl', function($scope, $rootScope, $ionicPopup, Auth, $firebaseObject) {

  fb = new Firebase("https://fbchat27c.firebaseio.com/");
    $scope.list = function(){

    fbAuth = fb.getAuth();
      if(fbAuth) {
        var map_all = $firebaseObject(fb.child("timeline/"));
        map_all.$bindTo($scope, "map_all");
      }
    }

         $scope.$on('mapInitialized', function (event, map) {
         $scope.objMapa = map;
         });

         $scope.showInfoWindow = function (event, lat, lon, title, id) {
          var index = JSON.stringify(id - 1);
            var lat_new = lat + 0.01;
            var infowindow = new google.maps.InfoWindow();
            var center = new google.maps.LatLng(lat_new,lon);
            $rootScope.status_index = index;

            infowindow.setContent(
                '<div style="text-align: center;"><p>' + title + '<br>' +
                'Location: ' + lat + ',' + lon + '</p><a href="#/app/status" class="map-button" style="text-decoration: none;">Give Hand</a></div>'
                );

            infowindow.setPosition(center);
            infowindow.open($scope.objMapa);
            alert($rootScope.status_index);

         };

})

.controller('MapSingleCtrl', function($scope, $cordovaSocialSharing, $filter, $compile, $state, $firebaseObject ,$rootScope) {
  fb = new Firebase("https://fbchat27c.firebaseio.com/");
  created_status = (Date.now()).toString();
  user_pic_url_comment = $rootScope.pic_url;
  status_uid = $rootScope.uid;
  username_status = $rootScope.username;
  var position = [];
  $scope.current_pos = $rootScope.current_pos;
  $scope.directionpanel = "directionpanel";


  $scope.panelName = "petunjuk";
  $scope.end = $rootScope.single_latitude + "," + $rootScope.single_longitude;
  $scope.start = $rootScope.current_pos[0] + "," + $rootScope.current_pos[1];


    $scope.list = function(){

    fbAuth = fb.getAuth();
      if(fbAuth) {
        var timelines = $firebaseObject(fb.child("timeline/todos/" + $rootScope.status_index));
        timelines.$bindTo($scope, "status");
      }
    }
        $scope.$watchCollection('current_pos', function () {
        if ((Math.abs($rootScope.current_pos[0] - $rootScope.single_latitude) <= 0.001) && (Math.abs($rootScope.current_pos[1] - $rootScope.single_longitude) <= 0.001)) {
          alert('You have arrived at destination!');
          if($scope.status.help)
          if($scope.status.helper.indexOf($rootScope.uid) > -1){
            if($scope.status.hasOwnProperty("user_who_really_help") !== true) {
                $scope.status.user_who_really_help = [];
                $scope.status.user_who_really_help.push($rootScope.uid);
            }
          }
        } else {
            // alert('you not arrived');
        }
    });

  $scope.chat = function(){
    $state.go('app.chat');
  }

   // $scope.give_help = function(index){
   //  var index = JSON.stringify(index - 1);
   //  if($scope.status.todos[index].hasOwnProperty("helper") !== true) {
   //      $scope.status.todos[index].helper = [];
   //  }

   //  if ($scope.status.todos[index].helper.indexOf($rootScope.uid) > -1) {
   //      //In the array!
   //      $scope.status.todos[index].help_points -= 1;
   //      var index_hapus = $scope.status.todos[index].helper.indexOf($rootScope.uid);
   //      // Remove the user
   //      if (index_hapus > -1) {
   //          $scope.status.todos[index].helper.splice(index_hapus, 1);
   //      }
   //  } else {
   //      //Not in the array
   //      $scope.status.todos[index].help_points += 1;
   //      $scope.status.todos[index].helper.push($rootScope.uid);
   //  }
   // }

})

.controller('ChatCtrl', function($scope, $cordovaSocialSharing, $filter, $compile, $state, $firebaseObject ,$rootScope){
  fb = new Firebase("https://fbchat27c.firebaseio.com/");
  created_status = (Date.now()).toString();
  user_pic_url_comment = $rootScope.pic_url;
  status_uid = $rootScope.uid;
  username_status = $rootScope.username;

    $scope.list = function(){
    fbAuth = fb.getAuth();
      if(fbAuth) {
        var timelines = $firebaseObject(fb.child("timeline/todos/" + $rootScope.status_index));
        timelines.$bindTo($scope, "status");
      }
    }

  // initialize infinite scroll
  $scope.numberOfItemsToDisplay = 5;
  // $scope.timelines.todos;
  $scope.addMoreItem = function(done) {
    if ($scope.timelines.todos.length > $scope.numberOfItemsToDisplay)
      $scope.numberOfItemsToDisplay += 5; // load 20 more items
    $scope.$broadcast('scroll.infiniteScrollComplete'); // need to call this when finish loading more data
  }

    $scope.delete_comment = function(index){
      var index = JSON.stringify(index - 1);
      $scope.status.comments.splice(index, 1);      
    }

    $scope.new_comment = function(){
            if(this.txtcomment !== "") {
              if($scope.status.hasOwnProperty("chats") !== true) {
                  $scope.status.chats = [];
              }
              chat = this.txtcomment;
            if(chat == null){
               return;
            }
                user_id = $scope.status.chats.length + 1;
                $scope.status.chats.push({id: user_id,
                                        chats: chat, 
                                        date: created_status, 
                                        username: username_status, 
                                        user_pp: user_pic_url_comment,
                                        user_uid : status_uid,
                                      });
    this.txtcomment = "";
            } 
    }
})

.controller('PlaylistsCtrl', function($scope, $ionicPlatform, $cordovaSocialSharing, $filter, $cordovaCamera, $compile, $state, Auth, $firebaseObject, $firebaseArray ,$ionicPopup, $rootScope) {

  var position = [];
  $scope.current_pos = $rootScope.current_pos; 
  user_lat = '';
  user_long = '';
  user_images = '';
  status_images = '';
  $rootScope.helping_people = false;

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
    var index = JSON.stringify(index - 1);
    if($scope.timelines.todos[index].hasOwnProperty("user_who_likes") !== true) {
        $scope.timelines.todos[index].user_who_likes = [];
    }

    if ($scope.timelines.todos[index].user_who_likes.indexOf($rootScope.uid) > -1) {
        //In the array!
        $scope.timelines.todos[index].useful_points -= 1;
        var index_hapus = $scope.timelines.todos[index].user_who_likes.indexOf($rootScope.uid);
        // Remove the user
        if (index_hapus > -1) {
            $scope.timelines.todos[index].user_who_likes.splice(index_hapus, 1);
        }
    } else {
        //Not in the array
        $scope.timelines.todos[index].useful_points += 1;
        $scope.timelines.todos[index].user_who_likes.push($rootScope.uid);
    }
   }

   $scope.give_help = function(index){
    var index = JSON.stringify(index - 1);
    if($scope.timelines.todos[index].hasOwnProperty("helper") !== true) {
        $scope.timelines.todos[index].helper = [];
    }

    if ($scope.timelines.todos[index].helper.indexOf($rootScope.uid) > -1) {
        //In the array!
        $scope.timelines.todos[index].help_points -= 1;
        var index_hapus = $scope.timelines.todos[index].helper.indexOf($rootScope.uid);
        // Remove the user
        if (index_hapus > -1) {
            $scope.timelines.todos[index].helper.splice(index_hapus, 1);
        }
    } else {
        //Not in the array
        $scope.timelines.todos[index].help_points += 1;
        $scope.timelines.todos[index].helper.push($rootScope.uid);
    }
   }

    $scope.toggle = function(index){
      var index = JSON.stringify(index - 1);
      helper = [];
      user_who_help = false;
      $scope.$apply();
      if (confirm('Are you sure change the status? \n(this action can be changed again)')) {
        // Save it!
        changestatusandrep();
      } else{
        // alert('error happended');
      }      
      // alert(JSON.stringify(helper));
      // alert($scope.users.length);
      // alert(JSON.stringify($scope.timelines.todos[index]));
    function changestatusandrep(){
      if($scope.timelines.todos[index].status === false){
        $scope.timelines.todos[index].status = true;
      }
      // $scope.timelines.todos[index].status = !$scope.timelines.todos[index].status;

    // add reputation condition to user who created status
    if($scope.timelines.todos[index].status === true){
        if($scope.timelines.todos[index].user_who_really_help.indexOf($rootScope.uid)){
          user_who_help = true;
        }

        if($scope.timelines.todos[index].status){
          if(user_who_help){
            $scope.user.reputation += 1;
          } else{
            $scope.user.reputation -= 1;
          }
        }

        // Add condition to add reputation to users who help
        if($scope.timelines.todos[index].helper.length > -1){
        for(i = 0; i < $scope.timelines.todos[index].helper.length; i++){
          helper[i] = $scope.timelines.todos[index].helper[i];
        }
        // alert(JSON.stringify(helper));
        for(i = 0; i < $scope.users.length; i++){
          // alert(JSON.stringify($scope.users[i].$id));
          // alert(helper[i]);
          if($scope.users[i].$id == helper[i]){
            // alert("true");
            // $scope.users[i].reputation +=1;

            var item = $scope.users.$getRecord(helper[i]);
            // alert(JSON.stringify(item));
            item.reputation += 1;
            $scope.users.$save(item).then(function() {
              // alert("saved");
            });
          } else{
            // alert("false");
          }
        }
      }
    }   
    };

    };

   $scope.comments = function(index){
    var index = JSON.stringify(index - 1);
    alert(index);
   }

   $scope.gotolocation = function(index){
    // alert(index);
     var index = JSON.stringify(index - 1);
        if($scope.timelines.todos[index].helper.indexOf($rootScope.uid) > -1){
          $rootScope.helping_people = true;
        } else {

        }
        if($scope.timelines.todos[index].user_uid  == $rootScope.uid){
          $rootScope.helping_people = true;
        }
     $rootScope.single_latitude = $scope.timelines.todos[index].user_latitude;
     $rootScope.single_longitude = $scope.timelines.todos[index].user_longitude;
     $rootScope.status_index = index;
    $state.go('app.singlemap');
   }

   $scope.gotostatus = function(index){
    // alert(index);
     var index = JSON.stringify(index - 1);
     $rootScope.status_index = index;
    $state.go('app.status');
   }


  $scope.share_status = function(message, sender, image, date) {
    var date = $filter('amCalendar')(date)
    if(image){
      $cordovaSocialSharing.share("Help me, something happened!\n" + message + "\nInfo by: "+ sender + '\n' + date , "", 'data:image/jpeg;base64,' + image , "#Help Me!");
    } else {
      $cordovaSocialSharing.share("Help me, something happened!\n" + message + "\nInfo by: "+ sender + '\n' + date , "", null, "#Help Me!");
    }
  }

    // Create todo list
    $scope.list = function(){
    username_status = $rootScope.username;
    user_pic_url_status = $rootScope.pic_url;
    severe = '';

    fbAuth = fb.getAuth();
      if(fbAuth) {
        var timelines = $firebaseObject(fb.child("timeline/"));
        timelines.$bindTo($scope, "timelines");
        $scope.users = $firebaseArray(fb.child("users"));
        var user = $firebaseObject(fb.child("users/" + $rootScope.uid));
        user.$bindTo($scope, "user");
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
    $ionicPopup.show({
        title: 'Severity about accident',
        buttons: [
          { text: 'Simple<br>',
          type: 'button-positive',
            onTap: function(e){
              severe = "Simple";
            }
          },
          { text: 'Not too urgent<br>',
          type: 'button-energized',
            onTap: function(e){
              severe = "Not too urgent";
            }
          },
          { text: 'Urgent<br>',
            type: 'button-assertive',
            onTap: function(e){
              severe = "Urgent";
            }
          }
        ]
      }).then(function() {      
    alert(severe);
        $ionicPopup.prompt({
            title: 'Enter new situation',
            inputType: 'text'
        })
        .then(function(result) {
            if(result !== "") {
                if($scope.timelines.hasOwnProperty("todos") !== true) {
                    $scope.timelines.todos = [];
                }
            if(result == null){
               return;
            }

                created_status = (Date.now()).toString();
                user_id = $scope.timelines.todos.length + 1;
                user_lat = $scope.current_pos[0];
                user_long = $scope.current_pos[1];
                user_image = status_images;
                status_uid = $rootScope.uid;
                user_severity = severe;
                useful_point = 0;
                help_point = 0;
                done = false;


                $scope.timelines.todos.push({ id: user_id,
                                        title: result, 
                                        date: created_status, 
                                        username: username_status, 
                                        user_pp: user_pic_url_status, 
                                        user_latitude: user_lat, 
                                        user_longitude: user_long,
                                        useful_points: useful_point,
                                        user_images: user_image,
                                        status: done,
                                        severity: user_severity,
                                        help_points: help_point,
                                        user_uid : status_uid,
                                      });
            } else {
                alert("Action not completed");
            }
        });
    });
    }
} )

.controller('HelpingCtrl', function($scope, $ionicPlatform, $cordovaSocialSharing, $filter, $cordovaCamera, $compile, $state, Auth, $firebaseObject, $firebaseArray ,$ionicPopup, $rootScope) {

  var position = [];
  $scope.current_pos = $rootScope.current_pos; 
  user_lat = '';
  user_long = '';
  user_images = '';
  status_images = '';

  fb = new Firebase("https://fbchat27c.firebaseio.com/");
  username_status = $rootScope.username;
  user_pic_url_status = $rootScope.pic_url;
  var users = fb.child("users");

  // initialize infinite scroll
  $scope.numberOfItemsToDisplay = 5;
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
    var index = JSON.stringify(index - 1);
    if($scope.timelines.todos[index].hasOwnProperty("user_who_likes") !== true) {
        $scope.timelines.todos[index].user_who_likes = [];
    }

    if ($scope.timelines.todos[index].user_who_likes.indexOf($rootScope.uid) > -1) {
        //In the array!
        $scope.timelines.todos[index].useful_points -= 1;
        var index_hapus = $scope.timelines.todos[index].user_who_likes.indexOf($rootScope.uid);
        // Remove the user
        if (index_hapus > -1) {
            $scope.timelines.todos[index].user_who_likes.splice(index_hapus, 1);
        }
    } else {
        //Not in the array
        $scope.timelines.todos[index].useful_points += 1;
        $scope.timelines.todos[index].user_who_likes.push($rootScope.uid);
    }
   }

   $scope.give_help = function(index){
    var index = JSON.stringify(index - 1);
    if($scope.timelines.todos[index].hasOwnProperty("helper") !== true) {
        $scope.timelines.todos[index].helper = [];
    }

    if ($scope.timelines.todos[index].helper.indexOf($rootScope.uid) > -1) {
        //In the array!
        $scope.timelines.todos[index].help_points -= 1;
        var index_hapus = $scope.timelines.todos[index].helper.indexOf($rootScope.uid);
        // Remove the user
        if (index_hapus > -1) {
            $scope.timelines.todos[index].helper.splice(index_hapus, 1);
        }
    } else {
        //Not in the array
        $scope.timelines.todos[index].help_points += 1;
        $scope.timelines.todos[index].helper.push($rootScope.uid);
    }
   }

    $scope.toggle = function(index){
      var index = JSON.stringify(index - 1);
      helper = [];
      user_who_help = false;
      $scope.$apply();
      if (confirm('Are you sure change the status? \n(this action can be changed again)')) {
        // Save it!
        changestatusandrep();
      } else{
        // alert('error happended');
      }      
      // alert(JSON.stringify(helper));
      // alert($scope.users.length);
      // alert(JSON.stringify($scope.timelines.todos[index]));
    function changestatusandrep(){
      if($scope.timelines.todos[index].status === false){
        $scope.timelines.todos[index].status = true;
      }
      // $scope.timelines.todos[index].status = !$scope.timelines.todos[index].status;

    // add reputation condition to user who created status
    if($scope.timelines.todos[index].status === true){
        if($scope.timelines.todos[index].user_who_really_help.indexOf($rootScope.uid)){
          user_who_help = true;
        }

        if($scope.timelines.todos[index].status){
          if(user_who_help){
            $scope.user.reputation += 1;
          } else{
            $scope.user.reputation -= 1;
          }
        }

        // Add condition to add reputation to users who help
        if($scope.timelines.todos[index].helper.length > -1){
        for(i = 0; i < $scope.timelines.todos[index].helper.length; i++){
          helper[i] = $scope.timelines.todos[index].helper[i];
        }
        // alert(JSON.stringify(helper));
        for(i = 0; i < $scope.users.length; i++){
          // alert(JSON.stringify($scope.users[i].$id));
          // alert(helper[i]);
          if($scope.users[i].$id == helper[i]){
            // alert("true");
            // $scope.users[i].reputation +=1;

            var item = $scope.users.$getRecord(helper[i]);
            // alert(JSON.stringify(item));
            item.reputation += 1;
            $scope.users.$save(item).then(function() {
              // alert("saved");
            });
          } else{
            // alert("false");
          }
        }
      }
    }   
    };

    };

   $scope.comments = function(index){
    var index = JSON.stringify(index - 1);
    alert(index);
   }

   $scope.gotolocation = function(index){
    // alert(index);
     var index = JSON.stringify(index - 1);
        if($scope.timelines.todos[index].helper.indexOf($rootScope.uid) > -1){
          $rootScope.helping_people = true;
        }
        if($scope.timelines.todos[index].user_uid  == $rootScope.uid){
          $rootScope.helping_people = true;
        }
     $rootScope.single_latitude = $scope.timelines.todos[index].user_latitude;
     $rootScope.single_longitude = $scope.timelines.todos[index].user_longitude;
     $rootScope.status_index = index;
    $state.go('app.singlemap');
   }

   $scope.gotostatus = function(index){
    // alert(index);
     var index = JSON.stringify(index - 1);
     $rootScope.status_index = index;
    $state.go('app.status');
   }


  $scope.share_status = function(message, sender, image, date) {
    var date = $filter('amCalendar')(date)
    if(image){
      $cordovaSocialSharing.share("Help me, something happened!\n" + message + "\nInfo by: "+ sender + '\n' + date , "", 'data:image/jpeg;base64,' + image , "#Help Me!");
    } else {
      $cordovaSocialSharing.share("Help me, something happened!\n" + message + "\nInfo by: "+ sender + '\n' + date , "", null, "#Help Me!");
    }
  }

    // Create todo list
    $scope.list = function(){
    username_status = $rootScope.username;
    user_pic_url_status = $rootScope.pic_url;

    fbAuth = fb.getAuth();
      if(fbAuth) {
        var timelines = $firebaseObject(fb.child("timeline/"));
        timelines.$bindTo($scope, "timelines");
        $scope.users = $firebaseArray(fb.child("users"));
        var user = $firebaseObject(fb.child("users/" + $rootScope.uid));
        user.$bindTo($scope, "user");
      }
    }

} )
.controller('RequestCtrl', function($scope, $ionicPlatform, $cordovaSocialSharing, $filter, $cordovaCamera, $compile, $state, Auth, $firebaseObject, $firebaseArray ,$ionicPopup, $rootScope) {

  var position = [];
  $scope.current_pos = $rootScope.current_pos; 
  user_lat = '';
  user_long = '';
  user_images = '';
  status_images = '';

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
    var index = JSON.stringify(index - 1);
    if($scope.timelines.todos[index].hasOwnProperty("user_who_likes") !== true) {
        $scope.timelines.todos[index].user_who_likes = [];
    }

    if ($scope.timelines.todos[index].user_who_likes.indexOf($rootScope.uid) > -1) {
        //In the array!
        $scope.timelines.todos[index].useful_points -= 1;
        var index_hapus = $scope.timelines.todos[index].user_who_likes.indexOf($rootScope.uid);
        // Remove the user
        if (index_hapus > -1) {
            $scope.timelines.todos[index].user_who_likes.splice(index_hapus, 1);
        }
    } else {
        //Not in the array
        $scope.timelines.todos[index].useful_points += 1;
        $scope.timelines.todos[index].user_who_likes.push($rootScope.uid);
    }
   }

   $scope.give_help = function(index){
    var index = JSON.stringify(index - 1);
    if($scope.timelines.todos[index].hasOwnProperty("helper") !== true) {
        $scope.timelines.todos[index].helper = [];
    }

    if ($scope.timelines.todos[index].helper.indexOf($rootScope.uid) > -1) {
        //In the array!
        $scope.timelines.todos[index].help_points -= 1;
        var index_hapus = $scope.timelines.todos[index].helper.indexOf($rootScope.uid);
        // Remove the user
        if (index_hapus > -1) {
            $scope.timelines.todos[index].helper.splice(index_hapus, 1);
        }
    } else {
        //Not in the array
        $scope.timelines.todos[index].help_points += 1;
        $scope.timelines.todos[index].helper.push($rootScope.uid);
    }
   }

    $scope.toggle = function(index){
      var index = JSON.stringify(index - 1);
      helper = [];
      user_who_help = false;
      $scope.$apply();
      if (confirm('Are you sure change the status? \n(this action can be changed again)')) {
        // Save it!
        changestatusandrep();
      } else{
        // alert('error happended');
      }      
      // alert(JSON.stringify(helper));
      // alert($scope.users.length);
      // alert(JSON.stringify($scope.timelines.todos[index]));
    function changestatusandrep(){
      if($scope.timelines.todos[index].status === false){
        $scope.timelines.todos[index].status = true;
      }
      // $scope.timelines.todos[index].status = !$scope.timelines.todos[index].status;

    // add reputation condition to user who created status
    if($scope.timelines.todos[index].status === true){
        if($scope.timelines.todos[index].user_who_really_help.indexOf($rootScope.uid)){
          user_who_help = true;
        }

        if($scope.timelines.todos[index].status){
          if(user_who_help){
            $scope.user.reputation += 1;
          } else{
            $scope.user.reputation -= 1;
          }
        }

        // Add condition to add reputation to users who help
        if($scope.timelines.todos[index].helper.length > -1){
        for(i = 0; i < $scope.timelines.todos[index].helper.length; i++){
          helper[i] = $scope.timelines.todos[index].helper[i];
        }
        // alert(JSON.stringify(helper));
        for(i = 0; i < $scope.users.length; i++){
          // alert(JSON.stringify($scope.users[i].$id));
          // alert(helper[i]);
          if($scope.users[i].$id == helper[i]){
            // alert("true");
            // $scope.users[i].reputation +=1;

            var item = $scope.users.$getRecord(helper[i]);
            // alert(JSON.stringify(item));
            item.reputation += 1;
            $scope.users.$save(item).then(function() {
              // alert("saved");
            });
          } else{
            // alert("false");
          }
        }
      }
    }   
    };

    };

   $scope.comments = function(index){
    var index = JSON.stringify(index - 1);
    alert(index);
   }

   $scope.gotolocation = function(index){
    // alert(index);
     var index = JSON.stringify(index - 1);
        if($scope.timelines.todos[index].helper.indexOf($rootScope.uid) > -1){
          $rootScope.helping_people = true;
        }
        if($scope.timelines.todos[index].user_uid  == $rootScope.uid){
          $rootScope.helping_people = true;
        }
     $rootScope.single_latitude = $scope.timelines.todos[index].user_latitude;
     $rootScope.single_longitude = $scope.timelines.todos[index].user_longitude;
     $rootScope.status_index = index;
    $state.go('app.singlemap');
   }

   $scope.gotostatus = function(index){
    // alert(index);
     var index = JSON.stringify(index - 1);
     $rootScope.status_index = index;
    $state.go('app.status');
   }


  $scope.share_status = function(message, sender, image, date) {
    var date = $filter('amCalendar')(date)
    if(image){
      $cordovaSocialSharing.share("Help me, something happened!\n" + message + "\nInfo by: "+ sender + '\n' + date , "", 'data:image/jpeg;base64,' + image , "#Help Me!");
    } else {
      $cordovaSocialSharing.share("Help me, something happened!\n" + message + "\nInfo by: "+ sender + '\n' + date , "", null, "#Help Me!");
    }
  }

    // Create todo list
    $scope.list = function(){
    username_status = $rootScope.username;
    user_pic_url_status = $rootScope.pic_url;

    fbAuth = fb.getAuth();
      if(fbAuth) {
        var timelines = $firebaseObject(fb.child("timeline/"));
        timelines.$bindTo($scope, "timelines");
        $scope.users = $firebaseArray(fb.child("users"));
        var user = $firebaseObject(fb.child("users/" + $rootScope.uid));
        user.$bindTo($scope, "user");
      }
    }

} )

.controller('PanicCtrl', function($scope, $stateParams) {

})

// .controller('AchievementCtrl', function($scope,  $firebaseObject) {
//   fb = new Firebase("https://fbchat27c.firebaseio.com/");
//     $scope.list = function(){
//     fbAuth = fb.getAuth();
//       if(fbAuth) {
//         var timelines = $firebaseObject(fb.child("users/" + user_index));
//         timelines.$bindTo($scope, "user");
//       }
//     }
// })

.controller('YourProfileCtrl', function($scope, $firebaseObject ,$rootScope) {
  fb = new Firebase("https://fbchat27c.firebaseio.com/");
    $scope.list = function(){
    user_index = $rootScope.uid;
    fbAuth = fb.getAuth();
      if(fbAuth) {
        var timelines = $firebaseObject(fb.child("users/" + user_index));
        timelines.$bindTo($scope, "user");
      }
    }

})


.controller('StatusCtrl', function($scope, $cordovaSocialSharing, $filter, $compile, $state, $firebaseObject ,$rootScope) {
  fb = new Firebase("https://fbchat27c.firebaseio.com/");
  created_status = (Date.now()).toString();
  user_pic_url_comment = $rootScope.pic_url;
  status_uid = $rootScope.uid;
  username_status = $rootScope.username;
    $scope.list = function(){
    fbAuth = fb.getAuth();
      if(fbAuth) {
        var timelines = $firebaseObject(fb.child("timeline/todos/" + $rootScope.status_index));
        timelines.$bindTo($scope, "status");
      }
    }

  // show kilometer
  var position = [];
  $scope.current_pos = $rootScope.current_pos; 

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

   $scope.like = function(){
    if($scope.status.hasOwnProperty("user_who_likes") !== true) {
        $scope.status.user_who_likes = [];
    }

    if ($scope.status.user_who_likes.indexOf($rootScope.uid) > -1) {
        //In the array!
        $scope.status.useful_points -= 1;
        var index_hapus = $scope.status.user_who_likes.indexOf($rootScope.uid);
        // Remove the user
        if (index_hapus > -1) {
            $scope.status.user_who_likes.splice(index_hapus, 1);
        }
    } else {
        //Not in the array
        $scope.status.useful_points += 1;
        $scope.status.user_who_likes.push($rootScope.uid);
    }
   }

   $scope.give_help = function(){
    if($scope.status.hasOwnProperty("helper") !== true) {
        $scope.status.helper = [];
    }

    if ($scope.status.helper.indexOf($rootScope.uid) > -1) {
        //In the array!
        $scope.status.help_points -= 1;
        var index_hapus = $scope.status.helper.indexOf($rootScope.uid);
        // Remove the user
        if (index_hapus > -1) {
            $scope.status.helper.splice(index_hapus, 1);
        }
    } else {
        //Not in the array
        $scope.status.help_points += 1;
        $scope.status.helper.push($rootScope.uid);
    }
   }

    $scope.toggle = function(){
      $scope.status.status = !$scope.status.status;
    };

   $scope.gotolocation = function(index){
    alert($scope.status.helper.indexOf($rootScope.uid));
        if($scope.status.helper.indexOf($rootScope.uid) > -1){
          $rootScope.helping_people = true;
        } else {

        }
        if($scope.status.user_uid  === $rootScope.uid){
          $rootScope.helping_people = true;
        }
     $rootScope.single_latitude = $scope.status.user_latitude;
     $rootScope.single_longitude = $scope.status.user_longitude;
     if(!$rootScope.status_index){
      $rootScope.status_index = index;
    }
    $state.go('app.singlemap');
   }

  $scope.share_status = function(message, sender, image, date) {
    var date = $filter('amCalendar')(date)
    if(image){
      $cordovaSocialSharing.share("Help me, something happened!\n" + message + "\nInfo by: "+ sender + '\n' + date , "", 'data:image/jpeg;base64,' + image , "#Help Me!");
    } else {
      $cordovaSocialSharing.share("Help me, something happened!\n" + message + "\nInfo by: "+ sender + '\n' + date , "", null, "#Help Me!");
    }
  }

    $scope.delete_comment = function(index){
      var index = JSON.stringify(index - 1);
      $scope.status.comments.splice(index, 1);      
    }

    $scope.new_comment = function(){
            if(this.txtcomment !== "") {
              if($scope.status.hasOwnProperty("comments") !== true) {
                  $scope.status.comments = [];
              }
              comment = this.txtcomment;
            if(comment == null){
               return;
            }
                user_id = $scope.status.comments.length + 1;
                $scope.status.comments.push({id: user_id,
                                        comments: comment, 
                                        date: created_status, 
                                        username: username_status, 
                                        user_pp: user_pic_url_comment,
                                        user_uid : status_uid,
                                      });
    this.txtcomment = "";
            } 
    }
});