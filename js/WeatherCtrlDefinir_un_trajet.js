/* angular.module('carte', ['ionic'])

.controller('DirectionCtrl', function($scope, $ionicLoading, $compile) {
	
	var panel;
	var initialize;
	var calculate;
	var direction;
	
	$scope.initialize = function(){
	  var paris = new google.maps.LatLng(48.85834,2.33752);
	  var myOptions = {
		zoom      : 14, // Zoom par défaut
		center    : paris, // Coordonnées de départ de la carte de type latLng 
		mapTypeId : google.maps.MapTypeId.TERRAIN, // Type de carte, différentes valeurs possible HYBRID, ROADMAP, SATELLITE, TERRAIN
		maxZoom   : 20
	  };
	  
	  map      = new google.maps.Map(document.getElementById('map'), myOptions);
	  panel    = document.getElementById('panel');
	  
	  var marker = new google.maps.Marker({
		position : paris,
		map      : map,
		title    : "Paris"
		//icon     : "marker_lille.gif" // Chemin de l'image du marqueur pour surcharger celui par défaut
	  });
	  
	 
	  
	  
	  direction = new google.maps.DirectionsRenderer({
		map   : map,
		panel : panel // Dom element pour afficher les instructions d'itinéraire
	  });

	};
	
		
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
			$scope.loading.hide();
			
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
     		$scope.loading.hide();
     	},{
     		timeout: 15000
     	});
   };
   
	$scope.calculate = function(){
		
	};
   
   $scope.initialize();
   
   
});

*/

angular.module('carte', ['ionic'])
.controller('DirectionCtrl', function($scope, $ionicLoading, $compile) {
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
			$scope.loading.hide();
			
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
     		$scope.loading.hide();
     	},{
     		timeout: 15000
     	});
   };
   
   $scope.calculate = function(city_start, city_end){
		$scope.loader_var=true;
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
					directionsDisplay.setDirections(response); // Trace l'itinéraire sur la carte et les différentes étapes du parcours
				}
			});
    }
		
		/*var url='https://maps.googleapis.com/maps/api/directions/json?origin=' + city_start + '&destination=' + city_end + '&mode=bicycling&region=fr'
		$http.get(url).success(httpSuccessCalculate).error(httpErrorCalculate);
		*/
	}
	
/*	$scope.httpSuccessCalculate = function(response){
		$scope.liste_chemin = response;
		
		var urlbis='https://maps.googleapis.com/maps/api/staticmap?size=400x400&path=weight:3%7Ccolor:blue%7Cenc:' + liste_chemin.routes[3];
		$http.get(urlbis).success(httpSuccessCalculateSuccess).error(httpErrorCalculate);
	}
	
	$scope.httpSuccessCalculateSuccess = function(response){
		$scope.chemin=response;
	}
	
	$scope.httpErrorCalculate = function(response){
		$scope.loader_var=false;
		alert("Désolé, impossible de récupérer le trajet.");
	}
*/	
	
	
});



