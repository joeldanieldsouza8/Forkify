/// Imports
import 'core-js/stable'; // Polyfilling everything else
import 'regenerator-runtime/runtime'; // Polyfilling async/await
import * as model from './model.js';
import recipeView from './views/recipeView.js'; // We are importing the class from the recipeView.js file

///////////////////////////////////////////////////////////////////////

const recipeContainer = document.querySelector('.recipe');

function timeOut(s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

async function controlRecipes() {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);

    // Guard clause
    if (!id) return;
    recipeView.renderSpinner();

    // 1) Loading recipe

    // This is an async function as we are fetching data from the API so we need to await for the data to be fetched before we can use it
    // This method doesn't return anything so we don't need to store it in a variable.
    await model.loadRecipe(id);
    // const { recipe } = model.state;

    // 2) Rendering recipe

    // We are calling the render function from the recipeView.js file
    recipeView.render(model.state.recipes[id]);
  } catch (err) {
    console.log(err);
  }
}

controlRecipes();

// This is the same as the code below
['hashchange', 'load'].forEach(ev =>
  window.addEventListener(ev, controlRecipes)
);

// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);
