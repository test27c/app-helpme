angular.module('helpMe.services', [])

 .factory('Auth', function($firebaseAuth) {
  
    var endPoint = "https://fbchat27c.firebaseio.com/" ;
    var usersRef = new Firebase(endPoint);
    return $firebaseAuth(usersRef);
  })
 
.factory('GeoAlert', function() {
   console.log('GeoAlert service instantiated');
   var interval;
   var duration = 6000;
   var long, lat;
   var processing = false;
   var callback;
   var minDistance = 10;
    
   // Credit: http://stackoverflow.com/a/27943/52160   
   function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
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
    return d;
   }
  
   function deg2rad(deg) {
    return deg * (Math.PI/180)
   }
   
   function hb() {
      alert('hb running');
      if(processing) return;
      processing = true;
      navigator.geolocation.getCurrentPosition(function(position) {
        processing = false;
        alert(lat, long);
        alert(position.coords.latitude, position.coords.longitude);
        var dist = getDistanceFromLatLonInKm(lat, long, position.coords.latitude, position.coords.longitude);
        alert("dist in km is "+dist);
        if(dist <= minDistance) callback();
      });
   }
   
   return {
     begin:function(lt,lg,cb) {
       long = lg;
       lat = lt;
       callback = cb;
       interval = window.setInterval(hb, duration);
       hb();
     }, 
     end: function() {
       window.clearInterval(interval);
     },
     setTarget: function(lg,lt) {
       long = lg;
       lat = lt;
     }
   };
   
}) 

  .factory('PresenceService', ['$rootScope',
    function($rootScope) {
      var onlineUsers = 0;

      // Create our references
      var listRef = new Firebase('https://fbchat27c.firebaseio.com/presence/');
      var userRef = listRef.push(); // This creates a unique reference for each user
      var presenceRef = new Firebase('https://fbchat27c.firebaseio.com/.info/connected');

      // Add ourselves to presence list when online.
      presenceRef.on('value', function(snap) {
        if (snap.val()) {
          userRef.set(true);
          // Remove ourselves when we disconnect.
          userRef.onDisconnect().remove();
        }
      });

      // Get the user count and notify the application
      listRef.on('value', function(snap) {
        onlineUsers = snap.numChildren();
        $rootScope.$broadcast('onOnlineUser');
      });

      var getOnlineUserCount = function() {
        return onlineUsers;
      }

      return {
        getOnlineUserCount: getOnlineUserCount
      }
    }
  ]);