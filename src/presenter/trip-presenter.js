import { render, RenderPosition } from '../framework/render.js';
import NewSortingView from '../view/sorting-view.js';
import TripEventsView from '../view/events-view.js';
import ZeroEventsView from '../view/zero-events-view.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/common.js';


export default class TripEventsPresenter {
  #eventsList = null;
  #tripContainer = null;
  #pointPresenter = new Map();

  #pointsModel = null;
  #tripEvents = [];

  #destinations = null;

  #noEventsComponent = new ZeroEventsView();
  #sortingComponent = new NewSortingView();

  constructor(tripContainer, pointsModel, destinationsModel) {
    this.#eventsList = new TripEventsView();
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#destinations = destinationsModel.destinations;
  }

  init () {
    this.points = [...this.#pointsModel.points];

    if (this.points.length === 0) {
      this.#renderNoEvents();
    } else {
      this.#renderSort();
      this.#renderPoints();
    }
  }

  #renderPoint (point) {
    const pointPresenter = new PointPresenter(this.#eventsList.element, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point, this.#destinations);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderPoints = () => {
    this.#renderEventsList();

    for (let i = 0; i < this.points.length; i++) {
      this.#renderPoint(this.points[i]);
    }
  };

  #renderNoEvents = () => {
    render(this.#noEventsComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #renderSort = () => {
    render(this.#sortingComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #renderEventsList = () => {
    render(this.#eventsList, this.#tripContainer);
  };

  #clearEventsList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #handlePointChange = (updatePoint) => {
    this.#tripEvents = updateItem(this.#tripEvents, updatePoint);
    this.#pointPresenter.get(updatePoint.id).init(updatePoint, this.#destinations);
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };
}
