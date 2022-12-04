const API_KEY = "b49418c3993acf0f5b7ecb709a54bbd9";
let input_selection = document.querySelector("#ways");
let inputs_adding = document.querySelector("#inputs");
let weather_info = document.querySelector("#weather-info");
weather_info.style.display = "none";
//!for search by city name;
let city_name = document.createElement("input");
let city_name_label = document.createElement("label");
let city_name_submit = document.createElement("button");

city_name_label.textContent = "Enter city name: ";
inputs_adding.appendChild(city_name_label);
city_name.type = "text";
inputs_adding.appendChild(city_name);
city_name_submit.textContent = "Search";
inputs_adding.appendChild(city_name_submit);

city_name_submit.addEventListener("click", () => {
  fetchByCityName(city_name.value);
});
//!--------------------------------------

//!search by latitude and longitude;
let latitude_input = document.createElement("input");
latitude_input.type = "text";
let longitude_input = document.createElement("input");
longitude_input.type = "text";
let latitude_label = document.createElement("label");
latitude_label.textContent = "latitude";
let longitude_label = document.createElement("label");
longitude_label.textContent = "longitude";

let coordinate_submit = document.createElement("button");
coordinate_submit.innerHTML = "Search";
coordinate_submit.addEventListener("click", () => {
  fetchByCoordinate(latitude_input.value, longitude_input.value);
});

//!-----------------------------------------

//!search by my location
let my_location_button = document.createElement("button");
my_location_button.textContent = "My Location";
my_location_button.addEventListener("click", () => {
  getLocation();
});

//!-------------------------------------------------


//!shows the respective inputs based on the selected option;
const displaySearch = () => {
  inputs_adding.innerHTML = "";

  switch (true) {
    case input_selection.value === "cityName":
      inputs_adding.appendChild(city_name_label);
      inputs_adding.appendChild(city_name);
      inputs_adding.appendChild(city_name_submit);
      break;
    case input_selection.value === "latLong":
      inputs_adding.appendChild(latitude_label);
      inputs_adding.appendChild(latitude_input);
      inputs_adding.appendChild(longitude_label);
      inputs_adding.appendChild(longitude_input);
      inputs_adding.appendChild(coordinate_submit);
      break;
    case input_selection.value === "location":
      inputs_adding.appendChild(my_location_button);
      console.log("my lcoation");
      break;
    default:
      break;
  }
};

input_selection.addEventListener("change", () => {
  displaySearch();
});

const displayData = async (data) => {
    weather_info.style.display = "block";
    document.querySelector("#city-name").textContent = `${data.name}`
    document.querySelector("#country_name").textContent = `${await convertToCountryName(data.sys.country)}`;
    document.querySelector("#w-condition").textContent = `${data.weather[0].main}`;
    document.querySelector("#description").textContent = `${data.weather[0].description}`;
    document.querySelector("#temperature").textContent = `${Math.floor(data.main.temp)}℃`;
    document.querySelector("#temperature-min").textContent = `${data.main.temp_min}℃`;
    document.querySelector("#temperature-max").textContent = `${data.main.temp_max}℃`;
    document.querySelector("#temperature-f-like").textContent = `${data.main.feels_like}℃`;
    document.querySelector("#humidity").textContent = `${data.main.humidity}%`;
    document.querySelector("#pressure").textContent = `${data.main.pressure}`;
    document.querySelector("#wind-spped").textContent = `${data.wind.speed}m/s, ${handleWindDirection(data.wind.deg)}`;
    document.querySelector("#local-date").textContent = `${changeTimeFormat(data.dt)}`;
    
}

//!helpfull functions--------------------------------------
//gets user's current location
const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("not supported");
  }
};

const showPosition = (position) => {
  fetchByCoordinate(position.coords.latitude, position.coords.longitude);
};

const handleWindDirection = (degree) => {
  switch (true) {
    case degree <= 90:
      return "east";
      break;
    case degree <= 180:
      return "south";
    case degree <= 270:
      return "west";
    case degree <= 360:
      return "north";
    default:
      break;
  }
};

const changeTimeFormat = (time) => {
  let new_time = new Date(time * 1000);
  return new_time.toLocaleString("it-IT");
};

//--------------------------------------------------

//!services--------------------------------
const fetchByCoordinate = (latitude, longitude) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      displayData(data);
    });
};

const fetchByCityName = (city) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      displayData(data);
    });
};

const convertToCountryName = async (code) => {
  const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
  const data = await response.json();
  console.log(data[0].name.common)
  return data[0].name.common;
};

//----------------------------------------------------
