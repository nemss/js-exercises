import {Http} from './http';
import {CountryData} from './country-data';

export class CustomSelect {
    constructor(container ,dataUrl) {
        this.container = container;
        this.dataUrl = dataUrl;
    }

    elementClass = '.custom-select'
    inputElement = null
    buttonElement = null;
    listElement = null;
    data = [];

    createCustomSelect = () => {    
        this.container.innerHTML = this.createCustomHtml();
        this.buttonElement = this.container.querySelector('button');
        this.inputElement = this.container.querySelector('input');
        this.listElement = this.container.querySelector('ul');
        this.buttonElement.addEventListener('click', this.showAndHideClieckHandler)
        this.listElement.addEventListener('click', this.listItemClickHandler)
    }

    showAndHideClieckHandler = (e) => {
        this.listElement.classList.toggle("hidden")
    }

    listItemClickHandler = (e) => {
        this.changeInputValue(e.target.innerHTML);
    }

    changeInputValue = (newValue) => {
        this.inputElement.value = newValue
    }

    getDataFromServer = () => {
        Http.getData(this.dataUrl)
        .then(responseDate => {
            const countriesData = responseDate.countries.country;
            this.data = countriesData.map(element => {return new CountryData(element.countryName, element.capital)});
            this.createCustomSelect();
        })
        .catch(error => console.log(error)); 
    }

    addUnordertList = () => {
        return this.data.map((element) => {return `<li>${element.countryName}</li>`})
    }

    createCustomHtml = () => {
        return `<div>
                    <button>Button</button>
                    <input type="text" disable placeholder="Select country" readonly>
                </div>
                <ul class="hidden">
                    ${this.addUnordertList().join('')}
                </ul>`
                
    }
}