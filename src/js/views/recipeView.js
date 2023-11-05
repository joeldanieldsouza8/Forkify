import icons from 'url:../../img/icons.svg'; // Parcel 2
import { Fraction } from 'fractional'; // This function is used to convert decimals to fractions
import View from './View.js';

// the view is responsible for displaying data to the user. When the view directly calls functions from the controller, it blurs this separation of concerns.
// This class is used to render recipe-related data to the DOM.

class RecipeView extends View {
  /* 
    Note to self:
      - This will make it easier to change the parent element in the future if we need to. 
      - We can just change it here and it will be changed everywhere else in the code.
      - This makes it easier to render success or error messages to the DOM.
    */
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'We could not find that recipe. Please try another one!';
  _message = '';

  _generateMarkup() {
    return `
      <figure class="recipe__fig">
      <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
      <h1 class="recipe__title">
        <span>${this._data.title}</span>
      </h1>
      </figure>

      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${
            this._data.cookingTime
          }</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${
            this._data.servings
          }</span>
          <span class="recipe__info-text">servings</span>

          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--update-servings" data-update-to="${
              this._data.servings - 1
            }">
              <svg>
                <use href="${icons}#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--update-servings" data-update-to="${
              this._data.servings + 1
            }">
              <svg>
                <use href="${icons}#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>

        <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
        </div>
        <button class="btn--round btn--bookmark">
          <svg class="">
            <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
          </svg>
        </button>
      </div>

      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">

          ${this._data.ingredients.map(this._generateMarkupIngredient).join('')}

        </ul>
      </div>

      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${
            this._data.publisher
          }. Please check out
          directions at their website.</span>
        </p>
        <a
          class="btn--small recipe__btn"
          href="${this._data.sourceUrl}"
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </a>
      </div>
      `;
  }

  _generateMarkupIngredient(ing) {
    return `
      <li class="recipe__ingredient">
      <svg class="recipe__icon">
      <use href="${icons}#icon-check"></use>
      </svg>
      <div class="recipe__quantity">${
        ing.quantity ? new Fraction(ing.quantity).toString() : ''
      }</div>
      <div class="recipe__description">
      <span class="recipe__unit">${ing.unit}</span>
      ${ing.description}
      </div>
      </li>
      `;
  }

  /// The below methods are used to subscribe to the publisher. We are using the publisher-subscriber pattern. These are event delegation methods.

  addHandlerRender(handler) {
    // We are using the hashchange event to listen for changes in the url hash. This is so that we can render the recipe when the user clicks on a recipe.
    // We are using the load event to render the recipe when the page loads.
    // REMEMBER: The 'addEventListener' method takes in two arguments. The first argument is the event type and the second argument is the event handler function.
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  addHandlerUpdateServings(handler) {
    // We are using event delegation to add an event listener to the servings buttons
    this._parentElement.addEventListener('click', function (e) {
      // We are using the closest method to select the closest element with the class 'btn--update-servings' to the element that was clicked on
      const btn = e.target.closest('.btn--update-servings');
      // console.log(btn);

      // Guard clause to make sure that the btn variable is not null
      if (!btn) return;

      // We are storing the value of the data attribute 'update-to' in the newServings variable. We are using the + sign to convert the string value to a number
      // const newServings = Number(btn.dataset.updateTo);
      // const newServings = +btn.dataset.updateTo;

      // Guard clause to make sure that the newServings variable is greater than 0
      // if (newServings > 0) {
      //   handler(newServings);
      // }

      const { updateTo } = btn.dataset;

      if (+updateTo > 0) {
        handler(+updateTo);
      }
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      // We are using the closest method to select the closest element with the class 'btn--bookmark' to the element that was clicked on
      // This is because the bookmark button is not present on the page when the page loads. It is only present when the recipe is rendered.
      const btn = e.target.closest('.btn--bookmark');
      // console.log(btn);

      // Guard clause to make sure that the btn variable is not null
      if (!btn) return;

      handler();
    });
  }
}

// We need to export the class so we can use it in the controller.js file. This is because we are using the MVC architecture.
export default new RecipeView();
