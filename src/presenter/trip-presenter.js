import { render, replace } from '../framework/render.js';
import NewWaypointView from '../view/waypoint-view.js';
import NewEditFormView from '../view/edit-form-view.js';
import NewSortingView from '../view/sorting-view.js';
import TripEventsView from '../view/events-view.js';
import ZeroEventsView from '../view/zero-events-view.js';
import { isEscapeKey } from '../utils/common.js';


export default class TripEventsPresenter {
  #eventsList = null;
  #tripContainer = null;
  #pointsModel = null;
  #destinations = null;

  constructor(tripContainer, pointsModel, destinationsModel) {
    this.#eventsList = new TripEventsView();
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#destinations = destinationsModel.destinations;
  }

  init () {
    this.points = [...this.#pointsModel.points];

    if (this.points.length === 0) {
      render(new ZeroEventsView(), this.#tripContainer);
    } else {
      render(new NewSortingView(), this.#tripContainer);
      render(this.#eventsList, this.#tripContainer);

      for (let i = 0; i < this.points.length; i++) {
        this.#renderPoint(this.points[i]);
      }
    }
  }

  #renderPoint (point) {
    const pointComponent = new NewWaypointView(point, this.#destinations);
    const editingForm = new NewEditFormView(point, this.#destinations);

    const replacePointToEditForm = () => {
      replace(editingForm, pointComponent);
    };

    const replaceEditFormToPoint = () => {
      replace(pointComponent, editingForm);
    };

    const onDocumentEscapeKeyDown = (evt) => {
      if (isEscapeKey(evt)) {
        evt.preventDefault();
        replaceEditFormToPoint();
      }

      document.removeEventListener('keydown', onDocumentEscapeKeyDown);
    };

    const openEditForm = () => {
      replacePointToEditForm();
      document.addEventListener('keydown', onDocumentEscapeKeyDown);
    };

    const closeEditForm = () => {
      replaceEditFormToPoint();
      document.removeEventListener('keydown', onDocumentEscapeKeyDown);
    };

    pointComponent.setClickHandler(openEditForm);
    editingForm.setClickHandler(closeEditForm);
    editingForm.setFormSubmitHandler(closeEditForm);

    render(pointComponent, this.#eventsList.element);
  }
}
