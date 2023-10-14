/// Imports
import 'core-js/stable'; // Polyfilling everything else
import 'regenerator-runtime/runtime'; // Polyfilling async/await
import * as model from './model.js';
import recipeView from './views/recipeView.js'; // We are importing the class from the recipeView.js file
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

/* 
  - The controller is responsible for handling user input and business logic
  - This file is the controller for the MVC architecture.  
  - The controller imports the necessary modules and contains functions for controlling the flow of the application. 
*/

// The if statement is used to make sure that the hot module replacement code only runs in development mode.  This is because we don't want to reload the page in production mode.
// if (module.hot) {
//   module.hot.accept();
// }

/* 
  - 
*/
async function controlRecipes() {
  try {
    // Get the id from the url, which is the hash value. We are using the slice method to remove the '#' symbol from the hash value.
    const id = window.location.hash.slice(1);
    console.log(id);

    // Guard clause to make sure that there is an id
    if (!id) return;

    // Render spinner
    recipeView.renderSpinner();

    // 1) Loading recipe

    // This is an async function as we are fetching data from the API so we need to await for the data to be fetched before we can use it
    // This method doesn't return anything so we don't need to store it in a variable.
    await model.loadRecipe(id);

    // 2) Rendering recipe

    // We are calling the render function from the recipeView.js file
    recipeView.render(model.state.recipes[id]);

    // Test
    // controlServings();
  } catch (err) {
    // console.log(err);
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

const controlPagination = function (goToPage) {
  // 1) Render NEW search results
  // We are calling the render function from the resultsView.js file and passing in the search results as an argument. This will display all the search results on the same page.
  // resultsView.render(model.state.search.results); // We are calling the render function from the resultsView.js file and passing in the search results as an argument. This will display all the search results on the same page.
  resultsView.render(model.getSearchResultsPage(goToPage)); // We are calling the render function from the resultsView.js file and passing in the search results as an argument. This will display all the search results on the same page.

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
}

const controlServings = function (newServings) {
  const id = window.location.hash.slice(1);

  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.render(model.state.recipes[id]);
}

function init() {
  // We are subscribing to the publisher.
  // We are using the hashchange event to listen for changes in the url hash.
  // This is so that we can render the recipe when the user clicks on a recipe.
  // We are using the load event to render the recipe when the page loads.
  recipeView.addHandlerRender(controlRecipes); // We are adding an event listener to the hashchange and load events in the recipeView.js file
  recipeView.addHandlerUpdateServings(controlServings); // We are adding an event listener to the servings buttons in the recipeView.js file
  searchView.addHandlerSearch(controlSearchResults); // We are adding an event listener to the search button in the searchView.js file
  paginationView.addHandlerClick(controlPagination); // We are adding an event listener to the pagination buttons in the paginationView.js file
}

init();
