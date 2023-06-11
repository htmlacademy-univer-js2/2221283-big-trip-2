import {render, replace, remove, RenderPosition} from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import TripInfoView from '../view/trip-info-view.js';
import {filter} from '../utils/filter.js';
import {FilterType, UpdateType} from '../const.js';
import { sortPointByDay } from '../utils/task.js';
import { getOffersByType } from '../utils/common.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #filterComponent = null;
  #infoComponent = null;

  constructor(filterContainer, filterModel, pointsModel, offersModel, destinationsModel) {
    this.#filterContainer = filterContainer;

    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const points = this.#pointsModel.points;

    return [
      {
        type: FilterType.EVERYTHING,
        name: 'EVERYTHING',
        count: filter[FilterType.EVERYTHING](points).length,
      },
      {
        type: FilterType.FUTURE,
        name: 'FUTURE',
        count: filter[FilterType.FUTURE](points).length,
      },
      {
        type: FilterType.PAST,
        name: 'PAST',
        count: filter[FilterType.PAST](points).length,
      }
    ];
  }

  get destinations() {
    return this.#destinationsModel.destinations;
  }

  get offers () {
    return this.#offersModel.offers;
  }

  get points() {
    return this.#pointsModel.points.sort(sortPointByDay);
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(filters, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);

    this.#renderTripInfo();
  };

  #getTotalTripPrice(tripEvents) {
    let totalPrice = 0;

    tripEvents.forEach((point) => {
      totalPrice += point.basePrice;

      const currentOffers = getOffersByType(this.offers, point.type).offers;

      point.offers.forEach((offer) => {
        totalPrice += currentOffers.find((currentOffer) => currentOffer.id === offer).price;
      });
    });

    return totalPrice;
  }

  #updateInfo = () => {
    if(this.points) {
      this.#infoComponent = new TripInfoView (this.points, this.#getTotalTripPrice(this.points), this.destinations);
    }
  };

  #renderTripInfo = () => {
    const previousInfoComponent = this.#infoComponent;

    if(this.points.length && this.offers.length && this.destinations.length) {
      this.#updateInfo();
    }

    if(previousInfoComponent) {
      replace(this.#infoComponent, previousInfoComponent);
      remove(previousInfoComponent);
    }
    else if(this.#infoComponent)
    {
      render(this.#infoComponent, this.#filterContainer, RenderPosition.AFTERBEGIN);
    }
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
