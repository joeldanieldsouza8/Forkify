/// Imports
import 'core-js/stable'; // Polyfilling everything else
import 'regenerator-runtime/runtime'; // Polyfilling async/await
import * as model from './model.js';
import recipeView from './views/recipeView.js'; // We are importing the class from the recipeView.js file
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

/* 
  - The controller is responsible for handling user input and business logic
  - This file is the controller for the MVC architecture.  
  - The controller imports the necessary modules and contains functions for controlling the flow of the application. 
*/

// The if statement is used to make sure that the hot module replacement code only runs in development mode.  This is because we don't want to reload the page in production mode.
if (module.hot) {
  module.hot.accept();
}

// This function is used to control the recipe
// This is the handler function that will be called in the recipeView.js file
async function controlRecipes() {
  try {
    // Get the id from the url, which is the hash value. We are using the slice method to remove the '#' symbol from the hash value.
    const id = window.location.hash.slice(1);
    // console.log(id); // debug

    // Guard clause to make sure that there is an id
    if (!id) return;

    // Render spinner
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1) Update bookmarks view
    // debugger;
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading recipe
    // This is an async function as we are fetching data from the API so we need to await for the data to be fetched before we can use it
    // This method doesn't return anything so we don't need to store it in a variable.
    await model.loadRecipe(id);

    // 3) Rendering recipe
    // We are calling the render function from the recipeView.js file
    recipeView.render(model.state.recipe);

    // Test
    // controlServings();
  } catch (err) {
    console.log(err); // debug
    recipeView.renderError(); // We don't need to pass in the error message 'err' as an argument, as we have already defined the default error message in the renderError method in the recipeView.js file
  }
}

/* 
  - This function will be called in the controller.js file when the user clicks on the search button or presses the enter key
  - This function will be called in the controller.js file when the user clicks on the pagination buttons
  - This function will be called in the controller.js file when the user clicks on the servings buttons
  - This function will be called in the controller.js file when the page loads
  - This function will be called in the controller.js file when the user clicks on a recipe
  - This function will be called in the controller.js file when the user clicks on the bookmarks button
*/

// This function is used to control the search results
// This is the handler function that will be called in the searchView.js file
async function controlSearchResults() {
  try {
    // Render spinner
    resultsView.renderSpinner();

    // 1) Get search query
    // We are calling the getQuery method from the searchView.js file
    const query = searchView.getQuery();
    console.log(query);

    // Guard clause to make sure that there is a search query
    if (!query) return;

    // 2) Load search results
    // We are calling the loadSearchResults function from the model.js file
    await model.loadSearchResults(query);

    // 3) Render search results
    // We are calling the render function from the resultsView.js file and passing in the search results as an argument. This will display all the search results on the same page.
    // resultsView.render(model.state.search.results); // We are calling the render function from the resultsView.js file and passing in the search results as an argument. This will display all the search results on the same page.
    resultsView.render(model.getSearchResultsPage()); // We are calling the render function from the resultsView.js file and passing in the search results as an argument. This will display all the search results on the same page.

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
}

// This function is used to control the pagination
// This is the handler function that will be called in the paginationView.js file
const controlPagination = function (goToPage) {
  // 1) Render NEW search results
  // We are calling the render function from the resultsView.js file and passing in the search results as an argument. This will display all the search results on the same page.
  // resultsView.render(model.state.search.results); // We are calling the render function from the resultsView.js file and passing in the search results as an argument. This will display all the search results on the same page.
  resultsView.render(model.getSearchResultsPage(goToPage)); // We are calling the render function from the resultsView.js file and passing in the search results as an argument. This will display all the search results on the same page.

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

// This function is used to update the recipe servings
// This is the handler function that will be called in the recipeView.js file
const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe); // We are calling the render function from the recipeView.js file and passing in the recipe as an argument. This will display the recipe on the same page.
  recipeView.update(model.state.recipe); // We are calling the render function from the recipeView.js file and passing in the recipe as an argument. This will display the recipe on the same page.
};

// This function is used to add/remove a bookmark
// This is the handler function that will be called in the recipeView.js file
const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  // We are calling the addBookmark function from the model.js file and passing in the recipe as an argument
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  // We are calling the update function from the recipeView.js file and passing in the recipe as an argument. This will display the recipe on the same page.
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  // We are calling the render function from the bookmarksView.js file and passing in the bookmarks as an argument. This will display the bookmarks on the same page.
  bookmarksView.render(model.state.bookmarks);
};

// This method will render the bookmarks when the page loads
// This is the handler function that will be called in the bookmarksView.js file
function controlBookmarks() {
  bookmarksView.render(model.state.bookmarks);
}

// This method is used to add a new recipe
// This is the handler function that will be called in the addRecipeView.js file
async function controlAddRecipe(newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    
    // Render bookmark view
    // We use the render method and not the update method because we are not updating the recipe, we are adding a new recipe to the bookmarks array in the state object and then we are rendering the bookmarks
    bookmarksView.render(model.state.bookmarks);

    // Change ID in the URL
    // We are using the pushState method to change the url in the browser without reloading the page
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    
    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥💥💥', err);
    addRecipeView.renderError(err.message);
  }
}

// This function is used to initialize the application
function init() {
  // Here we are using the publisher-subscriber pattern to add event listeners to the hashchange and load events
  recipeView.addHandlerRender(controlRecipes); // We are adding an event listener to the hashchange and load events in the recipeView.js file
  recipeView.addHandlerUpdateServings(controlServings); // We are adding an event listener to the servings buttons in the recipeView.js file
  recipeView.addHandlerAddBookmark(controlAddBookmark); // We are adding an event listener to the bookmark button in the recipeView.js file
  searchView.addHandlerSearch(controlSearchResults); // We are adding an event listener to the search button in the searchView.js file
  paginationView.addHandlerClick(controlPagination); // We are adding an event listener to the pagination buttons in the paginationView.js file
  bookmarksView.addHandlerRender(controlBookmarks); // We are adding an event listener to the load event in the bookmarksView.js file
  addRecipeView.addHandlerUpload(controlAddRecipe); // We are adding an event listener to the submit event in the addRecipeView.js file
}

init();
