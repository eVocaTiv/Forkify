import Search from './model/Search';
import * as searchView from './view/searchView';
import * as recipeView from './view/recipeView';
import { elements, renderLoader, clearLoader } from './view/base';
import Recipe from './model/Recipe';


// GLOBAL STATE OF THE APP.
/**
 *  - Search Object
 *  - Current recipe object
 *  - Shopping list object
 *  - Liked recipes
 */
const state = {};

const controlSearch = async () => {
    // 1. Get query from view
    console.log('searching...')
    const query = searchView.getInput();
    if (query) {
        // 2. New search object - add to state 
        state.search = new Search(query);

        // 3. Prepare UI for results
        searchView.clearResults();
        searchView.clearInput();
        renderLoader(elements.searchRes);

        try {
            // 4. Search for recipes
            await state.search.getResults();
            console.log(state.search);

            // 5. Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (e) {
            alert(' Something went wrong with the search');
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

// RECIPE CONTROLLER

const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        recipeView.clearRecipe(); 
        renderLoader(elements.recipe);
        // prepare ui for changes

        //highlight selected
        if ( state.search )
        searchView.highlightSelected(id);

        // create new recipe object
        state.recipe = new Recipe(id);

        try {
            // get recipe data
            await state.recipe.getRecipe();
            console.log(state.recipe);
            
            // calculate servings and time 
            
            state.recipe.calcTime();
            state.recipe.calcServings();
            state.recipe.parseIng();

            await clearLoader();
            console.log(state.recipe);
            recipeView.renderRecipe(state.recipe); 
        } catch (e) {
            alert('Error processing recipe');
        }

        // render recipe
    }
}

['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));