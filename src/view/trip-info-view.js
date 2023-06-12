import AbstractView from '../framework/view/abstract-view.js';
import { humanizeFormDate } from '../utils/task.js';

const TWO_TITLE_POINTS = 2;
const THREE_TITLE_POINTS = 3;

const getTripInfoTitle = (tripPoints, destinations) => {
  const firstDestination = destinations.find((place) => place.id === tripPoints[0].destination).name;
  const lastDestination = destinations.find((place) => place.id === tripPoints[tripPoints.length - 1].destination).name;
  switch(tripPoints.length) {
    case 1:
      return firstDestination;

    case TWO_TITLE_POINTS:
      return `${firstDestination} &mdash; ${lastDestination}`;

    case THREE_TITLE_POINTS:
      return `${firstDestination} &mdash; ${destinations.find((place) => place.id === tripPoints[1].destination).name} &mdash; ${lastDestination}`;

    default:
      return `${firstDestination} &mdash; . . . &mdash; ${lastDestination}`;
  }
};

const createTripInfoTemplate = (tripEvents, tripPrice, destinations) => (
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getTripInfoTitle(tripEvents, destinations)}</h1>
      <p class="trip-info__dates">${humanizeFormDate(tripEvents[0].dateFrom, 'MMM D')}&nbsp;&mdash;&nbsp;
      ${humanizeFormDate(tripEvents[tripEvents.length - 1].dateTo, 'MMM D')}</p>
    </div>
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripPrice}</span>
    </p>
  </section>`
);

export default class TripInfoView extends AbstractView {
  #tripPoints;
  #tripPrice;
  #destinations;

  constructor(tripEvents, tripPrice, destinations) {
    super();
    this.#tripPoints = tripEvents;
    this.#tripPrice = tripPrice;
    this.#destinations = destinations;
  }

  get template() {
    return createTripInfoTemplate(this.#tripPoints, this.#tripPrice, this.#destinations);
  }
}
