import icons from 'url:../../img/icons.svg'; // Parcel 2
import PreviewView from './previewView.js';

class ResultsView extends PreviewView {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again.';
  _message = '';
}

// This is a singleton instance of the class so we don't need to create an instance of the class in the controller.js file.
// We can just import the class from the searchView.js file and use the methods directly.
export default new ResultsView();
