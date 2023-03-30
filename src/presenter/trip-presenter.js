import {render} from '../render.js';
import NewWaypointView from '../view/waypoint-view.js';
import NewEditFormView from '../view/edit-form-view.js';
import NewSortingView from '../view/sorting-view.js';
import TripEventsView from '../view/events-view.js';
import { isEscapeKey } from '../utils.js';


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

    render(new NewSortingView(), this.#tripContainer);
    render(this.#eventsList, this.#tripContainer);

    for (let i = 0; i < this.points.length; i++) {
      this.#renderPoint(this.points[i]);
    }
  }

  #renderPoint (point) {
    const pointComponent = new NewWaypointView(point, this.#destinations);
    const editingForm = new NewEditFormView(point, this.#destinations);

    const replacePointToEditForm = () => {
      this.#eventsList.element.replaceChild(editingForm.element, pointComponent.element);
    }

    const replaceEditFormToPoint = () => {
      this.#eventsList.element.replaceChild(pointComponent.element, editingForm.element);
    }

    const onDocumentEscapeKeyDown = (evt) => {
      if (isEscapeKey(evt)) {
        evt.preventDefault();
        replaceEditFormToPoint();
      }

      document.removeEventListener('keydown', onDocumentEscapeKeyDown);
    }

    const openEditForm = () => {
      replacePointToEditForm();
      document.addEventListener('keydown', onDocumentEscapeKeyDown);
    }

    const closeEditForm = () => {
      replaceEditFormToPoint();
      document.removeEventListener('keydown', onDocumentEscapeKeyDown);
    }

    const onSubmitEditForm = (evt) => {
      evt.preventDefault();
      closeEditForm();
    }

    const onOpenEditFormButton = () => openEditForm();
    const onCloseEditFormButton = () => closeEditForm();

    const openEditFormButton = pointComponent.element.querySelector('.event__rollup-btn');
    const submitEventButton = editingForm.element;
    const closeEditFormButton = editingForm.element.querySelector('.event__rollup-btn');

    openEditFormButton.addEventListener('click', onOpenEditFormButton);
    closeEditFormButton.addEventListener('click', onCloseEditFormButton);
    submitEventButton.addEventListener('submit', onSubmitEditForm);

    render(pointComponent, this.#eventsList.element);
  }
}
