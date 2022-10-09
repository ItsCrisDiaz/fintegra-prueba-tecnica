import { countryList } from "./country-list.js";

const select = document.querySelector("select");
const form = document.querySelector("form");
const nameError = document.querySelector("#nameError");
const nameErrorMessage = document
  .querySelector("#nameErrorMessage")
  .content.cloneNode(true);

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
 * Llama a la API de Agify a través de la URL que se le agregue
 * @param {*} url - URL de la API
 */

const callApi = async function (url) {
  const res = await fetch(url);
  const data = await res.json();
  console.log(data.name);
  console.log(data.age);
};

/**
 * Revisa el contenido del formulario y con base en lo diligenciado, llama a la API
 * @param {event} event - Evento del navegador
 */

const predictAge = function (event) {
  event.preventDefault();
  const nameNode = document.querySelector("#name");
  const localizatonNode = document.querySelector("#localization");
  const name = nameNode.value.toLowerCase();
  const selectedCountry = localizatonNode.value;

  if (name === "") {
    nameError.appendChild(nameErrorMessage);
  } else if (selectedCountry === "none") {
    nameError.innerHTML = "";
    callApi(`https://api.agify.io?name=${name}`);
  } else {
    nameError.innerHTML = "";
    callApi(`https://api.agify.io?name=${name}&country_id=${selectedCountry}`);
  }
};

form.addEventListener("submit", (e) => predictAge(e));
