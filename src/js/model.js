import { API_URL, RES_PER_PAGE, API_KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

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
  recipe: {},

  search: {
    query: '', // This will store the search query
    results: [], // This will store the search results
    resultsPerPage: RES_PER_PAGE, // This will store the number of search results per page
    page: 1, // This will store the current page number
  },

  bookmarks: [], // This will store the bookmarks
};

// console.log(state.recipes);

function createRecipeObject(data) {
  const { recipe } = data.data;

  // We are storing the recipe data in the state object
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,

    // This is a short circuiting trick.
    // recipe.key is a condition that checks if the recipe object has a property named key. If recipe.key exists and evaluates to a truthy value (i.e., it's not null, undefined, false, 0, or an empty string), the condition is true.
    // If the condition is true, it creates a new object with a property named key and assigns the value of recipe.key to it. This object is created using object literal syntax: { key: recipe.key }.
    // The ... (spread syntax) is then used to merge this new object into the object being returned by the function.
    // So, what this part of the code is doing is: if recipe.key exists and has a truthy value, it adds a key property to the object being returned with the value of recipe.key. If recipe.key is falsy or does not exist, this property is not added to the returned object.
    ...(recipe.key && { key: recipe.key }),
  };
}

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
    const data = await AJAX(`${API_URL}${recipeID}?key=${API_KEY}`);

    // We are storing the recipe data in the state object
    state.recipe = createRecipeObject(data);

    // We are updating the bookmarked property in the state object}
    if (state.bookmarks.some(bookmark => bookmark.id === recipeID)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }

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
    const data = await AJAX(`${API_URL}?search=${searchQuery}&key=${API_KEY}`);

    // We are storing the search results in the state object
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });

    // We are resetting the page number to 1
    state.search.page = 1;

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
  // We are updating the servings in the state object
  state.recipe.ingredients.forEach(ingredient => {
    ingredient.quantity =
      (ingredient.quantity * newServings) / state.recipe.servings;
  });

  // We are updating the servings in the state object
  state.recipe.servings = newServings;
}

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
  // console.log(state.bookmarks);
};

// This function will be called from the controller.js file when the user clicks on the bookmark button
// When we want to add something, we get the entire data from the state object and then we add the new data to the state object
export function addBookmark(recipe) {
  // Add bookmark
  state.bookmarks.push(recipe); // We are adding the new bookmark to the state object

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true; // We are updating the bookmarked property in the state object
  }

  persistBookmarks();
}

// This function will be called from the controller.js file when the user clicks on the bookmark button
// When we want to delete something, we only get the id from the state object and then we delete the data from the state object
export function deleteBookmark(id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id); // We are finding the index of the bookmark in the state object
  state.bookmarks.splice(index, 1); // We are deleting the bookmark from the state object

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false; // We are updating the bookmarked property in the state object
  }

  persistBookmarks();
}

function init() {
  const storage = localStorage.getItem('bookmarks');

  if (storage) {
    // Here we are updating the bookmarks array in the state object with the bookmarks array from the local storage by converting the bookmarks array from the local storage into a JSON object
    state.bookmarks = JSON.parse(storage);
  }
}

init();

// This function will make an AJAX call to the Forkify API to upload a new recipe
export async function uploadRecipe(newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => {
        return entry[0].startsWith('ingredient') && entry[1] !== '';
      })
      .map(ingredient => {
        // const ingredientArray = ingredient[1].replaceAll(' ', '').split(',');
        const ingredientArray = ingredient[1].split(',').map(el => el.trim());

        if (ingredientArray.length !== 3) {
          throw new Error(
            'Wrong ingredient format! Please use the correct format :)'
          );
        }

        const [quantity, unit, description] = ingredientArray;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    // console.log(recipe); // debug

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    // console.log(data); // debug

    state.recipe = createRecipeObject(data); // We are storing the recipe data in the state object
    addBookmark(state.recipe); // We are adding the recipe to the bookmarks array in the state object
  } catch (err) {
    throw err;
  }
}
