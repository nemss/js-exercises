import {Http} from './http';

export class CustomSelect {
    constructor(container ,dataUrl = null) {
        this.container = container;
        this.dataUrl = dataUrl;
    }

    inputName = null
    labelElement = null;
    dataDefaultValue = null;
    dataDefaultLabel = null;
    

    inputElement = null;
    buttonElement = null;
    listElement = null;
    data = [];

    render = () => {
        this.dataUrl === null ? this.createElementForSelect() : this.createElementForJson()
        this.initialEventListener();
    }

    initialEventListener = () => {
        this.buttonElement.addEventListener('click', this.showAndHideClickHandler)
        this.listElement.addEventListener('click', this.listItemClickHandler)
    }

    listItemClickHandler = (e) => {
        this.changeInputValue(e.target.innerHTML, e.target.getAttribute('data-value'));
    }

    showAndHideClickHandler = (e) => {
        this.listElement.classList.toggle("hidden");
        this.container.querySelector('.custom-selec__input').classList.toggle("custom-select-input--active");
    }
    
    changeInputValue = (newLabel, newValue) => {
        this.inputElement.value = newValue
        this.labelElement.textContent = newLabel
    }

    createElementForJson = () => {
        // Insert template
        this.container.innerHTML = this.createHtml();

        //Creating the default ui html elements
        this.defaultElements();  

        //Selecting needed element
        this.inputElement = this.container.querySelector('input');

        //Checking existed data default value
        if(this.dataDefaultLabel != null) {
            this.labelElement.textContent = this.dataDefaultLabel;
            this.inputElement.value = this.dataDefaultValue;
        }
    }

    createElementForSelect = () => {
        // Insert template
        this.container.insertAdjacentHTML('beforeend', this.createHtml());

        // Creating the default ui html elements
        this.defaultElements();
   
        // Selecting needed elements
        this.inputElement = this.container.querySelector('select');
        this.labelElement = this.container.querySelector('span');

        let defaultValue = this.inputElement.selectedIndex,
            defaultLabel = this.inputElement.options[defaultValue].text;

        this.labelElement.textContent = defaultLabel;
    }

    defaultElements = () => {
        this.labelElement = this.container.querySelector('span');
        this.buttonElement = this.container.querySelector('button');
        this.listElement = this.container.querySelector('ul');
    }

    getDataFromSelect(el) {
        let options = el.querySelectorAll('option');
        options.forEach((el) => {
            this.data.push({value: el.value, label: el.text})
        })  

       this.render();
    }

    getDataFromServer = () => {
        Http.getData(this.dataUrl)
        .then(responseDate => {
            if(this.container.hasAttribute('data-value') && this.container.hasAttribute('data-label')) {
                let dataValue = this.container.getAttribute('data-value'),
                dataLabel = this.container.getAttribute('data-label');
                this.data = responseDate.map(element => { return {value: element[`${dataValue}`], label: element[`${dataLabel}`]}});
            }
            if(this.container.hasAttribute('data-default-label') && this.container.getAttribute('data-default-label').length > 0) {
                this.dataDefaultLabel = this.container.getAttribute('data-default-label');
                this.dataDefaultValue = this.data.find(e => e.label === `${this.dataDefaultLabel}`).value;
            }
            this.render();
        })
        .catch(error => alert(error)); 
    }

    addUnordertList = () => {
        return this.data.map((element) => {return `<li class="custom-select__item" data-value="${element.value}">${element.label}</li>`})
    }

    createHtml = () => {
        return `<div class="custom-select__input">
                    <button>^</button>
                    ${this.dataUrl === null ? '' : '<input type="text" disable readonly value="" " >'}
                    <span class="custom-select__label"></span>
                </div>
                <ul class="hidden custom-select__list">
                    ${this.addUnordertList().join('')}
                </ul>`
                
    }
}