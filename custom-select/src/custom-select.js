import {Http} from './http';

export class CustomSelect {
	constructor(container, dataUrl = null) {
		this.container = container;
		this.dataUrl = dataUrl;
	}

	inputName = null;
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
		this.mainDiv.addEventListener('click', this.showAndHideClickHandler);
		this.listElement.addEventListener('click', this.listItemClickHandler);
		this.listElement.addEventListener('mouseover', this.addColorItemHandler)
		this.listElement.addEventListener('mouseout', this.removeColorItemHandler);
	}

	removeColorItemHandler = (e) => {
		if (e.target !== this.selectedOption && e.relatedTarget.nodeName === 'LI') {
			e.target.classList.remove('active');
		}
		this.activeOption = e.target;
	}

	addColorItemHandler = (e) => {
		if (e.target !== this.selectedOption && this.activeOption !== e.target) {
			e.target.classList.add('active');
			this.activeOption.classList.remove('active')
			this.selectedOption.classList.remove('active');
		} else {
			e.target.classList.add('active');
		}
	}

	setSelectedItem = () => {
		if (this.selectedOption) {
			this.removeClass(this.selectedOption, 'selected');
			this.removeClass(this.selectedOption, 'active');
		}

		this.selectedOption = document.querySelector(`.custom-select__item[data-value='${this.value}']`);
		this.activeOption = document.querySelector(`.custom-select__item[data-value='${this.value}']`);
		this.setClass(this.selectedOption, 'selected');
		this.setClass(this.selectedOption, 'active');
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
		}
	}

	showAndHideDiv = (el = null) => {
		if (el !== null) {
			if (el.closest(".custom-select")) return
		}
		if (el !== this.container) {
			this.container.classList.remove('custom-select--active')
			this.removeClass(this.activeOption, 'active')
			this.activeOption = null
		}
		this.listElement.classList.add("hidden");
	}

	listItemClickHandler = (e) => {
		this.changeInputValue(e.target.innerHTML, e.target.getAttribute('data-value'));
		this.showAndHideDiv();
	}

	showAndHideClickHandler = (e) => {

		this.listElement.classList.toggle("hidden");
		this.container.querySelector('.custom-select__input').classList.toggle("custom-select-input--active");
		if (!this.container.classList.contains('custom-select--active')) {
			this.setSelectedItem();
		}
		this.container.classList.toggle("custom-select--active");
		if (this.listElement.classList.contains('hidden')) {
			document.removeEventListener('keydown', this.moveItem);
			document.removeEventListener('click', e => this.showAndHideDiv(e.target));
		} else {
			document.addEventListener('keydown', this.moveItem);
			document.addEventListener('click', e => this.showAndHideDiv(e.target));
		}
	}

	changeInputValue = (newLabel, newValue) => {
		this.value = newValue;
		this.label = newLabel;
		this.inputElement.value = newValue;
		this.labelElement.textContent = newLabel;
		this.showAndHideDiv();
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
		//sthis.labelElement = this.container.querySelector('span');

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

	setClass = (el, elClass) => {
		el.classList.add(elClass)
	}

	removeClass = (el, elClass) => {
		el.classList.remove(elClass)
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

	addUnordertList = () => {
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
                    ${this.addUnordertList().join('')}
                </ul>`
	}
}