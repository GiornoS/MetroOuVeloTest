function DirectionCtrl(a,b,c,d,e,f,g,h){function i(){c.hide(),alert("Impossible de récupérer les informations. Veuillez vérifier votre connexion internet.")}function j(){var b,c,d;b=new google.maps.LatLng(48.85834,2.33752),c={center:b,zoom:11,panControl:!1,zoomControl:!1,mapTypeControl:!0,mapTypeControlOptions:{position:google.maps.ControlPosition.RIGHT_BOTTOM},scaleControl:!1,streetViewControl:!1,overviewMapControl:!0,rotateControl:!0,mapTypeId:google.maps.MapTypeId.ROADMAP},d=new google.maps.Map(document.getElementById("map"),c),p.setMap(d),a.map=d}var k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H;l="1706cc9340ee8e2c6c2fecd7b9dc5a1c",p=new google.maps.DirectionsRenderer,x="res/img/velib.png",s=[],t=[],w="a23a36fd28a2875bf3183ae15335cc8120992f52",H=0,a.sizeMap="big",a.searchWeather=function(d){a.loading=c.show({template:"Récupération des données météorologiques...",showBackdrop:!1}),n=k.getMonth()<10?"0"+k.getMonth():k.getMonth(),o=k.getDate()<10?"0"+k.getDate():k.getDate();var e,f;e=k.getFullYear()+"-"+n+"-"+o+"T"+a.heure_choisie+":00:00",f="https://api.forecast.io/forecast/"+l+"/"+d.lat()+","+d.lng()+","+e+"?units=si",b.get(f).success(function(b){a.weather=b,a.show_card_recommandation=!0,a.recommandation="rain"===b.hourly.data[0].icon?"Prenez donc le MÉTRO !":"Prenez donc le VÉLO !",c.hide()}).error(i)},f.fromTemplateUrl("my-modal.html",{scope:a,animation:"slide-in-up"}).then(function(b){a.modal=b}),a.openModal=function(){a.modal.show(),a.show_card_recommandation=!1,h(function(){a.sizeMap="small"},400),a.map.setCenter(a.donnees_du_trajet.routes[0].legs[0].steps[0].start_location),a.map.setZoom(16),p.setPanel(document.getElementById("PanelTrajet")),q=!0},a.closeModal=function(){a.modal.hide()},a.$on("modal.hidden",function(){a.sizeMap="big",a.show_card_recommandation=!0}),a.$on("$destroy",function(){google.maps.event.trigger(a.map,"resize"),a.modal.remove()}),a.reloadMap=function(){q&&(google.maps.event.trigger(a.map,"resize"),q=!1)},a.loadMarkers=function(){a.loading=c.show({template:"Mise à jour des stations vélibs...",showBackdrop:!1}),b.get("https://api.jcdecaux.com/vls/v1/stations?contract=Paris&apiKey="+w).success(function(b){for(C=[{textSize:1,textColor:"white",url:"res/markers_clusters/VelibGrey.png",height:50,width:50,anchorText:[3,1]}],D=[{textSize:1,textColor:"white",url:"res/markers_clusters/VelibPurple.png",height:50,width:50,anchorText:[3,1]}],B={minimumClusterSize:4,gridSize:90,styles:C},A={minimumClusterSize:4,gridSize:90,styles:D},y=new MarkerClusterer(a.map,s,B),z=new MarkerClusterer(a.map,t,A),v=0;v<b.length;v+=1){u=new google.maps.LatLng(b[v].position.lat,b[v].position.lng);var d,e;d=new google.maps.Marker(b[v].available_bike_stands<4?{position:u,icon:"http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld="+b[v].available_bike_stands+"|ff0000|ffffff",clickable:!0}:{position:u,icon:"http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld="+b[v].available_bike_stands+"|a99faa|ffffff",clickable:!0}),e=new google.maps.Marker(b[v].available_bikes<4?{position:u,icon:"http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld="+b[v].available_bikes+"|ff0000|ffffff",clickable:!0}:{position:u,icon:"http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld="+b[v].available_bikes+"|be65c6|ffffff",clickable:!0}),google.maps.event.addListener(d,"click",function(b){a.map.panTo(b.latLng)}),google.maps.event.addListener(e,"click",function(b){a.map.panTo(b.latLng)}),s.push(d),t.push(e)}c.hide()}).error(function(){b.get("res/data/Paris.json").success(function(b){for(v=0;v<b.length;v+=1){u=new google.maps.LatLng(b[v].latitude,b[v].longitude);var d=new google.maps.Marker({position:u,icon:x,clickable:!0});google.maps.event.addListener(d,"click",function(b){a.map.panTo(b.latLng)}),s.push(d),t.push(d)}c.hide()})})},a.loadMarkers(),ionic.Platform.ready(j),a.centerOnMe=function(){a.show_donnees_du_trajet=!1,a.show_card_recommandation=!1,a.map&&(a.loading=c.show({template:"Recherche de la position en cours...",showBackdrop:!1}),navigator.geolocation.getCurrentPosition(function(d){a.map.setCenter(new google.maps.LatLng(d.coords.latitude,d.coords.longitude)),a.map.setZoom(15),c.hide();var e=new google.maps.LatLng(d.coords.latitude,d.coords.longitude);r?(r.setMap(null),r=new google.maps.Marker({position:e,map:a.map,title:"You are here"})):r=new google.maps.Marker({position:e,map:a.map,title:"You are here"}),b.get("http://maps.googleapis.com/maps/api/geocode/json?latlng="+d.coords.latitude+","+d.coords.longitude+"&sensor=false").success(function(b){a.address_autocomplete1=b.results[0].formatted_address,a.city_start=b.results[0].formatted_address}).error(function(){alert("Impossible de récupérer la géolocalisation")})},function(a){alert("Unable to get location: "+a.message),c.hide()},{timeout:15e3}))},a.showCard=function(){a.show_card_definir_un_trajet===!0?a.show_card_definir_un_trajet=!1:(a.show_card_definir_un_trajet=!0,a.show_card_recommandation=!1,a.setTime(),a.city_start&&(document.getElementById("city_start").value=a.city_start))},a.setTime=function(){k=new Date,E=k.getHours(),F=k.getMinutes(),a.heure_choisie=E.toString(),a.minute_choisie=F.toString(),10>F&&(a.minute_choisie="0"+a.minute_choisie),10>E&&(a.heure_choisie="0"+a.heure_choisie),G=!1},a.setTime(),a.showTrajet=function(){a.show_card_trajet=a.show_card_trajet===!0?!1:!0},a.calculate=function(d,f,g,i){a.donneesVelibPlusProchechargees=!1;var j,l;if(a.address_autocomplete1!==a.city_start&&(a.address_autocomplete1=null),a.address_autocomplete1?j=a.address_autocomplete1:(j=d.address_components[0].short_name+" "+d.address_components[1].short_name+" "+d.address_components[2].short_name,a.city_start=d.formatted_address),j&&f){document.addEventListener("deviceready",function(){function a(){"undefined"!=typeof analytics?e.trackEvent("city_end","click","Adresse Saisie"):setTimeout(function(){a()},250)}a()},!1),a.loading=c.show({template:"Calcul du trajet en cours...",showBackdrop:!1}),l=f.address_components[0].short_name+" "+f.address_components[1].short_name+" "+f.address_components[2].short_name,b.get("http://maps.googleapis.com/maps/api/geocode/json?address="+j+"&language=fr&&sensor=false").success(function(b){a.city_startLatLng=b.results[0].formatted_address}).error(function(){alert("Impossible de récupérer la géolocalisation")}),b.get("http://maps.googleapis.com/maps/api/geocode/json?address="+l+"&language=fr&&sensor=false").success(function(b){a.city_end=b.results[0].formatted_address}).error(function(){alert("Impossible de récupérer la géolocalisation")});var n,o,q,r,s,t,u,v;n=k.getDate().toString(),o=k.getMonth().toString(),q=k.getFullYear().toString(),G?m=Date.parse(a.datePicked):(r=i,s=g,t=o+"/"+n+"/"+q+" "+r+":"+s,m=Date.parse(t)),u={origin:j,destination:l,transitOptions:{departureTime:new Date(m)},travelMode:google.maps.DirectionsTravelMode.BICYCLING,unitSystem:google.maps.UnitSystem.METRIC},v=new google.maps.DirectionsService,v.route(u,function(b,d){d===google.maps.DirectionsStatus.OK&&(p.setDirections(b),a.donnees_du_trajet=b,a.show_donnees_du_trajet=!0,a.showCard(),a.stationVelibPlusProche(b.routes[0].legs[0].end_location),h(function(){c.hide(),a.searchWeather(b.routes[0].legs[0].end_location)},1e3))})}},a.openDatePicker=function(){var b={date:new Date,mode:"time",minDate:new Date,allowOldDates:!1,allowFutureDates:!0,doneButtonLabel:"Annuler",doneButtonColor:"#F2F3F4",cancelButtonLabel:"Régler",cancelButtonColor:"#000000"};document.addEventListener("deviceready",function(){g.show(b).then(function(b){a.datePicked=b,G=!0,a.heure_choisie=a.datePicked.getHours(),a.minute_choisie=a.datePicked.getMinutes(),10>F&&(a.minute_choisie="0"+a.minute_choisie),10>E&&(a.heure_choisie="0"+a.heure_choisie)})},!1)},a.displayVelibStations=function(){0===H?(z.addMarkers(t),H=1):1===H?(z.clearMarkers(),y.addMarkers(s),H=2):(y.clearMarkers(),H=0)},a.stationVelibPlusProche=function(b){var c,d,e,f,g,h,i;for(d=t[0],f=new google.maps.LatLng(t[0].position.lat(),t[0].position.lng()),c=google.maps.geometry.spherical.computeDistanceBetween(b,f),v=1;v<t.length;v+=1)f=new google.maps.LatLng(t[v].position.lat(),t[v].position.lng()),e=google.maps.geometry.spherical.computeDistanceBetween(b,f),c>e&&(c=e,d=t[v]);i=new google.maps.LatLng(d.position.lat(),d.position.lng()),g={origin:i,destination:b,travelMode:google.maps.DirectionsTravelMode.WALKING,unitSystem:google.maps.UnitSystem.METRIC},h=new google.maps.DirectionsService,h.route(g,function(b){a.donneesVelibPlusProche=b.routes[0].legs[0],a.donneesVelibPlusProchechargees=!0})},document.addEventListener("deviceready",function(){function a(){"undefined"!=typeof analytics?(e.startTrackerWithId("UA-59584237-1"),e.trackView("Définir un trajet")):setTimeout(function(){a()},250)}a()},!1)}var starter=angular.module("starter",["ionic","ngCordova"]);starter.run(function(a){a.ready(function(){window.cordova&&window.cordova.plugins.Keyboard&&cordova.plugins.Keyboard.hideKeyboardAccessoryBar(!0),window.StatusBar&&StatusBar.styleDefault()})});var carte=angular.module("carte",["ionic","ngCordova","google.places"]);DirectionCtrl.$inject=["$scope","$http","$ionicLoading","$compile","$cordovaGoogleAnalytics","$ionicModal","$cordovaDatePicker","$timeout"],carte.controller("DirectionCtrl",DirectionCtrl);