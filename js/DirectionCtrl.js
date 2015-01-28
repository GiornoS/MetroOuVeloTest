angular.module('carte', ['ionic'])

.controller('DirectionCtrl', function($scope, $ionicLoading, $http) {
	var directionsDisplay = new google.maps.DirectionsRenderer();
	function initialize() {
		var paris = new google.maps.LatLng(48.85834,2.33752);
		var mapOptions = {
			center: paris,
			zoom: 11,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		var map = new google.maps.Map(document.getElementById("map"), mapOptions);
		directionsDisplay.setMap(map);

	}
	
	ionic.Platform.ready(initialize);
	
	var marker;	//Variable pour avoir un seul marqueur
	$scope.centerOnMe = function() {
		if(!$scope.map) {
			return;
		}
		$scope.loading = $ionicLoading.show({
			content: 'Getting current location...',
			showBackdrop: false
		});
		navigator.geolocation.getCurrentPosition(function(pos) {
			
			$scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
			$scope.map.setZoom(15);
			$ionicLoading.hide();
			
			var posit = new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
			
			if (!marker){
				marker = new google.maps.Marker({
					position: posit,
					map: $scope.map,
					title: 'You are here'
				});
			}else{
				marker.setMap(null);
				marker = new google.maps.Marker({
					position: posit,
    	     		map: $scope.map,
    	     		title: 'You are here'
    	     	});
  	     	}
		}, function(error) {
     		alert('Unable to get location: ' + error.message);
     		$ionicLoading.hide();
     	},{
     		timeout: 15000
     	});
   };
   
   $scope.calculate = function(city_start, city_end){
		$scope.loading = $ionicLoading.show({
			content: 'Calcul du trajet en cours...',
			showBackdrop: false
		});
		if(city_start && city_end){
			var request = {
				origin      : city_start,
				destination : city_end,
				travelMode  : google.maps.DirectionsTravelMode.BICYCLING, // Mode de conduite
				unitSystem: google.maps.UnitSystem.METRIC
			}
			var directionsService = new google.maps.DirectionsService(); // Service de calcul d'itinéraire
			directionsService.route(request, function(response, status){ // Envoie de la requête pour calculer le parcours
				if(status == google.maps.DirectionsStatus.OK){
					$ionicLoading.hide();
					directionsDisplay.setDirections(response); // Trace l'itinéraire sur la carte et les différentes étapes du parcours
				}
			});
		}
	}	
	
});
