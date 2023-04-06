import AbstractView from '../framework/view/abstract-view';

const createZeroEventsTemplate = () => (
  '<p class="trip-events__msg">Click New Event to create your first point</p>'
);

export default class ZeroEventsView extends AbstractView {
  get template () {
    return createZeroEventsTemplate;
  }
}
