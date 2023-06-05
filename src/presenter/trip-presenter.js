import { render, RenderPosition } from '../framework/render.js';
import NewSortingView from '../view/sorting-view.js';
import TripEventsView from '../view/events-view.js';
import ZeroEventsView from '../view/zero-events-view.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/common.js';
import { sortPointByDay, sortPointByPrice, sortPointByTime } from '../utils/task.js';
import { SortType } from '../const.js';

export default class TripEventsPresenter {
  #eventsList = null;
  #tripContainer = null;
  #pointPresenter = new Map();
  #currentSortType = SortType.DAY;
  #sourcedPoints = [];

  #pointsModel = null;
  #tripEvents = [];
  #points = [];

  #destinations = null;
  #offers = null;

  #noEventsComponent = new ZeroEventsView();
  #sortingComponent = new NewSortingView(this.#currentSortType);

  constructor(tripContainer, pointsModel, destinationsModel, offersModel) {
    this.#eventsList = new TripEventsView();
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#destinations = destinationsModel.destinations;
    this.#offers = offersModel.offers;
  }

  init () {
    this.#sourcedPoints = [...this.#pointsModel.points].sort(sortPointByDay);
    this.#points = [...this.#pointsModel.points].sort(sortPointByDay);

    if (this.#points.length === 0) {
      this.#renderNoEvents();
    } else {
      this.#renderSort();
      this.#renderPoints();
    }
  }

  #renderPoint (point) {
    const pointPresenter = new PointPresenter(this.#eventsList.element, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point, this.#destinations, this.#offers);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderPoints = () => {
    this.#renderEventsList();

    for (let i = 0; i < this.#points.length; i++) {
      this.#renderPoint(this.#points[i]);
    }
  };

  #renderNoEvents = () => {
    render(this.#noEventsComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.PRICE:
        this.#points.sort(sortPointByPrice);
        break;

      case SortType.TIME:
        this.#points.sort(sortPointByTime);
        break;

      default:
        this.#points.sort(sortPointByDay);
    }

    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearEventsList();
    this.#renderPoints();
  };

  #renderSort = () => {
    render(this.#sortingComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
    this.#sortingComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
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
    this.#sourcedPoints = updateItem(this.#sourcedPoints, updatePoint);

    this.#pointPresenter.get(updatePoint.id).init(updatePoint, this.#destinations, this.#offers);
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };
}
