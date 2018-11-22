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
	listItems = null
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
			document.removeEventListener('keyup', this.searchElement)
			document.removeEventListener('keydown', this.moveItem)
			document.removeEventListener('click', this.detectOutsideClick)
			this.listElement.removeEventListener('click', this.listItemClickHandler)
			this.listElement.removeEventListener('mouseover', this.setColorListItemHandler)
		} else {
			this.arrowCounter = this.data.findIndex(e => e.label === this.selectedOption.textContent)
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

			let filter = this.searchWord.toLowerCase()
			this.listItems.forEach((el, index) => {
				let label = el.textContent
				if (label.toLowerCase().indexOf(filter) == 0) {
					this.setActiveItem(el)
					this.arrowCounter = index
					return
				}
			})

			const liHeight = this.listItems[this.arrowCounter].clientHeight
			this.listElement.scrollTop = liHeight * this.arrowCounter

			setTimeout(() => {
				this.searchWord = ''
			}, 1000);
		}
	}

	setSelectedItem = () => {
		if (this.selectedOption) {
			this.removeClass(this.selectedOption, 'selected')
		}

		this.selectedOption = document.querySelector(this.selectedActiveOptionString())
		this.setActiveItem(this.selectedOption)
		this.setClass(this.selectedOption, 'selected')
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
				let previousActiveOption = this.activeOption.previousElementSibling
				if (previousActiveOption) {
					this.setActiveItem(previousActiveOption)
					this.arrowCounter = this.arrowCounter - 1
					this.fixScrolling(keyName)
				}
				break
			case 'ArrowDown':
				e.preventDefault()
				let nextActiveOption = this.activeOption.nextElementSibling
				if (nextActiveOption) {
					this.setActiveItem(nextActiveOption)
					this.arrowCounter = this.arrowCounter + 1
					this.fixScrolling(keyName)
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

	fixScrolling = (direction) => {
		const itemHeight = this.listItems[this.arrowCounter - 1].clientHeight,
			viewportHeight = this.listElement.clientHeight,
			viewportOffset = this.listElement.offsetTop,
			visibleItems = Math.ceil(viewportHeight / itemHeight),
			itemPosition = this.listItems[this.arrowCounter - 1].offsetTop,
			nextItemPosition = this.listItems[this.arrowCounter].offsetTop,
			totalHeight = this.listItems.length * itemHeight,
			bottomBuffer = visibleItems + 2 * itemHeight,
			topBuffer = visibleItems - 2 * itemHeight

		if (direction === 'ArrowDown') {
			if (viewportOffset !== totalHeight - viewportHeight) {
				if (itemHeight + itemPosition > viewportHeight - bottomBuffer) {
					let currentScroll = Math.round(this.listElement.scrollTop)
					this.listElement.scrollTop = currentScroll + itemHeight
				}
			}
		} else if(direction === 'ArrowUp'){
			if (itemHeight + itemPosition <  viewportHeight + topBuffer) {
				let currentScroll = Math.round(this.listElement.scrollTop)
				this.listElement.scrollTop = currentScroll - itemHeight
			}
		}
	}

	setColorListItemHandler = (e) => {
		if (e.target.nodeName !== 'UL' && this.activeOption !== e.target) {
			this.removeClass(this.selectedOption, 'active')
			this.setActiveItem(e.target);
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
		this.listItems = this.container.querySelectorAll('li')
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
