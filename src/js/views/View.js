import icons from 'url:../../img/icons.svg'; // Parcel 2

export default class View {
  // This is a "private" property that will be inherited by all the child classes
  // The _data property will store the data that we will pass in to the render method
  // The _data property will be an empty object by default
  _data;

  // This method will only update the text and attributes in the DOM that have changed without having to render the entire DOM / view again
  update(data) {
    // Guard clause to make sure that the data is not an empty object
    // if (!data || (Array.isArray(data) && data.length === 0)) {
    //   return this.renderError();
    // }

    // We are storing the data in the _data property
    this._data = data;
    // console.log(this._data); // debug

    const newMarkup = this._generateMarkup();

    // This method will convert the newMarkup string into a DOM object
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // console.log(newDOM); // debug

    // This method will convert the current DOM object into an array
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    // console.log(newElements); // debug

    // This method will convert the current DOM object into an array
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // console.log(curElements); // debug

    // This method will loop through the newElements array
    newElements.forEach((newEl, i) => {
      // This method will compare the current element with the new element
      const curEl = curElements[i];
      console.log(curEl);

      // This method will compare the current element with the new element
      // console.log(curEl, newEl.isEqualNode(curEl)); // debug

      // This method will check if the new element is different from the current element
      // This method will check if the new element is different from the current element
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log(newEl.firstChild.nodeValue.trim()); // debug

        // This method will update the text content of the current element to the new element
        curEl.textContent = newEl.textContent;
        // console.log(curEl.textContent); // debug
      }

      // This method will check if the new element has any attributes
      if (!newEl.isEqualNode(curEl)) {
        // console.log(Array.from(newEl.attributes)); // debug

        // This method will loop through the new element's attributes
        Array.from(newEl.attributes).forEach(attr =>
          // This method will set the current element's attribute to the new element's attribute
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  render(data) {
    // console.log(data); // debug

    // Guard clause to make sure that the data is not an empty object
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }

    // We are storing the data in the _data property
    this._data = data;
    console.log(this._data); // debug

    const markup = this._generateMarkup();

    this._clear();

    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>;`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // This method is used to render an error message to the DOM.
  // The default error message is the one that we defined in the #errorMessage property.
  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;

    this._clear();

    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    // console.log(this._parentElement); // debug
    this._parentElement.innerHTML = '';
  }
}
