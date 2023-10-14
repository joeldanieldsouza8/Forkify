import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn--inline'); // We are using the closest method to select the closest element with the class 'btn--inline' to the element that was clicked on

            if(!btn) return; // Guard clause to make sure that the btn variable is not null

            // const goToPage = Number(btn.dataset.goto); // We are storing the value of the data attribute 'goto' in the goToPage variable. We are using the + sign to convert the string value to a number
            const goToPage = +btn.dataset.goto; // We are storing the value of the data attribute 'goto' in the goToPage variable. We are using the + sign to convert the string value to a number
            // console.log(typeof goToPage);

            handler(goToPage); // We are calling the controlPagination function from the controller.js file and passing in the goToPage variable as an argument
        });
    }

    _generateMarkupButton(direction, page) {
        return `
        <button data-goto="${page}" class="btn--inline pagination__btn--${direction}">
            ${direction === 'prev' ? 
            `<svg class="search__icon">
            <use href="${icons}#icon-arrow-left">
            </use>
            </svg>` :
            ''}

            <span>Page ${page}</span>

            ${direction === 'next' ? 
            `<svg class="search__icon">
            <use href="${icons}#icon-arrow-right">
            </use>
            </svg>` :
            ''}
        </button>
        `;
    }

    _generateMarkup() {
        const curPage = this._data.page;
        const numPages = Math.ceil(
            this._data.results.length / this._data.resultsPerPage
        );

        // Page 1 and there are other pages
        if (curPage === 1 && numPages > 1) {
            return this._generateMarkupButton('next', curPage + 1);
        }

        
        // Last page
        if (curPage === numPages && numPages > 1) {
            return this._generateMarkupButton('prev', curPage - 1);
        }
        
        // Other page
        if(curPage < numPages) {
            return `
            ${this._generateMarkupButton('prev', curPage - 1)}
            ${this._generateMarkupButton('next', curPage + 1)}`;
        }

        // Page 1 and there are no other pages
        return ''; // We are returning an empty string if there is only one page of results so that nothing is rendered to the DOM 
    }

    
}

export default new PaginationView(); // We are exporting an instance of the PaginationView class
