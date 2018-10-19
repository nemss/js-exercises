import {CustomSelect} from './custom-select';

document.addEventListener('DOMContentLoaded', factorySelect)


function factorySelect() {
    const customSelectClass = '.custom-select';
    let getAllCustomSelect = document.querySelectorAll(`${customSelectClass}`);
    getAllCustomSelect.forEach((el, i) => {
        let attribute = el.getAttribute("data-source");
        if(!!attribute) {
            let select = new CustomSelect(el , attribute.trim());
            select.getDataFromServer();
        } else if(el.firstElementChild.tagName == 'SELECT') {
            let select = new CustomSelect(el);
            select.getDataFromSelect(el);
        } else {
            alert(`Custom select ${i} doesn't have data provided!`)
        }
    })
}
