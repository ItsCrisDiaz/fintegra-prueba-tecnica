import { countryList } from "./country-list.js";

const select = document.querySelector("select");

const createCountryList = () => {
  const createOption = (value, country) => {
    const option = document.createElement("option");
    option.setAttribute("value", value);
    const text = document.createTextNode(country);
    option.appendChild(text);
    select.appendChild(option);
  };

  for (const property in countryList) {
    createOption(property, countryList[property]);
  }
};

createCountryList();
