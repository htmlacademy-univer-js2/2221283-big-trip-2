import { createElement } from '../render.js';

const createZeroEventsTemplate = () => (
  '<p class="trip-events__msg">Click New Event to create your first point</p>'
);

export default class ZeroEventsView {
  #element = null;

  get template () {
    return createZeroEventsTemplate;
  }

  get element() {
    if (!this.#element){
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
