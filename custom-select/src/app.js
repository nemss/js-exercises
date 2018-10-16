import {Http} from './http';
import {CountryData} from './country-data';
import {CustomSelect} from './custom-select';

const URL = 'https://commasense.tech/countries.json';
let listCountriesData = [];

Http.getData(URL)
    .then(responseDate => {
        const countriesData = responseDate.countries.country;
        listCountriesData = countriesData.map(element => {return new CountryData(element.countryName, element.capital)});
        // let createCustomSelect = new CustomSelect('custom-select' ,listCountriesData);
        // createCustomSelect.createCustomSelect();
        factorySelect('custom-select', listCountriesData);
        factorySelect('custom-select1', listCountriesData);
    })
    .catch(error => console.log(error));

    function factorySelect(id, data) {
        let select = new CustomSelect(id, data);
        return select.createCustomSelect();
    }