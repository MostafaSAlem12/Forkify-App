import * as model from './model'
import { MODAL_CLOSE_SECONDS } from './config';
import recipeView from './views/recipeView.js';
import SearchView from './views/searchView'
import resultsView from './views/resultsView'
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';
// import icons from '../img/icons.svg';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import searchView from './views/searchView';

// if (module.hot) {
//   module.hot.accept();
// }

const recipeContainer = document.querySelector('.recipe');



// https://forkify-api.herokuapp.com/v2
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();


    //0) udpate resultsView to mark selected search results
    resultsView.update(model.getSearchResultPage())
    //1)updating bookmarks view 
    bookmarksView.update(model.state.bookmarks);

    //2) loading recipe
    await model.loadRecipe(id);
    // const { recipe } = model.state


    //3) Rendering recipe
    recipeView.render(model.state.recipe);
    // const recipeView= new recipeView(model.state.recipe)

  } catch (err) {
    // alert(err)
    recipeView.renderError();
  }

};
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner()
    //get search query
    const query = SearchView.getQuery();
    if (!query) return;


    //2) load search results
    await model.loadSearchResult(query)

    //3) render results
    // resultsView.render(model.state.search.results)
    resultsView.render(model.getSearchResultPage())

    // 4)Render intial pagenation buttons
    paginationView.render(model.state.search);

  } catch (err) {
    console.log(err);
  }
}

const controlPagination = function (goToPage) {
  //3) render new results
  // resultsView.render(model.state.search.results)
  resultsView.render(model.getSearchResultPage(goToPage))

  // 4)Render new pagenation buttons
  paginationView.render(model.state.search);
}

const controlServings = function (newServings) {
  // update the recipe servings (in state)
  model.updateServings(newServings)


  //update the recipe view 
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}
// adding new bookmark
const controlAddBookmark = function () {
  // 1) add or remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe)
  } else { model.deletBookmark(model.state.recipe.id) }

  // 2) update recipe view 
  console.log(model.state.recipe);
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks)
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading spinner 
    addRecipeView.renderSpinner();
    // upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render recipe 
    recipeView.render(model.state.recipe);

    //sucess messege
    addRecipeView.renderMessege();

    //render bookmark view 
    bookmarksView.render(model.state.bookmarks);

    //change id in url 
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form window 
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SECONDS * 1000)
  } catch (err) {
    console.error('❌❌❌', err)
    addRecipeView.renderError(err.message);
  }
}

// controlRecipes();
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}
init()
