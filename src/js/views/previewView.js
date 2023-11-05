import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

export default class PreviewView extends View {
//   _parentElement = document.querySelector('*'); // We are selecting the parent element
  _parentElement = ''; // We are selecting the parent element

  _generateMarkup() {
    // console.log(this._data); // debug

    // We are looping over the array of recipes and calling the _generateMarkupPreview method for each recipe
    // We are then joining the array of strings into one big string
    return this._data.map(this._generateMarkupPreview).join('');
  }

  // This method will return a string of HTML markup for each recipe
  _generateMarkupPreview(result) {
    // console.log(result); // debug
    const id = window.location.hash.slice(1);

    return `
      <li class="preview">
        <a class="preview__link ${
          result.id === id ? 'preview__link--active' : ''
        }" href="#${result.id}">
          <figure class="preview__fig">
            <img src="${result.image}" alt="${result.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${result.title}</h4>
            <p class="preview__publisher">${result.publisher}</p>
            <div class="preview__user-generated ${result.key ? '' : 'hidden'}">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>
          </div>
        </a>
      </li>
      `;
  }
}


