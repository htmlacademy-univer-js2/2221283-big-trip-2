import Observable from '../framework/observable.js';
import { generatePoint } from '../mock/point.js';
import { getRandomNumber } from '../utils/common.js';
import { MIN_POINTS_COUNT, MAX_POINTS_COUNT } from '../mock/constants.js';
import { allOffers } from '../mock/offers.js';
import { destinations } from '../mock/destination.js';

export default class PointsModel extends Observable {
  #points = null;
  #offers = null;
  #destinations = null;

  constructor () {
    super();
    this.#points = Array.from({length: getRandomNumber(MIN_POINTS_COUNT, MAX_POINTS_COUNT)}, generatePoint);
    this.#offers = allOffers;
    this.#destinations = destinations;
  }

  get points () {
    return this.#points;
  }

  get destinations () {
    return this.#destinations;
  }

  get offers () {
    return this.#offers;
  }

  updatePoint = (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  };

  addPoint = (updateType, update) => {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  };

  deletePoint = (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  };
}
