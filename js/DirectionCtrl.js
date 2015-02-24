var carte = angular.module('carte', ['ionic', 'ngCordova']);

function DirectionCtrl($scope, $http, $ionicLoading, $compile, $cordovaGoogleAnalytics, $ionicModal, $cordovaDatePicker) {

    
/*    $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function () {
        $scope.modal.show();
    };

    $scope.closeModal = function () {
        $scope.modal.hide();
    };

    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });*/
    
    var directionsDisplay = new google.maps.DirectionsRenderer();
    function initialize() {
        var paris, mapOptions, map;
        paris = new google.maps.LatLng(48.85834, 2.33752);
        mapOptions = {
            center: paris,
            zoom: 11,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map"), mapOptions);
        directionsDisplay.setMap(map);
        $scope.map = map;
    }

    ionic.Platform.ready(initialize);

    var marker;	//Variable pour avoir un seul marqueur
    $scope.centerOnMe = function () {
        $scope.show_donnees_du_trajet = false;
        if (!$scope.map) {
            return;
        }
        $scope.loading = $ionicLoading.show({
            template: 'Recherche de la position en cours...',
            showBackdrop: false
        });
        navigator.geolocation.getCurrentPosition(function (pos) {

            $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            $scope.map.setZoom(15);
            $ionicLoading.hide();

            var posit = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

            if (!marker) {
                marker = new google.maps.Marker({
                    position: posit,
                    map: $scope.map,
                    title: 'You are here'
                });
            } else {
                marker.setMap(null);
                marker = new google.maps.Marker({
                    position: posit,
                    map: $scope.map,
                    title: 'You are here'
                });
            }
            $http.get("http://maps.googleapis.com/maps/api/geocode/json?latlng=" + pos.coords.latitude + "," + pos.coords.longitude + "&sensor=false").success(function (response) {
                // On affiche la ville de départ dans le formulaire
                $scope.city_start = response.results[0].formatted_address;
                $scope.address_autocomplete1 = response.results[0].formatted_address;
            }).error(function (response) {
                alert("Impossible de récupérer la géolocalisation");
            });
        }, function (error) {
            alert('Unable to get location: ' + error.message);
            $ionicLoading.hide();
        }, {
            timeout: 15000
        });
    };


    //~ Fonction permettant d'affcher et de désafficher la carte de définition du trajet
    $scope.showCard = function () {
        if ($scope.show_card_definir_un_trajet === true) {
            $scope.show_card_definir_un_trajet = false;
        } else {
            $scope.show_card_definir_un_trajet = true;
        }
    };


/*     //~ Initialisations des variables servant à définir la date actuelle   
    var d, heure_actuelle, minute_actuelle;
    d = new Date();
    heure_actuelle = d.getHours();
    minute_actuelle = d.getMinutes();
    $scope.heure_actuelle = heure_actuelle.toString();
    $scope.minute_actuelle = minute_actuelle.toString();
    
    if (minute_actuelle < 10) {
        $scope.minute_actuelle = "0" + $scope.minute_actuelle;
    }
    if (heure_actuelle < 10) {
        $scope.heure_actuelle = "0" + $scope.heure_actuelle;
    }*/
    
    //~ Initialisations des variables servant à définir la date actuelle   
    var d, heure_actuelle, minute_actuelle;
    
    // Fonction qui va servir à reset l'heure à l'heure actuelle
    $scope.setTime = function () {
        d = new Date();
        heure_actuelle = d.getHours();
        minute_actuelle = d.getMinutes();
        $scope.heure_actuelle = heure_actuelle.toString();/* + "h"*/
        $scope.minute_actuelle = minute_actuelle.toString();/* + "min"*/

        if (minute_actuelle < 10) {
            $scope.minute_actuelle = "0" + $scope.minute_actuelle;
        }
        if (heure_actuelle < 10) {
            $scope.heure_actuelle = "0" + $scope.heure_actuelle;
        }
    };
    
    $scope.setTime();
    
    //~ Fonction permettant de calculer un trajet à une heure donnée
    $scope.calculate = function (city_start, city_end, minute_choisie, heure_choisie) {
        if (city_start && city_end) {
            document.addEventListener("deviceready", function () {
                function waitForAnalytics() {
                    if (typeof analytics !== 'undefined') {
                        $cordovaGoogleAnalytics.trackEvent('city_end', 'click', 'Adresse Saisie');
                    } else {
                        setTimeout(function () {
                            waitForAnalytics();
                        }, 250);
                    }
                }
                waitForAnalytics();
            }, false);
            $scope.loading = $ionicLoading.show({
                template: 'Calcul du trajet en cours...',
                showBackdrop: false
            });
            $http.get("http://maps.googleapis.com/maps/api/geocode/json?address=" + city_start + "&language=fr&&sensor=false").success(function (response) {
                $scope.city_start = response.results[0].formatted_address;
            }).error(function (response) {
                alert("Impossible de récupérer la géolocalisation");
            });
            $http.get("http://maps.googleapis.com/maps/api/geocode/json?address=" + city_end + "&language=fr&&sensor=false").success(function (response) {
                $scope.city_end = response.results[0].formatted_address;
            }).error(function (response) {
                alert("Impossible de récupérer la géolocalisation");
            });
            // Distinction de cas selon que l'utilisateur a choisi une heure et une minute, ou non. Si non, on définit la minute ou l'heure choisie par l'heure ou la minute actuelle
            var jour, mois, annee, heure_choisie_bis, minute_choisie_bis, date_complete, request, directionsService, millisecondes_unix;
            jour = d.getDate().toString();
            mois = d.getMonth().toString();
            annee = d.getFullYear().toString();
            if ($scope.datePicked) {
                // On récupère le jour, le mois et l'année aux quels on va ajouter l'heue et la minute choisie pour le trajet, afin de convertir le tout en millisecondes depuis le 1er Janvier 1970. On enlève le "min" et le "h" pour la minute et pour l'heure choisie
                millisecondes_unix = Date.parse($scope.datePicked);
            } else {
                heure_choisie_bis = heure_actuelle;
                minute_choisie_bis = minute_actuelle;
                date_complete = mois + "/" + jour + "/" + annee + " " + heure_choisie_bis + ":" + minute_choisie_bis;
                millisecondes_unix = Date.parse(date_complete);
            }

            request = {
                origin        : city_start,
                destination   : city_end,
                transitOptions: {
                    departureTime: new Date(millisecondes_unix)
                },
                travelMode    : google.maps.DirectionsTravelMode.BICYCLING, // Mode de conduite
                unitSystem    : google.maps.UnitSystem.METRIC
            };
            directionsService = new google.maps.DirectionsService(); // Service de calcul d'itinéraire*/

            directionsService.route(request, function (response, status) { // Envoie de la requête pour calculer le parcours
                if (status === google.maps.DirectionsStatus.OK) {
                    $ionicLoading.hide();
                    $scope.showCard(); //on cache la carte de défintion d'itinéraire
                    directionsDisplay.setDirections(response); // Trace l'itinéraire sur la carte et les différentes étapes du parcours
                    $scope.donnees_du_trajet = response; //permet de récupérer la durée et la distance
                    $scope.show_donnees_du_trajet = true;
                }
            });
        }
    };


    //~ Fonction permettant de proposer l'autocomplétion. PB CEPENDANT : SI L'UTILISATEUR N'UTILISE PAS L'AUTOCOMPLÉTION, MARCHE PAS !!
    $scope.initializeAutocomplete = function (id1, id2) {
        var addresse_a_completer1, addresse_a_completer2, autocomplete1, autocomplete2, place1, place2, address_autocomplete1, address_autocomplete2;
        addresse_a_completer1 = document.getElementById(id1);
        addresse_a_completer2 = document.getElementById(id2);
        if (addresse_a_completer1 && addresse_a_completer2) {
            autocomplete1 = new google.maps.places.Autocomplete(addresse_a_completer1);
            autocomplete2 = new google.maps.places.Autocomplete(addresse_a_completer2);
            google.maps.event.addListener(autocomplete1, 'place_changed', function () {
                place1 = this.getPlace();
                if (place1.address_components) {
                    $scope.address_autocomplete1 = place1.address_components[0].short_name + ' ' + place1.address_components[1].short_name + ' ' + place1.address_components[2].short_name;
                }
            });
            google.maps.event.addListener(autocomplete2, 'place_changed', function () {
                place2 = this.getPlace();
                if (place2.address_components) {
                    $scope.address_autocomplete2 = place2.address_components[0].short_name + ' ' + place2.address_components[1].short_name + ' ' + place2.address_components[2].short_name;
                }
            });
        }
    };


    $scope.initializeAutocomplete("city_start", "city_end"); // On lance l'autocomplétion dès le lancement de l'application

    $scope.openDatePicker = function () {
        var options = {
            date: new Date(),
            mode: 'time',
            minDate: new Date(),
            allowOldDates: false,
            allowFutureDates: true,
            doneButtonLabel: 'Annuler',
            doneButtonColor: '#F2F3F4',
            cancelButtonLabel: 'Régler',
            cancelButtonColor: '#000000'
        };

        document.addEventListener("deviceready", function () {
            $cordovaDatePicker.show(options).then(function (date) {
                $scope.datePicked = date;
                alert(date);
            });
        }, false);
    };
    



    //Google Analytics
    document.addEventListener("deviceready", function () {
        function waitForAnalytics() {
            if (typeof analytics !== 'undefined') {
                $cordovaGoogleAnalytics.trackView('Définition du trajet');
            } else {
                setTimeout(function () {
                    waitForAnalytics();
                }, 250);
            }
        }
        waitForAnalytics();
    }, false);

}

DirectionCtrl.$inject = ['$scope', '$http', '$ionicLoading', '$compile', '$cordovaGoogleAnalytics', '$ionicModal', '$cordovaDatePicker'];

carte.controller('DirectionCtrl', DirectionCtrl);