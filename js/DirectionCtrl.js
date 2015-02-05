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
		$scope.map = map;
	}
	
	ionic.Platform.ready(initialize);
	
	var marker;	//Variable pour avoir un seul marqueur
	$scope.centerOnMe = function() {
		if(!$scope.map) {
			return;
		}
		$scope.loading = $ionicLoading.show({
			template: 'Recherche de la position en cours...',
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
			$http.get("http://maps.googleapis.com/maps/api/geocode/json?latlng=" + pos.coords.latitude +"," + pos.coords.longitude + "&sensor=false").success(function(response){
		$scope.city_start=response.results[0].formatted_address;
   }).error(function(response){
	   alert("Impossible de récupérer la géolocalisation");
   })
		}, function(error) {
     		alert('Unable to get location: ' + error.message);
     		$ionicLoading.hide();
     	},{
     		timeout: 15000
     	});
   };
    
    
    //~ Fonction permettant d'affcher et de désafficher la carte de définition du trajet
   $scope.showCard = function(){
        if ($scope.show_card_definir_un_trajet==true){
            $scope.show_card_definir_un_trajet=false;
        }
        else {
            $scope.show_card_definir_un_trajet=true;
        }
   }
   
   $scope.calculate = function(city_start, city_end){
		if(city_start && city_end){
			$scope.loading = $ionicLoading.show({
				template: 'Calcul du trajet en cours...',
				showBackdrop: false
			});
		$http.get("http://maps.googleapis.com/maps/api/geocode/json?address=" + city_start + "&language=fr&&sensor=false").success(function(response){
				$scope.city_start=response.results[0].formatted_address;
		   }).error(function(response){
			   alert("Impossible de récupérer la géolocalisation");
		   });
		$http.get("http://maps.googleapis.com/maps/api/geocode/json?address=" + city_end + "&language=fr&&sensor=false").success(function(response){
				$scope.city_end=response.results[0].formatted_address;
		   }).error(function(response){
			   alert("Impossible de récupérer la géolocalisation");
		   });
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
					$scope.showCard(); //on cache la carte de défintion d'itinéraire
					directionsDisplay.setDirections(response); // Trace l'itinéraire sur la carte et les différentes étapes du parcours
					$scope.donnees_du_trajet=response; //permet de récupérer la durée et la distance
				}
			});
		}
	};
	
	$scope.initializeAutocomplete = function(id) {
		var addresse_a_completer = document.getElementById(id);
		if (addresse_a_completer) {
			var autocomplete = new google.maps.places.Autocomplete(addresse_a_completer, { types: ['geocode'] });
			google.maps.event.addListener(autocomplete);
		  }
	};
	
	$scope.initializeAutocompleteBis = function(id) {
		var addresse_a_completer = document.getElementById(id);
		if (addresse_a_completer) {
			var autocomplete = new google.maps.places.Autocomplete(addresse_a_completer, { types: ['geocode'] });
			google.maps.event.addListener(autocomplete);
		  }
	};
	
    
   /* $scope.getheightscreen = function(){
        var Hscreen=screen.height;
        alert(Hscreen);
    }
     $scope.getheightscreen();*/
	//$scope.initializeAutocomplete("city_start");
	//$scope.initializeAutocompleteBis("city_end");
	
});
