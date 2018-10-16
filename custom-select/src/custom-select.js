export class CustomSelect {
    constructor(id, data) {
        this.id = id;
        this.data = data;
        this.inputElement = null;
        this.buttonElement = null;
        this.listElement = null;
    }

    static createCustomSelect = () => {
        
        let getMainDivById = document.getElementById(`${this.id}`);
        getMainDivById.innerHTML = this.createCustomHtml();
        this.buttonElement = getMainDivById.querySelector('button');
        this.inputElement = getMainDivById.querySelector('input');
        this.listElement = getMainDivById.querySelector('ul');
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