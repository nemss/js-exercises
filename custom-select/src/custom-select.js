import {Http} from './http'

export class CustomSelect {
	constructor(container, dataUrl = null) {
		this.container = container
		this.dataUrl = dataUrl
	}

	searchWord = ''
	labelElement = null
	value = null
	label = null
	selectedOption = null
	mainDiv = null
	inputElement = null
	listElement = null
	lisItems = null
	arrowCounter = null
	data = []


	render = () => {
		this.dataUrl === null ? this.createElementForSelect() : this.createElementForJson()
		this.initialEventListener()
	}

	initialEventListener = () => {
		this.mainDiv.addEventListener('click', this.toggleList)
	}

	toggleList = () => {
		let element = this.container.querySelector('.custom-select__input')
		element.classList.toggle("custom-select-input--active")

		if (!this.container.classList.contains('custom-select--active')) {
			this.setSelectedItem()
		}
		this.container.classList.toggle("custom-select--active")
		this.listElement.classList.toggle("hidden")
		if (this.listElement.classList.contains('hidden')) {
			this.arrowCounter = null
			//this.resetSearch()
			document.removeEventListener('keyup', this.searchElement)
			document.removeEventListener('keydown', this.moveItem)
			document.removeEventListener('click', this.detectOutsideClick)
			this.listElement.removeEventListener('click', this.listItemClickHandler)
			this.listElement.removeEventListener('mouseover', this.setColorListItemHandler)
		} else {
			document.addEventListener('keyup', this.searchElement)
			document.addEventListener('keydown', this.moveItem)
			document.addEventListener('click', this.detectOutsideClick)
			this.listElement.addEventListener('click', this.listItemClickHandler)
			this.listElement.addEventListener('mouseover', this.setColorListItemHandler)
		}
	}

	searchElement = (e) => {
		if (e.keyCode >= 65 && e.keyCode <= 90) {
			this.searchWord += e.key
		}

		let filter = this.searchWord.toLowerCase()
		this.lisItems.forEach(el => {
			let label = el.textContent
			if (label.toLowerCase().indexOf(filter) == 0) {
				this.removeClass(this.activeOption, 'active')
				this.setClass(el, 'active')
				this.activeOption = el
				return
			}
		})

		setTimeout(() => {
			this.searchWord = ''
		}, 1000);
	}

	resetSearch = () => {
		this.searchWord = ''
		this.lisItems.forEach(el => {
			if (el.classList.contains('active') && el.classList.contains('selected') !== false) {
				this.removeClass(el, 'active')
			}
		})
	}

	setSelectedItem = () => {
		if (this.selectedOption) {
			this.removeClass(this.selectedOption, 'selected')
		}

		this.selectedOption = document.querySelector(this.selectedActiveOptionString())
		this.setActiveItem(this.selectedOption)
		this.setClass(this.selectedOption, 'selected')
		this.arrowCounter = this.data.findIndex(e => e.label === this.selectedOption.textContent)
	}

	setActiveItem = (element) => {
		if (this.activeOption) {
			this.removeClass(this.activeOption, 'active')
		}
		this.activeOption = element
		this.setClass(this.activeOption, 'active')
	}

	moveItem = (e) => {
		let keyName = e.key
		switch (keyName) {
			case 'ArrowUp':
				e.preventDefault()
				if (this.activeOption.previousElementSibling) {
					this.setActiveItem(this.activeOption.previousElementSibling);
					this.arrowCounter = this.arrowCounter - 1
					this.fixScrolling()
				}
				break
			case 'ArrowDown':
				e.preventDefault()
				if (this.activeOption.nextElementSibling) {
					this.setActiveItem(this.activeOption.nextElementSibling)
					this.arrowCounter = this.arrowCounter + 1
					this.fixScrolling()
				}
				break
			case 'Enter':
				// Because when you click on the button to open the dropdown, it stays focused and the Enter case breaks;
				e.preventDefault()
				this.changeInputValue(this.activeOption.innerHTML, this.activeOption.getAttribute('data-value'))
				this.toggleList()
				break
			case 'Escape':
				this.toggleList()
				break
		}
	}

	fixScrolling = () => {
		const liHeight = this.lisItems[this.arrowCounter].clientHeight
		this.listElement.scrollTop = liHeight * this.arrowCounter
	}

	setColorListItemHandler = (e) => {
		if (e.target.nodeName !== 'UL' && e.target !== this.selectedOption && this.activeOption !== e.target) {
			this.removeClass(this.activeOption, 'active')
			this.removeClass(this.selectedOption, 'active')
			this.setClass(e.target, 'active')
			this.activeOption = e.target
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
		this.changeInputValue(e.target.innerHTML, e.target.getAttribute('data-value'))
		this.toggleList()
	}

	changeInputValue = (newLabel, newValue) => {
		this.value = newValue
		this.label = newLabel
		this.inputElement.value = newValue
		this.labelElement.textContent = newLabel
		this.setSelectedItem()
	}

	createElementForJson = () => {
		// Insert template
		this.container.innerHTML = this.createHtml()

		//Creating the default ui html elements
		this.defaultElements()

		//Selecting needed element
		this.inputElement = this.container.querySelector('input')

		//Checking existed data default value
		if (this.label != null) {
			this.labelElement.textContent = this.label
			this.inputElement.value = this.value
		}
	}

	createElementForSelect = () => {
		// Insert template
		this.container.insertAdjacentHTML('beforeend', this.createHtml())

		// Creating the default ui html elements
		this.defaultElements()

		// Selecting needed elements
		this.inputElement = this.container.querySelector('select')

		let defaultValue = this.inputElement.selectedIndex,
			defaultLabel = this.inputElement.options[defaultValue].text

		this.labelElement.textContent = defaultLabel
	}

	defaultElements = () => {
		this.labelElement = this.container.querySelector('span')
		this.listElement = this.container.querySelector('ul')
		this.lisItems = this.container.querySelectorAll('li')
		this.mainDiv = this.container.querySelector('div')
	}

	getDataFromSelect(el) {
		let options = el.querySelectorAll('option')
		options.forEach((el) => {
			this.data.push({value: el.value, label: el.text})
		})
		this.value = el.querySelector('select').value
		this.render()
	}

	getDataFromServer = () => {
		Http.getData(this.dataUrl)
			.then(responseDate => {
				if (this.container.hasAttribute('data-value') && this.container.hasAttribute('data-label')) {
					let dataValue = this.container.getAttribute('data-value'),
						dataLabel = this.container.getAttribute('data-label')
					this.data = responseDate.map(element => {
						return {value: element[`${dataValue}`], label: element[`${dataLabel}`]}
					})
				}
				if (this.container.hasAttribute('data-default-label') && this.container.getAttribute('data-default-label').length > 0) {
					this.label = this.container.getAttribute('data-default-label')
					this.value = this.data.find(e => e.label === `${this.label}`).value
				}
				this.render()
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
		return `.custom-select__item[data-value='${this.value}']`
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