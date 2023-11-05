import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

// The controller.js file doesn't need to be involved as we are just showing the window and hiding the window

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super(); // This will call the parent class's constructor function as this is a child class
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  // This method is used
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    // The bind method is used to bind the this keyword to the current object
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    // The bind method is used to bind the this keyword to the current object
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  // This method is used to add an event listener to the form element
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      // This is used to prevent the form from submitting the data to a new page
      e.preventDefault();

      // This is used to get the data from the form
      const dataArr = [...new FormData(this)]; // The 'this' keyword is used to point to the form element that the event listener is attached to and the FormData constructor function is used to convert the form data into an array

      // This is used to convert the data from the form into an object
      const data = Object.fromEntries(dataArr);
      // console.log(data); // debug

      // This is used to call the handler function and pass in the data object as an argument
      handler(data);
    });
  }
}

export default new AddRecipeView();
