// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova'])


.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    
    // GOOGLE ANALYTICS

/*
    $cordovaGoogleAnalytics.startTrackerWithId('UA-59584237-1');  
*/
  });
})


angular.module('carte', ['ionic', 'ngCordova'])

.controller('DirectionCtrl', function($scope, $ionicLoading, $http, $cordovaGoogleAnalytics) {
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
        $scope.show_donnees_du_trajet=false;
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
		$scope.address_autocomplete1=response.results[0].formatted_address;
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
   
   //~ Fonction permettant de calculer un trajet à une heure donnée
   $scope.calculate = function(city_start, city_end, minute_choisie, heure_choisie){
		if(city_start && city_end){
            $cordovaGoogleAnalytics.trackEvent('city_end', 'click', 'Adresse Saisie');
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
            // Distinction de cas selon que l'utilisateur a choisi une heure et une minute, ou non. Si non, on définit la minute ou l'heure choisie par l'heure ou la minute actuelle
            var mois = d.getMonth().toString();
            var jour = d.getDate().toString();
            var annee = d.getFullYear().toString();
            if (minute_choisie && heure_choisie){
                // On récupère le jour, le mois et l'année aux quels on va ajouter l'heue et la minute choisie pour le trajet, afin de convertir le tout en millisecondes depuis le 1er Janvier 1970. On enlève le "min" et le "h" pour la minute et pour l'heure choisie
                var heure_choisie_bis = heure_choisie.replace("h","");
                var minute_choisie_bis = minute_choisie.replace("min","");
            }

            else if (minute_choisie){
                var heure_choisie_bis = heure_actuelle;
                var minute_choisie_bis = minute_choisie.replace("min","");
            }
            
            else if (heure_choisie){
                var heure_choisie_bis = heure_choisie.replace("h","");
                var minute_choisie_bis = minute_actuelle;
            }
            
            else {
                var heure_choisie_bis = heure_actuelle;
                var minute_choisie_bis = minute_actuelle;
            }
            var date_complete = mois + "/" + jour + "/" + annee + " " + heure_choisie_bis + ":" + minute_choisie_bis;
            millisecondes_unix = Date.parse(date_complete);
            var request = {
				origin      : city_start,
				destination : city_end,
                transitOptions: {
                    departureTime: new Date(millisecondes_unix)
                },
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
                    $scope.show_donnees_du_trajet=true;
				}
			});
		}
	};
	
    
    //~ Fonction permettant de proposer l'autocomplétion. PB CEPENDANT : SI L'UTILISATEUR N'UTILISE PAS L'AUTOCOMPLÉTION, MARCHE PAS !!
	$scope.initializeAutocomplete = function(id1, id2) {
		var addresse_a_completer1 = document.getElementById(id1);
        var addresse_a_completer2 = document.getElementById(id2);
		if (addresse_a_completer1 && addresse_a_completer2) {
			var autocomplete1 = new google.maps.places.Autocomplete(addresse_a_completer1);
            var autocomplete2 = new google.maps.places.Autocomplete(addresse_a_completer2);
			google.maps.event.addListener(autocomplete1, 'place_changed', function() {
			  var place1 = this.getPlace();
			    if (place1.address_components) {
			      $scope.address_autocomplete1 = place1.address_components[0].short_name + ' ' + place1.address_components[1].short_name + ' ' + place1.address_components[2].short_name ;
			    };
			});
            google.maps.event.addListener(autocomplete2, 'place_changed', function() {
			  var place2 = this.getPlace();
			    if (place2.address_components) {
			      $scope.address_autocomplete2 = place2.address_components[0].short_name + ' ' + place2.address_components[1].short_name + ' ' + place2.address_components[2].short_name ;
			    };
			});
		};
	}
	
    
	$scope.initializeAutocomplete("city_start","city_end"); // On lance l'autocomplétion dès le lancement de l'application
	
    //~ Initialisations des variables servant à définir la date actuelle   
    var d=new Date();
    var heure_actuelle=d.getHours();
    var minute_actuelle=d.getMinutes();
    $scope.heure_actuelle=heure_actuelle.toString()+"h";
    $scope.minute_actuelle=minute_actuelle.toString()+"min";
    
    
    //Google Analytics
    document.addEventListener("deviceready", function () {
        function _waitForAnalytics(){
            if(typeof analytics !== 'undefined'){
                $cordovaGoogleAnalytics.trackView('Définition du trajet');
            }
            else{
                setTimeout(function(){
                    _waitForAnalytics();
                },250);
            }
        };
        _waitForAnalytics();
    }, false);
    
});

    
    
/*    //~ GOOGLE ANALYTICS
/*    document.addEventListener("deviceready", function () {
        $cordovaGoogleAnalytics.trackView('Définition du trajet');
    }, false);*/
    
    

    

angular.module('app', ['ionic','ngCordova'])



.controller('WeatherCtrl', function($scope, $http, $ionicLoading, $compile, $cordovaGoogleAnalytics, $cordovaGeolocation){
	
	var FORECASTIO_KEY = '1706cc9340ee8e2c6c2fecd7b9dc5a1c';		//~ Clé forecast pour se connecter à l'API

	//~ Fonction pour récupérer les prévisions météo à des coordonnées en se connectant à l'API forecast.io 	
	$scope.searchWeather = function(address){
		//~ On affiche un gif de loading
        $cordovaGoogleAnalytics.trackEvent('city', 'click', 'Adresse Saisie');
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









