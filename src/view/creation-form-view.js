import AbstractView from '../framework/view/abstract-view.js';
import flatpickr from 'flatpickr';
import he from 'he';
import { humanizeFormDate } from '../utils/task.js';
import { getOffersByType } from '../utils/common.js';
import { TYPES } from '../mock/constants.js';

import 'flatpickr/dist/flatpickr.min.css';

const fillOffers = (checkedOfferIds, allOffers) => (allOffers.map((offer) => (
  `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden"
      id="event-offer-${offer.id}" type="checkbox" name="event-offer-comfort"
      ${checkedOfferIds.includes(offer.id) ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
  </div>`)).join('')
);

const getOffers = (checkedOffers, allOffers) => {
  if (allOffers.length === 0){
    return '';
  }

  return (`<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${fillOffers(checkedOffers, allOffers)}
    </div>
    </section>`);
};

const getDestinations = (destinations) => (
  `<datalist id="destination-list-1">
      ${destinations.map((item) =>`<option value='${item.name}'></option>`).join('')}
  </datalist>`);

const getDestinationsList = (thisDestination, destinations, type) => {
  const destinationsByType = destinations.find((item) => item.type === type);
  const allDestinatioins = destinationsByType ? destinationsByType : destinations;

  return(
    `<div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-1">
    ${type}
    </label>
    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value='${he.encode(thisDestination)}' list="destination-list-1">
    ${getDestinations(allDestinatioins)}
    </div>`);
};

const getEventTypesList = (currentType) => (
  TYPES.map((eventType) => {
    const isChecked = eventType === currentType ? 'checked' : '';

    return (
      `<div class="event__type-item">
        <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden"
        type="radio" name="event-type" value="${eventType}" ${isChecked}>
          <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${eventType}</label>
      </div>`);
  }).join('')
);

const getPhotos = (items) => {
  if (items === null){
    return '';
  }

  const photos = items.map((item) => `<img class="event__photo" src='${item.src}' alt='${item.description}'></img>`).
    join('');

  return (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
      ${photos}
      </div>
    </div>`);
};

const getDestinationBlock = (destination) => {
  const description = destination.description !== null ? destination.description : '';

  return(
    `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${description}</p>
    ${getPhotos(destination.pictures)}
    </section>`);
};

const createNewFormTemplate = (form, allDestinations, offersByType) => {
  const {basePrice, dateFrom, dateTo, destination, offers, type} = form;

  const offersBlock = getOffers(offers, offersByType.offers);
  const isSubmitDisabled = dateFrom === null || dateTo === null;
  const eventTypesList = getEventTypesList(type);

  const humanizedDateFrom = humanizeFormDate(dateFrom);
  const humanizedDateTo = humanizeFormDate(dateTo);

  const currentDestination = allDestinations.find((item) => item.id === destination);
  const destinationBlock = currentDestination.description === null && currentDestination.pictures === null
    ? ''
    : getDestinationBlock(currentDestination);

  const availableDestinations = getDestinationsList(currentDestination.name, allDestinations, type);

  return(
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
        <div class="event__type-list">
          <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${eventTypesList}
          </fieldset>
        </div>
      </div>
      ${availableDestinations}
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value='${humanizedDateFrom}'>
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value='${humanizedDateTo}'>
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value=${basePrice}>
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit" ${isSubmitDisabled ? 'disabled' : ''}>Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      ${offersBlock}
      ${destinationBlock}
    </section>
  </form>
</li>`
  );
};

export default class NewFormView extends AbstractView {
  _state = null;
  #destinations = null;
  #allOffers = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #offersByType = null;

  constructor(form, allDestinatioins, allOffers){
    super();
    this._state = NewFormView.parseFormToState(form);
    this.#destinations = allDestinatioins;
    this.#allOffers = allOffers;
    this.#offersByType = getOffersByType(this.#allOffers, this._state.type);

    this.#setInnerHandlers();
    this.#setDatepickerFrom();
    this.#setDatepickerTo();
  }

  get template () {
    return createNewFormTemplate();
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepickerFrom && this.#datepickerTo) {
      this.#datepickerFrom.destroy();
      this.#datepickerTo.destroy();

      this.#datepickerFrom = null;
      this.#datepickerTo = null;
    }
  };

  reset = (point) => {
    this.updateElement(
      NewFormView.parseFormToState(point),
    );
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.addEventListener('submit', this.#formSubmitHandler);
  };

  setFormCloseHandler = (callback) => {
    this._callback.formClose = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formCloseHandler);
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFormCloseHandler(this._callback.formClose);
    this.#setDatepickerFrom();
    this.#setDatepickerTo();
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-list').addEventListener('click', this.#pointTypeClickHandler);

    if(this.#offersByType.offers.length > 0) {
      this.element.querySelector('.event__available-offers').addEventListener('click', this.#offersClickHandler);
      this.element.querySelector('.event__input--destination').addEventListener('input', this.#destinationInputHandler);
    }
  };

  #setDatepickerFrom = () => {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        defaultDate: this._state.dateFrom,
        minDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
      },
    );
  };

  #setDatepickerTo = () => {
    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: this.#dateToChangeHandler,
      },
    );
  };

  #dateFromChangeHandler = ([date]) => {
    this.updateElement({
      dateFrom: date,
    });
  };

  #dateToChangeHandler = ([date]) => {
    this.updateElement({
      dateTo: date,
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(NewFormView.parseStateToForm(this._state));
  };

  #formCloseHandler = (evt) => {
    evt.preventDefault();
    this._callback.formClose();
  };

  #pointTypeClickHandler = (evt) => {
    if(evt.target.tagName === 'INPUT'){
      this.updateElement({
        type: evt.target.value,
      });
    }
  };

  #offersClickHandler = (evt) => {
    if(evt.target.tagName === 'INPUT') {
      evt.preventDefault();

      const newOfferId = Number(evt.target.id.slice(-1));

      if(this._state.offers.includes(newOfferId)) {
        this._state.offers = this._state.offers.filter((id) => id !== newOfferId);
      }
      else {
        this._state.offers.push(newOfferId);
      }

      this.updateElement({
        offers: this._state.offers,
      });
    }
  };

  #destinationInputHandler = (evt) => {
    evt.preventDefault();

    const newDestination = this.#destinations.find((item) => item.name === evt.target.value);

    if(newDestination){
      this.updateElement({
        destination: newDestination.id,
      });
    }
  };

  static parseFormToState = (form) => ({...form});
  static parseStateToForm = (state) => ({...state});
}
