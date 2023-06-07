import { generatePoint } from '../mock/point.js';
import { getRandomNumber } from '../utils/common.js';
import { MIN_POINTS_COUNT, MAX_POINTS_COUNT } from '../mock/constants.js';
import { allOffers } from '../mock/offers.js';
import { destinations } from '../mock/destination.js';

export default class PointsModel{
  #points = null;
  #offers = null;
  #destinations = null;

  constructor () {
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
}
