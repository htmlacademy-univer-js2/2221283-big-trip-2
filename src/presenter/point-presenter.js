import NewWaypointView from '../view/waypoint-view.js';
import NewEditFormView from '../view/edit-form-view.js';
import { render, replace, remove } from '../framework/render.js';
import { isEscapeKey } from '../utils/common.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  #pointListContainer = null;
  #point = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #changeData = null;
  #changeMode = null;

  #mode = Mode.DEFAULT;

  constructor(pointListContainer, changeData, changeMode) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point, destinations) => {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new NewWaypointView(point, destinations);
    this.#pointEditComponent = new NewEditFormView(point, destinations);

    this.#pointComponent.setClickHandler(this.#openEditForm);
    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    this.#pointEditComponent.setClickHandler(this.#closeEditForm);
    this.#pointEditComponent.setFormSubmitHandler(this.#onEditFormSubmit);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  };

  #replacePointToEditForm = () => {
    replace(this.#pointEditComponent, this.#pointComponent);
  };

  #replaceEditFormToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#closeEditForm();
    }
  };

  #onDocumentEscapeKeyDown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#replaceEditFormToPoint();
    }

    document.removeEventListener('keydown', this.#onDocumentEscapeKeyDown);
  };

  #openEditForm = () => {
    this.#replacePointToEditForm();
    document.addEventListener('keydown', this.#onDocumentEscapeKeyDown);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #handleFavoriteClick = () => {
    this.#changeData({...this.#point, isFavourite: !this.#point.isFavourite});
  };

  #closeEditForm = () => {
    this.#replaceEditFormToPoint();
    document.removeEventListener('keydown', this.#onDocumentEscapeKeyDown);
    this.#mode = Mode.DEFAULT;
  };

  #onEditFormSubmit = (point) => {
    this.#changeData(point);
    this.#replaceEditFormToPoint();
    document.removeEventListener('keydown', this.#onDocumentEscapeKeyDown);
  };
}
