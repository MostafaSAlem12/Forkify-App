import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  /**
   * Render the recived object to the dom
   * @param {Object | Object[]} data the data to be rendered (e.g recipe)
   * @param {boolean} [render=true] if false, create markup string instead of rendering to the dom
   * @returns {undefined | string} A markup sting is returned if render = false
   * @this {Object} View instance  
   * @todo finish implemntation
   *  */

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);

  }

  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDom = document.createRange().createContextualFragment(newMarkup)
    const newElements = Array.from(newDom.querySelectorAll('*'))
    // console.log(newElements);
    const curElement = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElement[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      // update changed Text
      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() != '') {
        // console.log('VVVV', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      //update changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(altr => curEl.setAttribute(altr.name, altr.value))
      }

    })
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>`
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };

  renderError(messege = this._errorMessege) {
    const markup = `<div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${messege}</p>
  </div>`
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);

  }

  renderMessege(messege = this._messege) {
    const markup =
      `<div class="message">
    <div>
      <svg>
        <use href="${icons}#icon-smile"></use>
      </svg>
    </div>
    <p>${messege}</p>
  </div>`
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);

  }
}