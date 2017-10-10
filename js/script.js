$(document).ready(function() {
    var $location = $("#weatherLocation");
    var $tempId = $("#temp-id");
    var $weatherTextId = $("#weather-text-id");
    var $tempSquareId = $("#temp-squareId");
    var $body = $("body");
    var cityIp;
    var countryIp;
    var countryIdIp;
    var weatherDescription;
    var temperatureF;
    var temperatureC;
    var weatherId;
    var weatherIconId;
    var isThisCelsius = false;
    var backgroundColors = { 2: 'url("https://static.pexels.com/photos/99577/barn-lightning-bolt-storm-99577.jpeg")',           // ThuderStorm
                             3: 'url("https://static.pexels.com/photos/219936/pexels-photo-219936.jpeg")',                      // Drizzle
                             5: 'url("https://images.pexels.com/photos/119569/pexels-photo-119569.jpeg")',                      // Rain
                             6: 'url("https://static.pexels.com/photos/163756/park-winter-russia-city-park-163756.jpeg")',      // Snow
                             8: 'url("https://images.pexels.com/photos/279315/pexels-photo-279315.jpeg")' }                     // Clear

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
                storeLocationData(response);
                showLocation(cityIp, countryIp)
                getWeather(cityIp, countryIdIp);
            }
        });
    };

    function storeLocationData(data) {
        cityIp = data.city;
        countryIp = data.country_name;
        countryIdIp = data.country_code;
    }

    function showLocation(city, country) {
        $location.html(city + ", " + country);
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

                storeWeatherData(response);
                showWeather(temperatureF);
                changeBackground(weatherId);
            }
        });
    }

    function storeWeatherData(data) {
        weatherDescription = data.weather[0].description;
        temperatureF = Math.round(data.main.temp);
        weatherId = data.weather[0].id;
        weatherIconId = data.weather[0].icon;
    }

    function celsiusToFar(temptF) {
        temperatureC = Math.round((temptF - 32) / 1.8);
        $tempId.html(temperatureC + " º C");
    };

    function showWeather(tempF) {
        $weatherTextId.html(capitalizeFirstLetter(weatherDescription));
        $tempId.html(tempF + " º F");
    };

    function changeBackground(wId) {
        var weatherCode;
        var backgroundColorsKeys
        
        weatherCode = wId.toString().slice(0, 1); //Get the weather code passed to the function and keeps the first character of the code
        backgroundColorsKeys = Object.keys(backgroundColors); //Gets all the keys from the Object with all the background images so we can easily loop trough them

        // This loop checks if the weatherCode passed is in the array of the keys of bagroundcolors object. When the weatherCode coincides with one of the keys stored in the array, 
        // we change the background property of the body to the image stored in the backgroundColors Object.
        for (var i = 0; i < backgroundColorsKeys.length; i++) {
            if (weatherCode === backgroundColorsKeys[i]) {
                $body.css("background", backgroundColors[weatherCode]);
            }
        }
    };

   //Click event on the temperature DIV so it changes from Farenheit (original temp request) to Celsius
    $tempSquareId.click(function () {
        if (isThisCelsius === false) {
            celsiusToFar(temperatureF);
        } else {
            $tempId.html(temperatureF + " º F");
        };
        isThisCelsius = !isThisCelsius;       
    });

    //function that starts the call for the location and weather
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