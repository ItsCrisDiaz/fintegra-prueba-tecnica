import { countryList } from "./country-list.js";

const select = document.querySelector("select");
const form = document.querySelector("form");
const nameError = document.querySelector("#nameError");
const nameErrorMessage = document
  .querySelector("#nameErrorMessage")
  .content.cloneNode(true);
const ageResult = document.querySelector("#ageResult");

/**
 * Crea un elemento option con el valor y nombre del país
 * @param {string} value - Código del país
 * @param {string} country - Nombre del país
 */

const createOption = (value, country) => {
  const option = document.createElement("option");
  option.setAttribute("value", value);
  const text = document.createTextNode(country);
  option.appendChild(text);
  select.appendChild(option);
};

/**
 * Recorre el objeto countryList para crear elementos option dentro del select
 */
const createCountryList = () => {
  for (const property in countryList) {
    createOption(property, countryList[property]);
  }
};

createCountryList();

/**
 * Convierte la primer letra en mayúscula
 * @param {string} string - Caracter a convertir en mayúsculas
 * @returns
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Llama a la API de Agify a través de la URL que se le agregue
 * @param {*} url - URL de la API
 */

const callApi = async function (url) {
  const res = await fetch(url);
  const data = await res.json();

  if (data.length) {
    return console.log(data);
  } else {
    if (data.age === null) {
      return (ageResult.innerHTML =
        "Oh vaya, parece que no podemos predecir tu edad");
    } else {
      return (ageResult.innerHTML = `${capitalizeFirstLetter(
        data.name
      )}, hemos predecido que tu edad es de <strong>${data.age}</strong> años`);
    }
  }
};

/**
 * Revisa el contenido del formulario y con base en lo diligenciado, llama a la API
 * @param {event} event - Evento del navegador
 */

const predictAge = function (event) {
  event.preventDefault();

  // Revisa los valores seleccionados
  const name = document.querySelector("#name").value.toLowerCase();
  const selectedCountry = document.querySelector("#localization").value;

  if (name === "") {
    // Si el usuario no agregó nombre
    nameError.appendChild(nameErrorMessage);
  } else if (name.indexOf(" ") === -1) {
    if (selectedCountry === "none") {
      // Si sólo agregó nombre y no país
      nameError.innerHTML = "";
      ageResult.innerHTML = callApi(`https://api.agify.io?name=${name}`);
    } else {
      // Si agregó nombre y país
      nameError.innerHTML = "";
      ageResult.innerHTML = callApi(
        `https://api.agify.io?name=${name}&country_id=${selectedCountry}`
      );
    }
  } else {
    const nameList = name.split(" ");

    // Crea el string de la petición con base en el array

    const queryString = ["https://api.agify.io?"];
    nameList.forEach((element) => {
      queryString.push(`name[]=${element}&`);
    });

    if (selectedCountry === "none") {
      const query = queryString.join("");
      callApi(query);
    } else {
      // Añade el query de país
      queryString.push(`country_id=${selectedCountry}`);
      const query = queryString.join("");
      callApi(query);
    }
  }
};

form.addEventListener("submit", (e) => predictAge(e));
