import AbstractView from '../framework/view/abstract-view';
import { FilterType } from '../const';

const NoPointsMessageType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future points now',
  [FilterType.PAST]: 'There are no past points today'
};

const createZeroEventsTemplate = (filterType) => {
  const noPointsValue = NoPointsMessageType[filterType];
  return (
    `<p class="trip-events__msg">${noPointsValue}</p>`
  );
};

export default class ZeroEventsView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template () {
    return createZeroEventsTemplate(this.#filterType);
  }
}
