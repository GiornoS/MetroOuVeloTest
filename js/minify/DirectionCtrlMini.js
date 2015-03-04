function DirectionCtrl(a,b,c,d,e,f,g,h){function i(){var b,c,d;b=new google.maps.LatLng(48.85834,2.33752),c={center:b,zoom:11,panControl:!1,zoomControl:!1,mapTypeControl:!0,mapTypeControlOptions:{position:google.maps.ControlPosition.RIGHT_BOTTOM},scaleControl:!1,streetViewControl:!1,overviewMapControl:!0,rotateControl:!0,mapTypeId:google.maps.MapTypeId.ROADMAP},d=new google.maps.Map(document.getElementById("map"),c),j.setMap(d),a.map=d}a.sizeMap="big";var j,k,l;j=new google.maps.DirectionsRenderer,f.fromTemplateUrl("my-modal.html",{scope:a,animation:"slide-in-up"}).then(function(b){a.modal=b}),a.openModal=function(){a.modal.show(),h(function(){a.sizeMap="small"},400),a.map.setCenter(a.donnees_du_trajet.routes[0].legs[0].steps[0].start_location),a.map.setZoom(16),j.setPanel(document.getElementById("PanelTrajet")),k=!0},a.closeModal=function(){a.modal.hide()},a.$on("modal.hidden",function(){a.sizeMap="big"}),a.$on("$destroy",function(){google.maps.event.trigger(a.map,"resize"),a.modal.remove()}),a.reloadMap=function(){k&&(google.maps.event.trigger(a.map,"resize"),k=!1)},ionic.Platform.ready(i),a.centerOnMe=function(){a.show_donnees_du_trajet=!1,a.map&&(a.loading=c.show({template:"Recherche de la position en cours...",showBackdrop:!1}),navigator.geolocation.getCurrentPosition(function(d){a.map.setCenter(new google.maps.LatLng(d.coords.latitude,d.coords.longitude)),a.map.setZoom(15),c.hide();var e=new google.maps.LatLng(d.coords.latitude,d.coords.longitude);l?(l.setMap(null),l=new google.maps.Marker({position:e,map:a.map,title:"You are here"})):l=new google.maps.Marker({position:e,map:a.map,title:"You are here"}),b.get("http://maps.googleapis.com/maps/api/geocode/json?latlng="+d.coords.latitude+","+d.coords.longitude+"&sensor=false").success(function(b){a.address_autocomplete1=b.results[0].formatted_address,a.city_start=angular.copy(a.address_autocomplete1)}).error(function(){alert("Impossible de récupérer la géolocalisation")})},function(a){alert("Unable to get location: "+a.message),c.hide()},{timeout:15e3}))},a.showCard=function(){a.show_card_definir_un_trajet===!0?a.show_card_definir_un_trajet=!1:(a.show_card_definir_un_trajet=!0,a.setTime(),a.city_start&&(document.getElementById("city_start").value=a.city_start))};var m,n,o,p;a.setTime=function(){m=new Date,n=m.getHours(),o=m.getMinutes(),a.heure_choisie=n.toString(),a.minute_choisie=o.toString(),10>o&&(a.minute_choisie="0"+a.minute_choisie),10>n&&(a.heure_choisie="0"+a.heure_choisie),p=!1},a.setTime(),a.showTrajet=function(){a.show_card_trajet=a.show_card_trajet===!0?!1:!0},a.calculate=function(d,f,g,h){if(d&&f){document.addEventListener("deviceready",function(){function a(){"undefined"!=typeof analytics?e.trackEvent("city_end","click","Adresse Saisie"):setTimeout(function(){a()},250)}a()},!1),a.loading=c.show({template:"Calcul du trajet en cours...",showBackdrop:!1}),b.get("http://maps.googleapis.com/maps/api/geocode/json?address="+d+"&language=fr&&sensor=false").success(function(b){a.city_start=b.results[0].formatted_address}).error(function(){alert("Impossible de récupérer la géolocalisation")}),b.get("http://maps.googleapis.com/maps/api/geocode/json?address="+f+"&language=fr&&sensor=false").success(function(b){a.city_end=b.results[0].formatted_address}).error(function(){alert("Impossible de récupérer la géolocalisation")});var i,k,l,n,o,q,r,s,t;i=m.getDate().toString(),k=m.getMonth().toString(),l=m.getFullYear().toString(),p?t=Date.parse(a.datePicked):(n=h,o=g,q=k+"/"+i+"/"+l+" "+n+":"+o,t=Date.parse(q)),r={origin:d,destination:f,transitOptions:{departureTime:new Date(t)},travelMode:google.maps.DirectionsTravelMode.BICYCLING,unitSystem:google.maps.UnitSystem.METRIC},s=new google.maps.DirectionsService,s.route(r,function(b,d){d===google.maps.DirectionsStatus.OK&&(c.hide(),j.setDirections(b),a.donnees_du_trajet=b,a.show_donnees_du_trajet=!0,a.showCard())})}},a.initializeAutocomplete=function(b,c){var d,e,f,g,h,i,j;d=document.getElementById(b),e=document.getElementById(c),d&&e&&(j={componentRestrictions:{country:"fr"}},f=new google.maps.places.Autocomplete(d,j),g=new google.maps.places.Autocomplete(e,j),google.maps.event.addListener(f,"place_changed",function(){h=this.getPlace(),h.address_components&&(a.address_autocomplete1=h.address_components[0].short_name+" "+h.address_components[1].short_name+" "+h.address_components[2].short_name)}),google.maps.event.addListener(g,"place_changed",function(){i=this.getPlace(),i.address_components&&(a.address_autocomplete2=i.address_components[0].short_name+" "+i.address_components[1].short_name+" "+i.address_components[2].short_name)}))},a.initializeAutocomplete("city_start","city_end"),a.openDatePicker=function(){var b={date:new Date,mode:"time",minDate:new Date,allowOldDates:!1,allowFutureDates:!0,doneButtonLabel:"Annuler",doneButtonColor:"#F2F3F4",cancelButtonLabel:"Régler",cancelButtonColor:"#000000"};document.addEventListener("deviceready",function(){g.show(b).then(function(b){a.datePicked=b,p=!0,a.heure_choisie=a.datePicked.getHours(),a.minute_choisie=a.datePicked.getMinutes(),10>o&&(a.minute_choisie="0"+a.minute_choisie),10>n&&(a.heure_choisie="0"+a.heure_choisie)})},!1)},document.addEventListener("deviceready",function(){function a(){"undefined"!=typeof analytics?e.trackView("Définition du trajet"):setTimeout(function(){a()},250)}a()},!1)}var starter=angular.module("starter",["ionic","ngCordova"]);starter.run(function(a){a.ready(function(){window.cordova&&window.cordova.plugins.Keyboard&&cordova.plugins.Keyboard.hideKeyboardAccessoryBar(!0),window.StatusBar&&StatusBar.styleDefault()})}),starter.config(function(a){a.state("index",{url:"/",templateUrl:"index.html"}).state("Definir_un_trajet",{url:"/templates",templateUrl:"Definir_un_trajet.html"})});var carte=angular.module("carte",["ionic","ngCordova"]);DirectionCtrl.$inject=["$scope","$http","$ionicLoading","$compile","$cordovaGoogleAnalytics","$ionicModal","$cordovaDatePicker","$timeout"],carte.controller("DirectionCtrl",DirectionCtrl);