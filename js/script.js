$(document).ready(function() {
    var $location = $("#weatherLocation");
    var $tempId = $("#temp-id");
    var $weatherTextId = $("#weather-text-id");
    var cityIp;
    var countryIp;
    var countryIdIp;
    var weatherDescription;
    var temperature;
    var weatherId;
    var weatherIconId;

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function getLocationViaIp() {
        $.ajax({
            type: "GET",
            url: "https://geoip-db.com/jsonp/",
            dataType: "jsonp",
            jsonpCallback: "callback",
            crossDomain: "true",
            success: function(response)  {
                cityIp = response.city;
                countryIp = response.country_name;
                countryIdIp = response.country_code;
                showLocation()
                getWeather(cityIp, countryIdIp);
            }
        });
    };

    function showLocation() {
        $location.html(cityIp + ", " + countryIp);
    };

    function getWeather(city, countryId) {
        var openWeatherApi = "45a35cb6a70922039a1b0cbaf7670abb";
        $.ajax({
            method: "GET",
            url: "http://api.openweathermap.org/data/2.5/weather",
            dataType: "json",
            data: {
                APPID: openWeatherApi,
                q: city + "," + countryId,
                units: "imperial",
            },
            success: function(response) {
                weatherDescription = response.weather[0].description;
                temperature = Math.round(response.main.temp);
                weatherId = response.weather[0].id;
                weatherIconId = response.weather[0].icon;
                showWeather()
            }
        });
    }

    function showWeather() {
        $weatherTextId.html(capitalizeFirstLetter(weatherDescription));
        $tempId.html(temperature + " º F");
   };

   getLocationViaIp();
});


//Geolocation by HTML
    // function showPosition(position) {
    //     $location.html("Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude);
    // };
    
    // function showError(error) {
    //     switch(error.code) {
    //         case error.PERMISSION_DENIED:
    //         $location.html("User denied the request for Geolocation.");
    //         break;
    //         case error.POSITION_UNAVAILABLE:
    //         $location.html("Location information is unavailable.");
    //         break;
    //         case error.TIMEOUT:
    //         $location.html("The request to get user location timed out.");
    //         break;
    //         case error.UNKNOWN_ERROR:
    //         $location.html("An unknown error occurred.");
    //         break;
    //     }
    // }
    
    // function getLocation() {
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(showPosition, showError);
    //     } else {
    //         $location.html("Geolocation is not supported by this browser.");
    //     };
    // };