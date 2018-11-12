import {Http} from './http';

export class CustomSelect {
	constructor(container, dataUrl = null) {
		this.container = container;
		this.dataUrl = dataUrl;
	}

	searchWord = '';
	labelElement = null;
	value = null;
	label = null;
	selectedOption = null;
	mainDiv = null;
	inputElement = null;
	listElement = null;
	lisItems = null;
	data = [];


	render = () => {
		this.dataUrl === null ? this.createElementForSelect() : this.createElementForJson()
		this.initialEventListener();
	}

	initialEventListener = () => {
		this.mainDiv.addEventListener('click', this.toggleList);
		this.listElement.addEventListener('click', this.listItemClickHandler);
	}

	toggleList = () => {
		let element = this.container.querySelector('.custom-select__input');
		element.classList.toggle("custom-select-input--active");

		if (!this.container.classList.contains('custom-select--active')) {
			this.setSelectedItem();
		}
		this.container.classList.toggle("custom-select--active")
		this.listElement.classList.toggle("hidden");

		if (this.listElement.classList.contains('hidden')) {
			document.removeEventListener('keydown', this.searchElement);
			document.removeEventListener('keydown', this.moveItem);
			document.removeEventListener('click', this.detectOutsideClick);
			this.listElement.removeEventListener('mouseover', this.setColorListItemHandler)
			this.listElement.removeEventListener('mouseout', this.removeColorListItemHandler);
		} else {
			document.addEventListener('keydown', this.searchElement);
			document.addEventListener('keydown', this.moveItem);
			document.addEventListener('click', this.detectOutsideClick);
			this.listElement.addEventListener('mouseover', this.setColorListItemHandler)
			this.listElement.addEventListener('mouseout', this.removeColorListItemHandler);
		}
	}

	searchElement = (e) => {
		this.searchWord += e.key;
		// if(e.target !== null) {
		// 	this.searchElement();
		// }
		console.log(this.searchWord);
		console.log(this.data.filter(e => e.label.toLowerCase().indexOf(this.searchWord.toLowerCase()) > -1));
	}

		setSelectedItem = () => {
		if (this.selectedOption) {
			this.removeClass(this.selectedOption, 'selected');
			this.removeClass(this.selectedOption, 'active');
		}

		this.selectedOption = document.querySelector(this.selectedActiveOptionString());
		this.activeOption = document.querySelector(this.selectedActiveOptionString());
		this.setClass(this.selectedOption, 'active');
		this.setClass(this.selectedOption, 'selected');
	}

	moveItem = (e) => {
		let keyName = e.key;
		switch (keyName) {
			case 'ArrowUp':
				if (this.activeOption.previousElementSibling) {
					this.setClass(this.activeOption, 'active');
					this.removeClass(this.activeOption, 'active');
					this.activeOption = this.activeOption.previousElementSibling;
					this.setClass(this.activeOption, 'active');
				}
				break;
			case 'ArrowDown':
				if (this.activeOption.nextElementSibling) {
					this.removeClass(this.activeOption, 'active');
					this.activeOption = this.activeOption.nextElementSibling;
					this.setClass(this.activeOption, 'active');
				}
				break;
			case 'Enter':
				this.changeInputValue(this.activeOption.innerHTML, this.activeOption.getAttribute('data-value'))
				break;
			case 'Escape':
				this.toggleList();
				break;
		}
	}

	removeColorListItemHandler = (e) => {
		if (e.target !== this.selectedOption && e.relatedTarget.nodeName === 'LI') {
			this.removeClass(e.target, 'active');
		}
		this.activeOption = e.target;
	}

	setColorListItemHandler = (e) => {
		if (e.target !== this.selectedOption && this.activeOption !== e.target) {
			this.setClass(e.target, 'active');
			this.removeClass(this.activeOption, 'active');
			this.removeClass(this.selectedOption, 'active');
		} else {
			this.setClass(e.target, 'active');
		}
	}

	detectOutsideClick = ({target}) => {
		if (target !== null) {
			if (target.closest(".custom-select")) {
				return false
			} else {
				this.toggleList()
			}
		}
	}

	listItemClickHandler = (e) => {
		this.changeInputValue(e.target.innerHTML, e.target.getAttribute('data-value'));
		this.toggleList();
	}

	changeInputValue = (newLabel, newValue) => {
		this.value = newValue;
		this.label = newLabel;
		this.inputElement.value = newValue;
		this.labelElement.textContent = newLabel;
		// this.showAndHideDiv();
	}

	createElementForJson = () => {
		// Insert template
		this.container.innerHTML = this.createHtml();

		//Creating the default ui html elements
		this.defaultElements();

		//Selecting needed element
		this.inputElement = this.container.querySelector('input');

		//Checking existed data default value
		if (this.label != null) {
			this.labelElement.textContent = this.label;
			this.inputElement.value = this.value;
		}
	}

	createElementForSelect = () => {
		// Insert template
		this.container.insertAdjacentHTML('beforeend', this.createHtml());

		// Creating the default ui html elements
		this.defaultElements();

		// Selecting needed elements
		this.inputElement = this.container.querySelector('select');

		let defaultValue = this.inputElement.selectedIndex,
			  defaultLabel = this.inputElement.options[defaultValue].text;

		this.labelElement.textContent = defaultLabel;
	}

	defaultElements = () => {
		this.labelElement = this.container.querySelector('span');
		this.listElement = this.container.querySelector('ul');
		this.lisItems = this.container.querySelectorAll('li');
		this.mainDiv = this.container.querySelector('div');
	}

	getDataFromSelect(el) {
		let options = el.querySelectorAll('option');
		options.forEach((el) => {
			this.data.push({value: el.value, label: el.text})
		})
		this.value = el.querySelector('select').value;
		this.render();
	}

	getDataFromServer = () => {
		Http.getData(this.dataUrl)
			.then(responseDate => {
				if (this.container.hasAttribute('data-value') && this.container.hasAttribute('data-label')) {
					let dataValue = this.container.getAttribute('data-value'),
						dataLabel = this.container.getAttribute('data-label');
					this.data = responseDate.map(element => {
						return {value: element[`${dataValue}`], label: element[`${dataLabel}`]}
					});
				}
				if (this.container.hasAttribute('data-default-label') && this.container.getAttribute('data-default-label').length > 0) {
					this.label = this.container.getAttribute('data-default-label');
					this.value = this.data.find(e => e.label === `${this.label}`).value;
				}
				this.render();
			})
			.catch(error => alert(error))
	}

	setClass = (el, elClass) => {
		el.classList.add(elClass)
	}

	removeClass = (el, elClass) => {
		el.classList.remove(elClass)
	}

	selectedActiveOptionString = () => {
		return `.custom-select__item[data-value='${this.value}']`;
	}

	createListItems = () => {
		return this.data.map((element) => {
			return `<li class="custom-select__item" data-value="${element.value}">${element.label}</li>`
		})
	}

	createHtml = () => {
		return `<div class="custom-select__input">
                    <button>&nbsp;</button>
                    ${this.dataUrl === null ? '' : '<input type="text" disable readonly value="" " >'}
                    <span class="custom-select__label"></span>
                </div>
                <ul class="custom-select__list hidden">
                    ${this.createListItems().join('')}
                </ul>`
	}
}