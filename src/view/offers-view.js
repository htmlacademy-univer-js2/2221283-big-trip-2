import { createElement } from '../render.js';

const createOffersTemplate = (offers) => (
  `<ul class="event__selected-offers">
  ${offers}
  </ul>`
);

export default class OffersView {
  constructor(offers){
    this.offers = offers;
  }

  getTemplate () {
    return createOffersTemplate(this.offers);
  }

  getElement() {
    if (!this.element){
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
