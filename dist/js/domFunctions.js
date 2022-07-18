export const setPlaceholderText = () => {
  const input = document.getElementById("searchBar__text");
  window.innerWidth < 400
    ? (input.placeholder = "City, State, Country")
    : (input.placeholder = "City, State, Country or Zip-code");
};

export const addSpinner = (element) => {
  animateButton(element);
  setTimeout(animateButton, 1000, element);
};

const animateButton = (element) => {
  element.classList.toggle("none");
  element.nextElementSibling.classList.toggle("block");
  element.nextElementSibling.classList.toggle("none");
};

export const displayError = (headerMsg, scrnreaderMsg) => {
  updateWeatherLocationHeader(headerMsg);
  updateScreenReaderConfirmation(scrnreaderMsg);
};

export const displayApiError = (statusCode) => {
  const properMsg = toProperCase(statusCode.message);
  updateWeatherLocationHeader(properMsg);
  updateScreenReaderConfirmation(properMsg);
  updateScreenReaderConfirmation(`${properMsg}. Please try again.`);
};

const toProperCase = (text) => {
  const words = text.split(" ");
  const properWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  return properWords.join(" ");
};

const updateWeatherLocationHeader = (message) => {
  const h1 = document.getElementById("currentForecast__location");
  h1.textContent = message;
};

export const updateScreenReaderConfirmation = (message) => {
  document.getElementById("confirmation").textContent = message;
};

export const updateDisplay = (weatherJson, locationObj) => {
  fadeDisplay();
  clearDisplay();

  const weatherClass = getWeatherClass(weatherJson.current.weather[0].icon);
  setBGImage(weatherClass);

  const buildScreenReaderWeather = buildScreenReaderWeather(
    weatherJson,
    locationObj
  );

  updateScreenReaderConfirmation(screenReaderWeather);
  updateWeatherLocationHeader(locationObj.getName());
  // current conditions display
  const currConditionsArray = createCurrentConditionsDivs(
    weatherJson,
    locationObj.getUnit()
  );

  displayCurrentConditions(currentCondArray);
  setFocusOnSearch();
  fadeDisplay();
};

const fadeDisplay = () => {
  const currConditions = document.getElementById("currentForecast");
  currConditions.classList.toggle("zero-vis");
  currConditions.classList.toggle("fade-in");

  const sixDay = document.getElementById("dailyForecast");
  sixDay.classList.toggle("zero-vis");
  sixDay.classList.toggle("fade-in");
};

const clearDisplay = () => {
  const currentConditions = document.getElementById(
    "currentForecast__conditions"
  );
  deleteContents(currentConditions);
  const sixDayForecast = document.getElementById("dailyForecast__contents");
  deleteContents(sixDayForecast);
};

const deleteContents = (parentElement) => {
  let child = parentElement.lastElementChild;
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
};

const getWeatherClass = (icon) => {
  const firstTwoChars = icon.slice(0, 2);
  const lastChar = icon.slice(2);
  const weatherLookup = {
    "09": "snow",
    10: "rain",
    11: "rain",
    13: "snow",
    50: "fog",
  };
  let weatherClass;
  if (weatherLookup[firstTwoChars]) {
    weatherClass = weatherLookup[firstTwoChars];
  } else if (lastChar === "d") {
    weatherClass = "clouds";
  } else {
    weatherClass = "night";
  }

  return weatherClass;
};

const setBGImage = (weatherClass) => {
  document.documentElement.classList.add(weatherClass);
  document.documentElement.classList.forEach((img) => {
    if (img !== weatherClass) document.documentElement.classList.remove(img);
  });
};

const buildScreenReaderWeather = (weatherJson, locationObj) => {
  const location = locationObj.getName();
  const unit = locationObj.getUnit();
  const tempUnit = unit === "imperial" ? "F" : "C";
  return `${weatherJson.current.weather[0].description} and 
          ${Math.round(
            Number(weatherJson.current.temp)
          )}°${tempUnit} in ${location}`;
};

