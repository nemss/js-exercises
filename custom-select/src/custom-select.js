export class CustomSelect {
    constructor(id, data) {
        this.id = id;
        this.data = data;
        this.inputElement = null;
    }

    createCustomSelect = () => {
        
        let getMainDivById = document.getElementById(`${this.id}`);
        getMainDivById.innerHTML = this.createCustomHtml();
        let getSpanByTag = getMainDivById.firstElementChild.firstElementChild;
        let listCountriesByTag = getMainDivById.lastElementChild;
        this.inputElement = getMainDivById.querySelector('input');

        getSpanByTag.addEventListener('click', () => {
            if (listCountriesByTag.style.display=="block")
            {
                getSpanByTag.innerText = 'Show'
                listCountriesByTag.style.display="none"
            } else {
                getSpanByTag.innerText = 'Hide'
                listCountriesByTag.style.display="block"
            }
           
        })

        listCountriesByTag.addEventListener('click', this.listItemClickHandler)
       
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
                    <button>Show</button>
                    <input type="text" disable placeholder="Select country" readonly>
                </div>
                <ul style='display: none;'>
                    ${this.addUnordertList().join('')}
                </ul>`
                
    }
}