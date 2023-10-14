// This file will contain all the code for the search view because this concerns only with the DOM

class SeachView {
  // Remember the parent element will be unique to each view 
  _parentEl = document.querySelector('.search'); 

  // This method will return the value of the input field
  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  // This method will clear the input field
  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  // This method will add an event listener to the search button
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SeachView(); // This is a singleton instance of the class so we don't need to create an instance of the class in the controller.js file.  We can just import the class from the searchView.js file and use the methods directly.
