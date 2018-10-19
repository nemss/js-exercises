import {Http} from './http';
import {CountryData} from './country-data';

export class CustomSelect {
    constructor(container ,dataUrl = null) {
        this.container = container;
        this.dataUrl = dataUrl;
    }

    inputName = null
    labelElement = null;
    dataValue = null;
    dataLabel = null;

    inputElement = null;
    buttonElement = null;
    listElement = null;
    data = [];

    createCustomSelect = () => {
        if(this.dataUrl === null) {
            this.createElementForSelect();
        } else {
            this.createElementForJson();
        }

        this.buttonElement.addEventListener('click', this.showAndHideClieckHandler)
        this.listElement.addEventListener('click', this.listItemClickHandler)
    }

    showAndHideClieckHandler = (e) => {
        this.listElement.classList.toggle("hidden")
    }

    createElementForJson = () => {
        this.container.innerHTML = this.createHtmlForJson();
        this.dataValue = this.container.getAttribute('data-value');
        this.dataLabel = this.container.getAttribute('data-label');
        console.log(this.dataLabel);
        console.log(this.dataValue);
        this.repeatElements();
        this.inputElement = this.container.querySelector('input');
    }

    createElementForSelect = () => {
        this.container.insertAdjacentHTML('beforeend', this.createHtmlForSelect());
        this.repeatElements();
        this.inputElement = this.container.querySelector('select');
        this.labelElement = this.container.querySelector('span');
        this.labelElement.textContent = this.inputElement.options[this.inputElement.selectedIndex].text;
    }

    listItemClickHandler = (e) => {
        this.changeInputValue(e.target.innerHTML, e.target.getAttribute('data-value'));
    }

    changeInputValue = (newLabel, newValue) => {
        this.inputElement.value = newValue
        this.labelElement.textContent = newLabel
    }

    getDataFromSelect(el) {
        let options = el.querySelectorAll('option');
        options.forEach((el) => {
            this.data.push({value: el.value, label: el.text})
        })  

       this.createCustomSelect();
    }

    getDataFromServer = () => {
        Http.getData(this.dataUrl)
        .then(responseDate => {
            this.data = responseDate.map(element => {return element});
            console.log(this.data)
            this.createCustomSelect();
        })
        .catch(error => console.log(error)); 
    }

    addUnordertList = (label, value) => {
        if(this.dataUrl === null) {
            return this.data.map((element) => {return `<li data-value="${element.value}">${element.label}</li>`})
        } else {
            return this.data.map((element, index) => {return `<li data-value="${element[value]}">${element[label]}</li>`})
        }
    }

    repeatElements = () => {
        this.labelElement = this.container.querySelector('span');
        this.buttonElement = this.container.querySelector('button');
        this.listElement = this.container.querySelector('ul');
    }

    createHtmlForSelect = () => {
        return `<div>
                    <button>Button</button>
                    <span class="custom-select__label"></span>
                </div>
                <ul class="hidden">
                    ${this.addUnordertList().join('')}
                </ul>`
                
    }

    createHtmlForJson = (label, value) => {
        return `<div>
                    <button>Button</button>
                    <input type="text" disable readonly value="" >
                    <span class="custom-select__label"></span>
                </div>
                <ul class="hidden">
                    ${this.addUnordertList(label, value).join('')}
                </ul>`
                
    }
}