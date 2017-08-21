/**
 * Created by Neha.garg on 03-02-2015.
 */
var center_lat = 0.0,center_lng= 0.0;

// Lazy loading of Google Map API
smart_parking.service('loadGoogleMapAPI', ['$window', '$q',
    function ( $window, $q ) {
        var deferred = $q.defer();
        // Load Google map API script
        function loadScript() {
            var oldDocumentWrite = document.write;
        // change document.write temporary
            document.write = function(node){
                $("body").append(node)
            };
            var url = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&libraries=places';
            var script = document.createElement('script');
            script.src = url;
            document.getElementsByTagName("head")[0].appendChild(script);
            script.onload = script.onreadystatechange = function(){
                setTimeout(function(){
                    document.write = oldDocumentWrite;
                    $window.initMap();
                },1000)
            };
            script.onerror = function(){
                setTimeout(function() {
                    document.write = oldDocumentWrite;
                    deferred.reject()
                }, 200)
           }
        }
        // Script loaded callback, send resolve
        $window.initMap = function () {
            deferred.resolve();
        };
        loadScript();
        return deferred.promise;
}]);

smart_parking.directive('googleMap', ['$rootScope', 'loadGoogleMapAPI',
    function( $rootScope, loadGoogleMapAPI ) {
        return {
            restrict: 'C', // restrict by class name
            /*scope: {
             mapId: '@id', // map ID
             type : '@maptype'
             },*/
            link: function( $scope, elem, attrs ) {
                if(attrs['maptype'] == 'list'){
                    $scope.noMap(attrs['maptype']);
                }
                $scope.mapFlag = false;
                // Loads google map script
                loadGoogleMapAPI.then(function () {
                    // Promised resolved
                    console.log("google map promise resolved");
                    $scope.mapFlag = true;
                    $scope.initialize(attrs['maptype']);
                }, function () {
                    // Promise rejected
                    /*$scope.map_rejected = true;*/
                    console.log("google map promise rejected");
                    $scope.noMap(attrs['maptype']);
                });
            }
        };
    }]);

var createMarker = function(spot,lat,lng,$scope) {
    var image = markerIcon($scope,spot);
    if(image == null)
        return null;
    var shape = {
        coords: [1, 1, 1, 20, 18, 20, 18 , 1],
        type: 'poly'
    };
    var marker = new google.maps.Marker({
        position : new google.maps.LatLng(lat,lng),
        map : $scope.map,
        title : spot.label,
        draggable : false,
        customInfo : spot,
        icon: image
    });
   /* var marker1 = new google.maps.Marker({
        position : new google.maps.LatLng(lat,lng),
        map : $scope.map
    });
*/
    if(spot.spotType.toLowerCase() == 'noparking'){
        if(spot.state.occupied){
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    }

    google.maps.event.addListener(marker, 'mouseover', function() {
        var data = '<div style="width:auto;">'+marker.title+'</div>';
        $scope.infowindow.setContent(data);
        $scope.infowindow.open($scope.map, this);
    });

    google.maps.event.addListener(marker, 'mouseout', function() {
        $scope.infowindow.close();
    });
    return marker;
};

function markerIcon($scope,spot){
    var icon_url = '';
    if(spot.spotType.toLowerCase() == "noparking") {
        icon_url = $scope.markers_path+"/noparking_vacant.png";
        if (spot.mapped) {
            if (spot.active != undefined && spot.active) {
                if (spot.state.occupied) {
                    icon_url = $scope.markers_path+"/noparking_occupied.png"; //occupied
                }
                else
                    icon_url = $scope.markers_path+"/noparking_vacant.png"; //cyan
            }else{
                icon_url = $scope.markers_path+"/noparking_inactive.png";
            }
        }
    }else{
        if (spot.mapped) {
            if (spot.active != undefined && spot.active) {
                if (spot.state.occupied) {
                    icon_url = $scope.markers_path+"/occupied.png";
                }else {
                    icon_url = $scope.markers_path+"/vacant.png";
                }
            }else{
                icon_url = $scope.markers_path+"/inactive.png";
            }
        }
    }
    if(icon_url != ''){
        var image = {
            url: icon_url,
            size: new google.maps.Size(19,34),
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(9,34)
        };
        return image;
    }else
        return null;
}

function clearmarkers($scope){
    $scope.map.setCenter(new google.maps.LatLng(center_lat,center_lng))
    if($scope.markers == undefined)
        return;
    for ( var i = 0; i < $scope.markers.length; i++) {
        $scope.markers[i].setMap(null);
    }
}