const setFocusOnSearch = () => {
  document.getElementById("searchBar__text").focus();
};

const createCurrentConditionsDivs = (weatherObj, unit) => {
  const tempUnit = unit === "imperial" ? "F" : "C";
  const windUnit = unit === "imperial" ? "mph" : "m/s";
  const icon = createMainImgDiv(
    weatherObj.current.weather[0].icon,
    weatherObj.current.weather[0].description
  );

  const temp = createElem(
    "div",
    "temp",
    `${Math.round(Number(weatherObj.current.temp))}°`
  );
  const properDesc = toProperCase(weatherObj.current.weather[0].description);
  const desc = createElem("div", "desc", properDesc);
  const feelsLike = createElem(
    "div",
    "feels",
    `Feels like ${Math.round(Number(weatherObj.current.feels_like))}°`
  );
  const maxTemp = createElem(
    "div",
    "maxtemp",
    `High ${Math.round(Number(weatherObj.daily[0].temp.max))}°`
  );
  const minTemp = createElem(
    "div",
    "mintemp",
    `Low ${Math.round(Number(weatherObj.daily[0].temp.min))}°`
  );
  const humidity = createElem(
    "div",
    "humidity",
    `Humidity ${weatherObj.current.humidity}%`
  );
  const wind = createElem(
    "div",
    "wind",
    `Wind ${Math.round(Number(weatherObj.current.wind_speed))} ${windUnit}`
  );

  return [icon, temp, desc, feelsLike, maxTemp, minTemp, humidity, wind];
};

const createMainImgDiv = (icon, altText) => {
  const iconDiv = createElem("div", "icon");
  iconDiv.id = "icon";
  const faIcon = translateIconToFontAwesome(icon);
  faIcon.ariaHidden = true;
  faIcon.title = altText;
  iconDiv.appendChild(faIcon);
  return iconDiv;
};

const createElem = (elemType, divClassName, divText, unit) => {
  const div = document.createElement(elemType);
  div.className = divClassName;
  if (divText) {
    div.textContent = divText;
  }
  if (divClassName === "temp") {
    const unitDiv = document.createElement("div");
    unitDiv.className("unit");
    unitDiv.textContent = unit;
    div.appendChild(unitDiv);
  }

  return div;
};

const translateIconToFontAwesome = (icon) => {
  const iElem = document.createElement("i");
  const firstTwoChars = icon.slice(0, 2);
  const lastChar = icon.slice(2);

  switch (firstTwoChars) {
    case "01":
      if (lastChar === "d") {
        iElem.classList.add("far", "fa-sun");
      } else {
        iElem.classList.add("far", "fa-moon");
      }
      break;

    case "02":
      if (lastChar === "d") {
        iElem.classList.add("fas", "fa-cloud-sun");
      } else {
        iElem.classList.add("fas", "fa-cloud-moon");
      }
      break;

    case "03":
      iElem.classList.add("fas", "fa-cloud");
      break;

    case "04":
      iElem.classList.add("fas", "fa-cloud-meatball");
      break;

    case "09":
      iElem.classList.add("fas", "fa-cloud-rain");
      break;

    case "10":
      if (lastChar === "d") {
        iElem.classList.add("fas", "fa-cloud-sun-rain");
      } else {
        iElem.classList.add("fas", "fa-cloud-moon-rain");
      }
      break;

    case "11":
      iElem.classList.add("fas", "fa-poo-storm");
      break;

    case "13": {
      iElem.classList.add("far", "fa-snowflake");
      break;
    }

    case "50": {
      iElem.classList.add("fas", "fa-smog");
      break;
    }

    default:
      iElem.classList.add("far", "fa-question-circle");
  }
  return iElem;
};

const displayCurrentConditions = (currentCondArray) => {
  const currCondContainer = document.getElementById(
    "currentForecast__conditions"
  );
  currentCondArray.forEach((cc) => {
    currCondContainer.appendChild(cc);
  });
};
