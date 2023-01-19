import icons from 'url:../../img/icons.svg';
import View from './View.js';
import previewView from './previewView.js';
class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessege = `No recipes found for your query! Please try again ;)`;
  _messege = '';

  _generateMarkup() {
    // console.log(this._data)
    return this._data.map(result => previewView.render(result, false)).join('')

  }
}
export default new ResultsView();