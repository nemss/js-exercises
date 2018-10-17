import {CustomSelect} from './custom-select';

document.addEventListener('DOMContentLoaded', factorySelect)


function factorySelect() {
    const customSelectClass = '.custom-select';
    let getAllCustomSelect = document.querySelectorAll(`${customSelectClass}`);
    getAllCustomSelect.forEach((el, i) => {
        let dataAttribute = el.getAttribute("data-source");
        if(!!dataAttribute) {
            let select = new CustomSelect(el , dataAttribute.trim());
            select.getDataFromServer();
        } else {
            alert(`Custom select ${i} doesn't have data provided!`)
        }
    })
}
