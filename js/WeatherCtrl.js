angular.module('app', ['ionic'])



.controller('WeatherCtrl', function($scope, $http){
	
	
/*	$scope.searchWeather = function(){
		var FORECASTIO_KEY = '1706cc9340ee8e2c6c2fecd7b9dc5a1c';

		var url = "https://api.forecast.io/forecast/" + FORECASTIO_KEY + "/" + $scope.coordonates.results[0].geometry.location.lat + "," + $scope.coordonates.results[0].geometry.location.lng ;
		//$scope.loader = true;
		$http.get(url).success(httpSuccess).error(httpError);	
	}
*/
	
	$scope.searchWeather = function(){
		var url = "http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + $scope.coordonates.results[0].geometry.location.lat + "&lon=" + $scope.coordonates.results[0].geometry.location.lng + "&mode=json&units=metric&cnt=10";
		//$scope.loader = true;
		$http.get(url).success(httpSuccess).error(httpError);
	}

	
	$scope.getCoordonates = function(){
		var urlbis="http://maps.googleapis.com/maps/api/geocode/json?address=" + $scope.city + "&language=fr&&sensor=false";
		$http.get(urlbis).success(httpSuccessbis).error(httpErrorbis);
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
	
	$scope.geolocate = function(){
		navigator.geolocation.getCurrentPosition(function(position){
		//	$scope.loader = true;
			$http.get("http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&mode=json&units=metric&cnt=10").success(httpSuccess).error(httpError)
		})
	}

	
	httpSuccess = function(response){
		//$scope.loader = false;
		$scope.weather = response;
	}
	
	httpError = function(response){
		//$scope.loader=false;
		alert('Impossible de récupérer les informations');
	}
	
	httpSuccessbis = function(response){
		//$scope.loader = false;
		$scope.coordonates = response;
	}
	
	httpErrorbis = function(response){
		//$scope.loader=false;
		alert('Impossible de récupérer les informations');
	}
	
	httpSuccesster = function(response){
		//$scope.loader = false;
		$scope.weatherbis = response;
	}
	
	httpErrorter = function(response){
		//$scope.loader=false;
		alert('Impossible de récupérer les informations');
	}

	
	//$scope.geolocate();
	$scope.city="Henri Farman Thiais";	
	$scope.Math = Math; //Importation du module Math pour arrondir les températures
	$scope.getCoordonates();
});



