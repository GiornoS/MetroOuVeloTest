angular.module('app', ['ionic'])



.controller('WeatherCtrl', function($scope, $http, $ionicLoading, $compile){
	
	var FORECASTIO_KEY = '1706cc9340ee8e2c6c2fecd7b9dc5a1c';		//~ Clé forecast pour se connecter à l'API
	
/*	$scope.searchWeather = function(){
		var FORECASTIO_KEY = '1706cc9340ee8e2c6c2fecd7b9dc5a1c';

		var url = "https://api.forecast.io/forecast/" + FORECASTIO_KEY + "/" + $scope.coordonates.results[0].geometry.location.lat + "," + $scope.coordonates.results[0].geometry.location.lng ;
		//$scope.loader_var = true;
		$http.get(url).success(httpSuccess).error(httpError);	
	}
*/

	//~ Fonction pour récupérer les prévisions météo à des coordonnées en se connectant à l'API forecast.io 	
	$scope.searchWeather = function(address){
		//alert(address);
		//~ On affiche un gif de loading
		$scope.loading = $ionicLoading.show({
			template: 'Récupération des informations météorologiques...',
			showBackdrop: false
		});
		//~ On récupère les coordonnées
		var urlbis="http://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&language=fr&&sensor=false";
		$http.get(urlbis).success(httpSuccessGetCoordonates).error(httpError);
	}	
	
	//~ On envoie une requête aux serveurs de forecast.io pour qu'ils nous renvoient la météo aux coordonnées récupérées
	httpSuccessGetCoordonates = function(response){
		$scope.coordonates = response;
		var url = "https://api.forecast.io/forecast/" + FORECASTIO_KEY + "/" + $scope.coordonates.results[0].geometry.location.lat + "," + $scope.coordonates.results[0].geometry.location.lng + "?units=si" ;
		$http.get(url).success(httpSuccessSearchWeather).error(httpError);
	}
	
	
/*	$scope.searchWeather = function(location){
		$scope.getCoordonates(location);
		
		var url = "http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + $scope.coordonates.results[0].geometry.location.lat + "&lon=" + $scope.coordonates.results[0].geometry.location.lng + "&mode=json&units=metric&cnt=10";
		//$scope.loader_var_var = true;
		$http.get(url).success(httpSuccessSearchWeather).error(httpError);
	}
*/
	
	//~ On récupère la réponse des serveurs de forecast.io et on cache l'îcone de loading
	httpSuccessSearchWeather = function(response){
		$scope.weather = response;
		$ionicLoading.hide();
	}
	
	
	
/*	$scope.expand = function(e){
		$elem = $(e.currentTarget); //ATTENTION JQUERY !!!!!
		$elem.addClass('row_active').siblings().removeClass('row_active');
	}
*/
	
/*	$scope.geolocate = function(){
		var FORECASTIO_KEY = '1706cc9340ee8e2c6c2fecd7b9dc5a1c';

		navigator.geolocation.getCurrentPosition(function(position){
		//	$scope.loader_var = true;
			$http.get("https://api.forecast.io/forecast/" + FORECASTIO_KEY + "/" + position.coords.latitude + "," + position.coords.longitude).success(httpSuccess).error(httpError)
		})
	}
*/
	
/*	$scope.geolocate = function(){
		navigator.geolocation.getCurrentPosition(function(position){
		//	$scope.loader_var = true;
		$http.get("http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&mode=json&units=metric&cnt=10").success(httpSuccessGeolocate).error(httpError)
		})
	}
*/

	//~ Fonction de géolocalisation : récupère les coordonnées du lieu où on est et envoie une requête aux serveurs forecast.io pour connaître la météo à ces coordonnées.
	$scope.geolocate = function(){
		navigator.geolocation.getCurrentPosition(function(position){
			$scope.loading = $ionicLoading.show({
				template: 'Récupération des données météorologiques...',
				showBackdrop: false
			});
			$http.get("https://api.forecast.io/forecast/" + FORECASTIO_KEY + "/" + position.coords.latitude + "," + position.coords.longitude + "?units=si").success(httpSuccessGeolocate).error(httpError)
		})
	}


	//~ On récupère les coordonnées dans une variable à part pour pouvoir afficher l'adresse du lieu où l'on est
	httpSuccessGeolocate = function(response){
		$scope.weather = response;
		navigator.geolocation.getCurrentPosition(function(position){
		$http.get("http://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude +"," + position.coords.longitude + "&sensor=false").success(httpSuccessGeolocateSuccess).error(httpError)
		})
	}
	
	//~ On récupère l'adresse fournie par les serveurs de Google 
	httpSuccessGeolocateSuccess = function(response){
		$scope.coordonates = response;
		$ionicLoading.hide();
	}


	//~ En cas de problème (non connexion à internet, soucis avec les serveurs de forecast.io ou Google,...
	httpError = function(response){
		$ionicLoading.hide();
		alert('Impossible de récupérer les informations');
	}
	
	//~ Fonction permettant de suggérer des résultats au moment de l'entrée de la ville en input
	/*$scope.initializeAutocomplete = function(id) {
		var addresse_a_completer = document.getElementById(id);
		if (addresse_a_completer) {
			var autocomplete = new google.maps.places.Autocomplete(addresse_a_completer);
			google.maps.event.addListener(autocomplete, 'place_changed', function() {
			  var place = this.getPlace();
		
			    if (place.address_components) {
			      var address = place.address_components[0].short_name + ' ' + place.address_components[1].short_name + ' ' + place.address_components[2].short_name ;
			    };
			});
		};
	}*/
	
	//$scope.initializeAutocomplete("city"); // On initialise l'autocomplétion
	
	$scope.Math = Math;		//Importation du module Math pour arrondir les températures
	$scope.geolocate();		// On initialise la fonction de géolocalisation au lancement de l'application
});









