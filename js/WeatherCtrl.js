angular.module('app', ['ionic','ngCordova'])



.controller('WeatherCtrl', function($scope, $http, $ionicLoading, $compile, $cordovaGoogleAnalytics, $cordovaGeolocation){
	
	var FORECASTIO_KEY = '1706cc9340ee8e2c6c2fecd7b9dc5a1c';		//~ Clé forecast pour se connecter à l'API

	//~ Fonction pour récupérer les prévisions météo à des coordonnées en se connectant à l'API forecast.io 	
	$scope.searchWeather = function(address){
		//~ On affiche un gif de loading
		$scope.loading = $ionicLoading.show({
			template: 'Récupération des données météorologiques...',
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
	
	//~ On récupère la réponse des serveurs de forecast.io et on cache l'îcone de loading
	httpSuccessSearchWeather = function(response){
		$scope.weather = response;
		$ionicLoading.hide();
	}
    
	var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $scope.geolocate = function(){
		$scope.loading = $ionicLoading.show({
			template: 'Récupération des données météorologiques...',
            showBackdrop: false
            });
		$cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          $http.get("https://api.forecast.io/forecast/" + FORECASTIO_KEY + "/" + position.coords.latitude + "," + position.coords.longitude + "?units=si").success(httpSuccessGeolocate).error(httpError);
        }, function(err) {
          alert("Erreur : impossible de vous géolocaliser");
          $ionicLoading.hide();
        });        
    }
/*    
    httpSuccessGeolocate = function(response){
        $scope.weather=response;
        $ionicLoading.hide();
    }*/

/*
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
*/

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
        $scope.city=response.results[0].formatted_address;
		$ionicLoading.hide();
	}


	//~ En cas de problème (non connexion à internet, soucis avec les serveurs de forecast.io ou Google,...
	httpError = function(response){
		$ionicLoading.hide();
		alert('Impossible de récupérer les informations');
	}
	
	//~ Fonction permettant de suggérer des résultats au moment de l'entrée de la ville en input
	$scope.initializeAutocomplete = function(id) {
		var addresse_a_completer = document.getElementById(id);
		if (addresse_a_completer) {
			var autocomplete = new google.maps.places.Autocomplete(addresse_a_completer);
			google.maps.event.addListener(autocomplete, 'place_changed', function() {
			  var place = this.getPlace();
			    if (place.address_components) {
			      $scope.address_autocomplete = place.address_components[0].short_name + ' ' + place.address_components[1].short_name + ' ' + place.address_components[2].short_name ;
			    };
			});
		};
	}
	
    
    
	$scope.initializeAutocomplete("city"); // On initialise l'autocomplétion
	
	$scope.Math = Math;		//Importation du module Math pour arrondir les températures
    
      //~ Initialisations des variables servant à définir la date actuelle   
    var d=new Date();
    var heure_actuelle=d.getHours();
    var minute_actuelle=d.getMinutes();
    $scope.heure_actuelle=heure_actuelle.toString()+"h";
    $scope.minute_actuelle=minute_actuelle.toString()+"min";
    
    
    //~ GOOGLE ANALYTICS
/*    document.addEventListener("deviceready", function () {
        $cordovaGoogleAnalytics.trackView('Prévision météo');   
    }, false);*/
    document.addEventListener("deviceready", function () {
        function _waitForAnalytics(){
            if(typeof analytics !== 'undefined'){
                $cordovaGoogleAnalytics.startTrackerWithId('UA-59584237-1');
                $cordovaGoogleAnalytics.trackView('Prévision Météo');
            }
            else{
                setTimeout(function(){
                    _waitForAnalytics();
                },250);
            }
        };
        _waitForAnalytics();
    }, false);

    
/*  var options = {
    date: new Date(),
    mode: 'date', // or 'time'
    minDate: new Date() - 10000,
    allowOldDates: true,
    allowFutureDates: false,
    doneButtonLabel: 'DONE',
    doneButtonColor: '#F2F3F4',
    cancelButtonLabel: 'CANCEL',
    cancelButtonColor: '#000000'
  };

  document.addEventListener("deviceready", function () {

    $cordovaDatePicker.show(options).then(function(date){
    });

  }, false);*/

           
    
});









