import icons from 'url:../../img/icons.svg'; // Parcel 2

export default class View {
  // This is a "private" property that will be inherited by all the child classes
  // The _data property will store the data that we will pass in to the render method
  // The _data property will be an empty object by default
  _data; 

  
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