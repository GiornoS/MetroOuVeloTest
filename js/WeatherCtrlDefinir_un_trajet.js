angular.module('app', ['ionic'])



.controller('WeatherCtrlDefinir_un_trajet', function($scope, $http){
	
	
/*	$scope.searchWeather = function(){
		var FORECASTIO_KEY = '1706cc9340ee8e2c6c2fecd7b9dc5a1c';

		var url = "https://api.forecast.io/forecast/" + FORECASTIO_KEY + "/" + $scope.coordonates.results[0].geometry.location.lat + "," + $scope.coordonates.results[0].geometry.location.lng ;
		//$scope.loader = true;
		$http.get(url).success(httpSuccess).error(httpError);	
	}
*/
	$scope.getCoordonates = function(city_start,city_end){
		var urlbis="http://maps.googleapis.com/maps/api/geocode/json?address=" + city_start + "&language=fr&&sensor=false";
		var urlter="http://maps.googleapis.com/maps/api/geocode/json?address=" + city_end + "&language=fr&&sensor=false";
		$http.get(urlbis).success(httpSuccessGetCoordonates).error(httpError);
	}	
	
	httpSuccessGetCoordonates = function(response){
		$scope.coordonates = response;
	}
	
	
/*	$scope.searchWeather = function(location){
		$scope.getCoordonates(location);
		
		var url = "http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + $scope.coordonates.results[0].geometry.location.lat + "&lon=" + $scope.coordonates.results[0].geometry.location.lng + "&mode=json&units=metric&cnt=10";
		//$scope.loader = true;
		$http.get(url).success(httpSuccessSearchWeather).error(httpError);
	}
*/
	
	$scope.searchWeather = function(city_start,city_end){
		$scope.getCoordonates(city_start,city_end);
		
		var FORECASTIO_KEY = '1706cc9340ee8e2c6c2fecd7b9dc5a1c';

		var url = "https://api.forecast.io/forecast/" + FORECASTIO_KEY + "/" + $scope.coordonates.results[0].geometry.location.lat + "," + $scope.coordonates.results[0].geometry.location.lng + "?units=si" ;
		//$scope.loader = true;
		$http.get(url).success(httpSuccessSearchWeather).error(httpError);
	}

	httpSuccessSearchWeather = function(response){
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
		//	$scope.loader = true;
			$http.get("https://api.forecast.io/forecast/" + FORECASTIO_KEY + "/" + position.coords.latitude + "," + position.coords.longitude).success(httpSuccess).error(httpError)
		})
	}
*/
	
/*	$scope.geolocate = function(){
		navigator.geolocation.getCurrentPosition(function(position){
		//	$scope.loader = true;
		$http.get("http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&mode=json&units=metric&cnt=10").success(httpSuccessGeolocate).error(httpError)
		})
	}
*/
	
	$scope.geolocate = function(){
		var FORECASTIO_KEY = '1706cc9340ee8e2c6c2fecd7b9dc5a1c';

		navigator.geolocation.getCurrentPosition(function(position){
		//	$scope.loader = true;
			$http.get("https://api.forecast.io/forecast/" + FORECASTIO_KEY + "/" + position.coords.latitude + "," + position.coords.longitude + "?units=si").success(httpSuccessGeolocate).error(httpError)
		})
	}


	
	httpSuccessGeolocate = function(response){
		//$scope.loader = false;
		$scope.weather = response;
		navigator.geolocation.getCurrentPosition(function(position){
		$http.get("http://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude +"," + position.coords.longitude + "&sensor=false").success(httpSuccessGeolocateSuccess).error(httpError)
		})
	}
	
	httpSuccessGeolocateSuccess = function(response){
		$scope.coordonates = response;
	}


	
	httpError = function(response){
		//$scope.loader=false;
		alert('Impossible de récupérer les informations');
	}
	
	$scope.Math = Math; //Importation du module Math pour arrondir les températures
	
});



