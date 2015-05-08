var zipcode = "37217";
var API_URL = "http://api.wunderground.com/api/e64bd84d9794bd5e/forecast10day/geolookup/q/";
var TEMP = document.querySelector("temp");
var WEATHER = document.querySelector("weather");
var ZIP = document.querySelector("zip");
var HUMIDITY = document.querySelector("humidity");
var DAY1 = document.querySelector("day1");
var DAY2 = document.querySelector("day2");
var DAY3 = document.querySelector("day3");
var DAY4 = document.querySelector("day4");
var DAY5 = document.querySelector("day5");
var TEXTFIELD = document.querySelector("input:first-child");
var SUBMITBUTTON = document.querySelector("input:nth-child(2)");
var FORM = document.querySelector("form");
var CHIDE = document.querySelector(".chide");
var LOCATIONBUTTON = document.querySelector("button.loc");
var FIVEDAYBUTTON = document.querySelector("button.fiveday");
var request_url;
var dataObject;

SUBMITBUTTON.onclick = function(event) {
  event.preventDefault();
  if (!(TEXTFIELD.value.match(/^\d{5}(?:[-\s]\d{4})?$/))) {
    CHIDE.classList.remove("hidden");
    return false;
  }
  ZIP.innerHTML = "";
  zipcode = TEXTFIELD.value;
  CHIDE.classList.add("hidden");
  zipQuery();
}

LOCATIONBUTTON.onclick = function(event) {
/*  ZIP.innerHTML = "";*/
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(locQuery);
}

FIVEDAYBUTTON.onclick = function(event) {
  event.preventDefault();
  CHIDE.classList.add("hidden");
  var array = dataObject.forecast.txt_forecast.forecastday
  TEMP.innerHTML = "";
  WEATHER.innerHTML = "";
  HUMIDITY.innerHTML = "";
  DAY1.innerHTML = array[0].title + '<img src=\'' + array[0].icon_url + '\'</img>' + '<div class=\'small\'>' + array[0].fcttext + '</div>';
  DAY2.innerHTML = array[2].title + '<img src=\'' + array[2].icon_url + '\'</img>' + '<div class=\'small\'>' + array[2].fcttext + '</div>';
  DAY3.innerHTML = array[4].title + '<img src=\'' + array[4].icon_url + '\'</img>' + '<div class=\'small\'>' + array[4].fcttext + '</div>';
  DAY4.innerHTML = array[6].title + '<img src=\'' + array[6].icon_url + '\'</img>' + '<div class=\'small\'>' + array[6].fcttext + '</div>';
  DAY5.innerHTML = array[8].title + '<img src=\'' + array[8].icon_url + '\'</img>' + '<div class=\'small\'>' + array[8].fcttext + '</div>';
}

function ipQuery() {
  getJSON("http://api.wunderground.com/api/e64bd84d9794bd5e/geolookup/q/autoip.json", function(data) {
    ZIP.innerHTML = "<p class='initial_load'>Your IP: " + data.location.zip + ", " + data.location.city + " " + data.location.state; "</p>";
  })
}

ipQuery();

function zipQuery() {
  request_url = API_URL + zipcode + ".json";
  submitQuery(request_url);
}

function locQuery(pos) {
  CHIDE.classList.add("hidden");
  request_url = API_URL + pos.coords.latitude + "," + pos.coords.longitude + ".json";
  submitQuery(request_url);
  TEXTFIELD.value = "";
}

function submitQuery(request_url) {
  getJSON(request_url, function(data){
    dataObject = data;
    
    if (data.forecast === undefined) {
      /*CHIDE.innerHTML = "ZIP code was not found!";*/
      CHIDE.classList.remove("hidden");
      FIVEDAYBUTTON.classList.add("hidden");
      TEMP.innerHTML = "";
      WEATHER.innerHTML = "";
      ZIP.innerHTML = "";
      HUMIDITY.innerHTML = "";
      return;
    } else {
      FIVEDAYBUTTON.classList.remove("hidden");
    }
    TEMP.innerHTML = "<p><high>High: </high>" + data.forecast.simpleforecast.forecastday[0].high.fahrenheit + "&deg;F</p><p><low>Low: </low>" + data.forecast.simpleforecast.forecastday[0].low.fahrenheit + "&deg;F</p>";
    WEATHER.innerHTML = data.forecast.simpleforecast.forecastday[0].conditions + '<img src =\'' + data.forecast.simpleforecast.forecastday[0].icon_url + '\'></img>';
    ZIP.innerHTML = "for " + data.location.zip + ", " + data.location.city + " " + data.location.state;
    /*ZIP.innerHTML = "for " + ((data && data.location && data.location.zip) || zipcode) + ((data && data.location && data.location.city && ", " + data.location.city + " " + data.location.state) || "");*/
    HUMIDITY.innerHTML = "Avg. humidity: " + data.forecast.simpleforecast.forecastday[0].avehumidity;
  });
  DAY1.innerHTML = "";
  DAY2.innerHTML = "";
  DAY3.innerHTML = "";
  DAY4.innerHTML = "";
  DAY5.innerHTML = "";
};

function getJSON(url, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.onload = function() {
    if (this.status >= 200 && this.status < 400) {
      cb(JSON.parse(this.response));
    }
  };
  xhr.send();
}

