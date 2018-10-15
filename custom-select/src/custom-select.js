export class CustomSelect {
    constructor(id, data) {
        this.id = id;
        this.data = data;
    }

    createCustomSelect = () => {
        
        let getMainDivById = document.getElementById(`${this.id}`);
        getMainDivById.innerHTML = this.createCustomHtml();
        let getSpanById = getMainDivById.querySelector('#arrow');
        let listCountriesById = getMainDivById.querySelector('#show-countries');

        listCountriesById.addEventListener('click', (event) => {
        getMainDivById.querySelector('#input').value = event.target.innerHTML;
        })
        getSpanById.addEventListener('click', () => {
            if (listCountriesById.style.display=="block")
            {
                getSpanById.innerText = 'Show'
                listCountriesById.style.display="none"
            } else {
                getSpanById.innerText = 'Hide'
                listCountriesById.style.display="block"
            }
           
        })
    }

    addUnordertList = () => {
        return this.data.map((element) => {return `<li>${element.countryName}</li>`})
    }

    createCustomHtml = () => {
        return `<div>
                    <span id="arrow">Show</span>
                    <input type="text" disable placeholder="Select country" id='input' readonly>
                </div>
                <ul id="show-countries" style='display: none;'>
                    ${this.addUnordertList().join('')}
                </ul>`
                
    }
}