import { API_URL, RES_PER_PAGE } from './config.js';
import { getJSON } from './helpers';

/*
    - The model.js file defines the data model for your application. 
    - It maintains the state of recipes and provides a function to load a recipe from an external source (Forkify API).
*/

/* 
  - 'state' is an object that holds the application's data. 
  - The recipes property is an object, which will store the recipes.
  - The search property is an object, which will store the search query, the search results, the number of search results per page and the current page number.
*/
export const state = {
  recipes: {},
  search: {
    query: '', // This will store the search query
    results: [], // This will store the search results
    resultsPerPage: RES_PER_PAGE, // This will store the number of search results per page
    page: 1, // This will store the current page number
  },
};

// console.log(state.recipes);

/* 
  - This is an async function because it will fetch data from the Forkify API
  - This function will be called from the controller.js file when the user clicks on a recipe
  - This function will be called from the controller.js file when the user clicks on the pagination buttons
  - This function will be called from the controller.js file when the user clicks on the servings buttons
  - The function will take in an id as an argument, which will be the recipe id
  - The function will return a promise, which will be resolved with the recipe data
*/
export async function loadRecipe(recipeID) {
  try {
    // This is an async function as we are fetching data from the API so we need to await for the data to be fetched before we can use it
    const data = await getJSON(`${API_URL}${recipeID}`);

    // We are storing the recipe data in the state object
    const { recipe } = data.data;

    state.recipes[recipeID] = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };

    // console.log(state.recipes[recipeID]);
  } catch (err) {
    console.error(`${err} 💥💥💥`);
    throw err;
  }
}

/* 
  - This function will be called from the controller.js file when the user clicks on the search button or presses the enter key 
  - This function will take in a search query as an argument, which will be the search query
  - This function will return a promise, which will be resolved with the search results
  - This function will be called from the controller.js file when the user clicks on the pagination buttons
  - This function will be called from the controller.js file when the user clicks on the servings buttons
*/
export async function loadSearchResults(searchQuery) {
  try {
    // We are storing the search query in the state object
    state.search.query = searchQuery;

    // This is an async function as we are fetching data from the API so we need to await for the data to be fetched before we can use it
    const data = await getJSON(`${API_URL}?search=${searchQuery}`);

    // We are storing the search results in the state object
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
      };
    });

    console.log(state.search.results);
  } catch (err) {
    console.error(`${err} 💥💥💥`);
    throw err;
  }
}

/* 
  - This function will be called from the controller.js file when the user clicks on the pagination buttons
  - This function doesn need to be async because the data is already stored in the state object and we are not fetching any data from the API 
  - This function will take in a page number as an argument, which will be the page number
  - This function will return a slice of the array of search results
  - This function will be called from the controller.js file when the user clicks on the servings buttons
*/
export function getSearchResultsPage(pageNumber = state.search.page) {
  // We are storing the page number in the state object
  state.search.page = pageNumber;

  // We are storing the start index and the end index of the slice in the state object
  const start = (pageNumber - 1) * state.search.resultsPerPage;
  const end = pageNumber * state.search.resultsPerPage;

  // We are returning a slice of the array of search results
  return state.search.results.slice(start, end);
}

// This function will be called from the controller.js file when the user clicks on the servings buttons
export function updateServings(newServings) {
  const id = window.location.hash.slice(1);

  // Guard clause to make sure that there is a recipe
  if (!state.recipes[id]) return;

  state.recipes[id].ingredients.forEach(ing => {
    // newQt = oldQt * newServings / oldServings // 2 * 8 / 4 = 4
    ing.quantity = (ing.quantity * newServings) / state.recipes[id].servings;
  });

  // We are updating the servings in the state object
  state.recipes[id].servings = newServings;
}
