import NewWaypointView from '../view/waypoint-view.js';
import NewEditFormView from '../view/edit-form-view.js';
import { render, replace, remove } from '../framework/render.js';
import { isEscapeKey } from '../utils/common.js';
import { UserAction, UpdateType } from '../const.js';
import { isDatesEqual } from '../utils/task.js';

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

  init = (point, destinations, offers) => {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new NewWaypointView(point, destinations, offers);
    this.#pointEditComponent = new NewEditFormView(point, destinations, offers);

    this.#pointComponent.setClickHandler(this.#onEditFormClick);
    this.#pointComponent.setFavoriteClickHandler(this.#onFavoriteButtonClick);

    this.#pointEditComponent.setFormSubmitHandler(this.#onEditFormSubmitClick);
    this.#pointEditComponent.setFormCloseHandler(this.#onCloseEditFormClick);
    this.#pointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

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

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#onCloseEditFormClick();
    }
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  };

  #onCloseEditFormClick = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceEditFormToPoint();
    document.removeEventListener('keydown', this.OnEscKeyClick);
  };

  #replaceEditFormToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    this.#mode = Mode.DEFAULT;
  };

  #replacePointToEditForm = () => {
    replace(this.#pointEditComponent, this.#pointComponent);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #OnEscKeyClick = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#onCloseEditFormClick();
    }
  };

  #onEditFormClick = () => {
    this.#replacePointToEditForm();
    document.addEventListener('keydown', this.#OnEscKeyClick);
  };

  #onFavoriteButtonClick = () => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavourite: !this.#point.isFavorite},
    );
  };

  #onEditFormSubmitClick = (update) => {
    const isMinorUpdate = !isDatesEqual(this.#point.dateTo, update.dateTo)
    || !isDatesEqual(this.#point.dateFrom, update.dateFrom)
    || this.#point.basePrice !== update.basePrice;

    this.#changeData(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
    this.#replaceEditFormToPoint();
    document.removeEventListener('keydown', this.#OnEscKeyClick);
  };

  #handleDeleteClick = (point) => {
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
    document.removeEventListener('keydown', this.#OnEscKeyClick);
  };
}
