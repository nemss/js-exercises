export class CustomSelect {
    constructor(id, data) {
        this.id = id;
        this.data = data;
    }

    createCustomSelect = () => {
        let getSelectorById = document.getElementById(`${this.id}`);
        getSelectorById.innerHTML = this.addLiAboutCountries();
        getSelectorById.addEventListener('click', (event) => {
            let getInputById = document.getElementById('input');
            getInputById.innerHTML = event.target;
        })
    }

    addLiAboutCountries = () => {
        return this.data.map((element, index) => {return `<li>${element.countryName}</li>`})
    }

    

}