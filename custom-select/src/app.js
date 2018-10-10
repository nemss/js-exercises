import {Http} from './http';
import {CountryData} from './country-data';

const URL = 'https://commasense.tech/countries.json';
let listCountriesData = [];

Http.getData(URL)
    .then(responseDate => {
        const countriesData = responseDate.countries.country;
        countriesData.map(element => {
            listCountriesData.push(new CountryData(element.countryName, element.capital))});
      
        console.log(listCountriesData)
    })
    .catch(error => alert(error));
