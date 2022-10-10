import { countryList } from "./country-list.js";

const select = document.querySelector("select");
const form = document.querySelector("form");
const nameError = document.querySelector("#nameError");
const nameErrorMessage = `<p>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 9L9 15M9 9L15 15M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>

    Por favor agregar un nombre.
  </p>
  <ul>
    <li>Si usas tildes, por favor eliminarlas.</li>
    <li>No usar caracteres especiales.</li>
    <li>
      Si quieres buscar varios nombres, sepáralos únicamente por espacios.
    </li>
  </ul>`;

const ageResult = document.querySelector("#ageResult");
const ageTable = document.querySelector("#ageTable");
const ageTableHeader = `<thead>
    <tr>
      <th scope="col">Nombre</th>
      <th scope="col">Edad</th>
    </tr>
  </thead>`;

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
 * Recorre un array para crear una fila de una tabla con la semántica adecuada para mostrar las edades
 * @param {array} data - Array de datos
 */
const createAgeTable = (data) => {
  ageTable.innerHTML = ageTableHeader;
  ageTable.appendChild(document.createElement("tbody"));
  const ageTableBody = ageTable.querySelector("tbody");
  data.forEach((element) => {
    // Crea y selecciona la nueva fila
    ageTableBody.appendChild(document.createElement("tr"));
    const activeRow = ageTableBody.querySelector("tr:last-child");

    // Crea la celda de nombre
    const nameCell = document.createElement("th");
    nameCell.setAttribute("scope", "row");
    activeRow.appendChild(nameCell);
    const nameContent = document.createTextNode(
      capitalizeFirstLetter(element.name)
    );
    activeRow.querySelector("th").appendChild(nameContent);

    // Crea la celda de edad
    const ageCell = document.createElement("td");
    activeRow.appendChild(ageCell);
    let ageContent;
    if (element.age) {
      ageContent = document.createTextNode(element.age);
    } else {
      ageContent = document.createTextNode("No encontrado");
    }
    activeRow.querySelector("td").appendChild(ageContent);
  });
};

/**
 * Llama a la API de Agify a través de la URL que se le agregue
 * @param {*} url - URL de la API
 */

const callApi = async function (url) {
  const res = await fetch(url);
  const data = await res.json();

  if (data.length) {
    createAgeTable(data);
    return (ageResult.innerHTML =
      "Con base en los nombres, predecimos que estas son las edades");
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
    nameError.innerHTML = nameErrorMessage;
  } else if (name.indexOf(" ") === -1) {
    nameError.innerHTML = "";
    ageTable.innerHTML = "";
    if (selectedCountry === "none") {
      // Si sólo agregó nombre y no país
      ageResult.innerHTML = callApi(`https://api.agify.io?name=${name}`);
    } else {
      // Si agregó nombre y país
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

    if (!selectedCountry === "none") {
      // Añade el query de país
      queryString.push(`country_id=${selectedCountry}`);
    }
    const query = queryString.join("");
    callApi(query);
  }
};

form.addEventListener("submit", (e) => predictAge(e));
