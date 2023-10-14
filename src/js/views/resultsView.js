import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
    _errorMessage = 'No recipes found for your query! Please try again.';
    _message = '';

    _generateMarkup() {
        // console.log(this._data); // debug

        // We are looping over the array of recipes and calling the _generateMarkupPreview method for each recipe
        // We are then joining the array of strings into one big string
        return this._data.map(this._generateMarkupPreview).join('');        
    }

    // This method will return a string of HTML markup for each recipe
    _generateMarkupPreview(result) {
        return `
            <li class="preview">
            <a class="preview__link" href="#${result.id}">
                <figure class="preview__fig">
                <img src="${result.image}" alt="${result.title}" />
                </figure>
                <div class="preview__data">
                <h4 class="preview__title">${result.title}</h4>
                <p class="preview__publisher">${result.publisher}</p>
                </div>
            </a>
            </li>
        `;
    }

}



// This is a singleton instance of the class so we don't need to create an instance of the class in the controller.js file.  
// We can just import the class from the searchView.js file and use the methods directly.
export default new ResultsView(); 