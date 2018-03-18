$(document).ready(function() {
    var $tempId = $("#temp-id");
    var $tempSquareId = $("#temp-squareId");
    var $weatherIcon = $("#weatherIcon");
    var $dataToggletTooltip = $('[data-toggle="tooltip"]')
    var weatherDescription;
    var temperatureF;
    var isThisCelsius = false;

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function getLocationViaIp() {
        $.ajax({
            type: "GET",
            url: "https://ipinfo.io/json",
            dataType: "json",
            //jsonpCallback: "callback",
            crossDomain: "true",
            success: function(response)  {
                var cityIp = response.city;
                var countryIp = response.region;
                var countryIdIp = response.country;
                showLocation(cityIp, countryIp, countryIdIp);
                getWeather(cityIp, countryIdIp);
            },
            error: function(response) {
                alert("Opps something is not working with the IP API...")
            }
        });
    };

    function showLocation(city, country, countryID) {
        var $location = $("#weatherLocation");
        switch (true) {
            case city === null && country === null:
                $location.html("<i>We got some problems locating your IP, try again later</i>");
                break;
            case city === null || city === undefined || city === "":
                $location.html("<i>We got some problems locating your IP, try again later</i>");
                break;
            case country === null || country === undefined || country === "":
                $location.html("<i>We got some problems locating your IP, try again later</i>");
                break;
            default:
            $location.html(city + ", " + country + ", " + countryID);
        }
    };

    function getWeather(city, countryId) {
        var openWeatherApi = "45a35cb6a70922039a1b0cbaf7670abb";
        $.ajax({
            method: "GET",
            url: "https://api.openweathermap.org/data/2.5/weather",
            dataType: "json",
            data: {
                APPID: openWeatherApi,
                q: city + "," + countryId,
                units: "imperial",
            },
            success: function(response) {
                weatherDescription = response.weather[0].description;
                temperatureF = Math.round(response.main.temp);
                var weatherId = response.weather[0].id;
                var weatherIconId = response.weather[0].icon;
                showWeather(temperatureF);
                changeBackground(weatherId);
                changeWeatherIcon(weatherIconId);
            }
        });
    }

    function showWeather(tempF) {
        var $weatherTextId = $("#weather-text-id");
        $weatherTextId.html(capitalizeFirstLetter(weatherDescription));
        $tempId.html(tempF + " º F");
    };
    
    function changeBackground(weathId) {
        var $body = $("body");
        var backgroundImages = { 
            2: 'url("img/bkThunderStorm.jpeg")',             // ThuderStorm Background
            3: 'url("img/bkDrizzle.jpeg")',                  // Drizzle Background
            5: 'url("img/bkRain.jpeg")',                      // Rain Background
            6: 'url("img/bkSnow.jpeg")',                     // Snow Background
            7: 'url("img/bkHazze.jpeg")',                    // Hazze Background
            8: 'url("img/bkCloudy.jpeg")',                   // Cloudy Background
            0: 'url("img/bkSunny.jpeg")'                     // Clear Background
            }                              
        var weatherCode;
        var backgroundColorsKeys
        
        function searchBackground() {
           weatherCode = weathId.toString().slice(0, 1); //Get the weather code passed to the function and keeps the first character of the code
            backgroundColorsKeys = Object.keys(backgroundImages); //Gets all the keys from the Object with all the background images so we can easily loop trough them
            
            // This loop checks if the weatherCode passed is in the array of the keys of bagroundcolors object. When the weatherCode coincides with one of the keys stored in the array, 
            // we change the background property of the body to the image stored in the backgroundImages Object.
            for (var i = 0; i < backgroundColorsKeys.length; i++) {
                if (weatherCode === backgroundColorsKeys[i]) {
                    $body.css("background", backgroundImages[weatherCode]);
                }
            } 
        }

        //Special case for the sunny weather. The API serve it with the same code as clouds, so we change the code to a new one for our function;
        if (weathId === 800) {
            weathId = 000;
            searchBackground();
        } else {
            searchBackground();
        }
    };
    
    function changeWeatherIcon(iconId) {
        var iconAdress;
        iconAdress = "img/" + iconId + ".png";
        $weatherIcon.attr("src", iconAdress);
    }
    
    // Function for codepenIo because I cannot store my icons in this place, so I use the icons provided by the API;
    function remoteWeatherIcon(iconId) {
        var inconUrl;
        inconUrl = "https://openweathermap.org/img/w/" + iconId + ".png";
        $weatherIcon.attr("src", inconUrl);
        $weatherIcon.css("height", "200px");
    }

    function celsiusToFar(temptF) {
        var temperatureC = Math.round((temptF - 32) / 1.8);
        $tempId.html(temperatureC + " º C");
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
    
    
    //function call that starts the call for the location and weather
    getLocationViaIp();
    //start tooltips
    $dataToggletTooltip.tooltip();
    ;
});