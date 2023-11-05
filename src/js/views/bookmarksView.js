import View from './View.js';
import PreviewView from './previewView.js';

class BookmarksView extends PreviewView {
  _parentElement = document.querySelector('.bookmarks__list'); // We are selecting the parent element
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it ;)';
  _message = '';

  // This method will add an event listener to each bookmark
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
}

// This is a singleton instance of the class so we don't need to create an instance of the class in the controller.js file.
// We can just import the class from the searchView.js file and use the methods directly.
export default new BookmarksView();
