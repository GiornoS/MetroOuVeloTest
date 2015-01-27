angular.module('app', ['ionic'])



.controller('WeatherCtrl', function($scope, $http){
	
	
/*	$scope.searchWeather = function(){
		var FORECASTIO_KEY = '1706cc9340ee8e2c6c2fecd7b9dc5a1c';

		var url = "https://api.forecast.io/forecast/" + FORECASTIO_KEY + "/" + $scope.coordonates.results[0].geometry.location.lat + "," + $scope.coordonates.results[0].geometry.location.lng ;
		//$scope.loader_var = true;
		$http.get(url).success(httpSuccess).error(httpError);	
	}
*/

	//~ Fonction pour récupérer l'adresse à partir des coordonnées par l'API geocoding de google 

	$scope.getCoordonates = function(address){
		var urlbis="http://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&language=fr&&sensor=false";
		$http.get(urlbis).success(httpSuccessGetCoordonates).error(httpError);
	}	
	
	httpSuccessGetCoordonates = function(response){
		$scope.coordonates = response;
	}
	
	
/*	$scope.searchWeather = function(location){
		$scope.getCoordonates(location);
		
		var url = "http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + $scope.coordonates.results[0].geometry.location.lat + "&lon=" + $scope.coordonates.results[0].geometry.location.lng + "&mode=json&units=metric&cnt=10";
		//$scope.loader_var_var = true;
		$http.get(url).success(httpSuccessSearchWeather).error(httpError);
	}
*/
	
	//~ Fonction pour récupérer les prévisions météo à des coordonnées en se connectant à l'API forecast.io 
	//~ PROBLEME : IL FAUT APPUYER 2 FOIS SUR VALIDER
	
	$scope.searchWeather = function(location){
		$scope.loader_var=true;
		$scope.getCoordonates(location);			//~ On récupère les coordonnées
		
		var FORECASTIO_KEY = '1706cc9340ee8e2c6c2fecd7b9dc5a1c';		//~ Clé forecast pour se connecter à l'API

		var url = "https://api.forecast.io/forecast/" + FORECASTIO_KEY + "/" + $scope.coordonates.results[0].geometry.location.lat + "," + $scope.coordonates.results[0].geometry.location.lng + "?units=si" ;
		$http.get(url).success(httpSuccessSearchWeather).error(httpError);
	}

	httpSuccessSearchWeather = function(response){
		$scope.loader_var=false;
		$scope.weather = response;
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

	//~ Fonction de géolocalisation : récupère les coordonnées du lieu où on est.
	
	$scope.geolocate = function(){
		var FORECASTIO_KEY = '1706cc9340ee8e2c6c2fecd7b9dc5a1c';


		navigator.geolocation.getCurrentPosition(function(position){
			$scope.loader_var = true;
			$http.get("https://api.forecast.io/forecast/" + FORECASTIO_KEY + "/" + position.coords.latitude + "," + position.coords.longitude + "?units=si").success(httpSuccessGeolocate).error(httpError)
		})
	}


	
	httpSuccessGeolocate = function(response){
		$scope.loader_var = false;
		$scope.weather = response;
		navigator.geolocation.getCurrentPosition(function(position){
		$http.get("http://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude +"," + position.coords.longitude + "&sensor=false").success(httpSuccessGeolocateSuccess).error(httpError)
		})
	}
	
	httpSuccessGeolocateSuccess = function(response){
		$scope.coordonates = response;
	}


	
	httpError = function(response){
		$scope.loader_var=false;
		alert('Impossible de récupérer les informations');
	}
	
	$scope.Math = Math;		//Importation du module Math pour arrondir les températures
	//$scope.geolocate();		// On initialise la fonction de géolocalisation au lancement de l'application
	$scope.loader_var=true;
});









