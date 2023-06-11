import { humanizeFormDate } from '../utils/task.js';
import { getOffersByType } from '../utils/common.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import he from 'he';

import 'flatpickr/dist/flatpickr.min.css';


const fillOffersList = (checkedItemsIds, allOffers, isDisabled) =>
  (allOffers.map((offer) => (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden"
      id="event-offer-${offer.id}" type="checkbox" name="event-offer-comfort"
      ${checkedItemsIds.includes(offer.id) ? 'checked' : ''}
      ${isDisabled ? 'disabled' : ''}>
      <label class="event__offer-label" for="event-offer-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`)).join('')
  );

const getOffers = (checkedOffers, allOffers, isDisabled) => {
  if (allOffers.length === 0){
    return '';
  }

  return (`<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${fillOffersList(checkedOffers, allOffers, isDisabled)}
    </div>
    </section>`);
};

const getAvailableDestinations = (destinations) => (
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
    ${getAvailableDestinations(allDestinatioins)}
    </div>`);
};

const getPhotosBlock = (items) => {
  if (items === null){
    return '';
  }

  const photos = items.map((item) =>
    `<img class="event__photo" src='${item.src}' alt='${item.description}'></img>`).join('');

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
    ${getPhotosBlock(destination.pictures)}
    </section>`);
};

const createEditingFormTemplate = (form, allDestinations, offersByType) => {
  const {
    basePrice,
    dateFrom,
    dateTo,
    destination,
    isDisabled,
    isSaving,
    isDeleting,
    offers,
    type
  } = form;

  const allOffers = getOffers(offers, offersByType.offers, isDisabled);

  const humanizedDateFrom = humanizeFormDate(dateFrom);
  const humanizedDateTo = humanizeFormDate(dateTo);

  const isSubmitDisabled = dateFrom === null || dateTo === null || basePrice === 0;

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
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox"
        ${isDisabled ? 'disabled' : ''}>
        <div class="event__type-list" ${isDisabled ? 'disabled' : ''}>
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            <div class="event__type-item">
              <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
              <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
            </div>
            <div class="event__type-item">
              <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
              <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
            </div>
            <div class="event__type-item">
              <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
              <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
            </div>
            <div class="event__type-item">
              <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
              <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
            </div>
            <div class="event__type-item">
              <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
              <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
            </div>
            <div class="event__type-item">
              <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
              <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
            </div>
            <div class="event__type-item">
              <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
              <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
            </div>
            <div class="event__type-item">
              <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
              <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
            </div>
            <div class="event__type-item">
              <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
              <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
            </div>
          </fieldset>
        </div>
      </div>
      ${availableDestinations}
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text"
        ${isDisabled ? 'disabled' : ''}
        name="event-start-time" value='${humanizedDateFrom}'>
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text"
        ${isDisabled ? 'disabled' : ''}
        name="event-end-time" value='${humanizedDateTo}'>
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value=${basePrice}
        ${isDisabled ? 'disabled' : ''}>
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit"
      ${isSubmitDisabled || isDisabled ? 'disabled' : ''}>
      ${isSaving ? 'Saving...' : 'Save'}</button>
      <button class="event__reset-btn" type="reset">
      ${isDeleting ? 'Deleting...' : 'Delete'}</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      ${allOffers}
      ${destinationBlock}
    </section>
  </form>
</li>`
  );
};

export default class EditingFormView extends AbstractStatefulView {
  _state = null;
  #destinations = null;
  #allOffers = null;
  #offersByType = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor(form, allDestinatioins, allOffers) {
    super();
    this.#destinations = allDestinatioins;
    this._state = EditingFormView.parseFormToState(form);
    this.#allOffers = allOffers;
    this.#offersByType = getOffersByType(this.#allOffers, this._state.type);

    this.#setInnerHandlers();
    this.#setDatepickerFrom();
    this.#setDatepickerTo();
  }

  get template () {
    return createEditingFormTemplate(this._state, this.#destinations, this.#offersByType);
  }

  removeElement() {
    super.removeElement();

    if(this.#datepickerFrom && this.#datepickerTo) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;

      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  reset = (point) => {
    this.updateElement(EditingFormView.parseFormToState(point));
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
      dateFrom: date
    });
  };

  #dateToChangeHandler = ([date]) => {
    this.updateElement({
      dateTo: date
    });
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.addEventListener('submit', this.#formSubmitHandler);
  };

  setFormCloseHandler = (callback) => {
    this._callback.formClose = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formCloseHandler);
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();

    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFormCloseHandler(this._callback.formClose);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.#setDatepickerFrom();
    this.#setDatepickerTo();
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-list').addEventListener('click', this.#pointTypeClickHandler);

    if(this.#offersByType.offers.length > 0){
      this.element.querySelector('.event__available-offers').addEventListener('click', this.#offersClickHandler);
    }

    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceInputHandler);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#destinationInputHandler);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(EditingFormView.parseStateToForm(this._state));
  };

  #formCloseHandler = (evt) => {
    evt.preventDefault();
    this._callback.formClose();
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(EditingFormView.parseStateToForm(this._state));
  };

  #updateOffersByType(newType) {
    this.#offersByType = getOffersByType(this.#allOffers, newType);
  }

  #pointTypeClickHandler = (evt) => {
    if(evt.target.tagName === 'INPUT') {
      this.#updateOffersByType(evt.target.value);
      this.updateElement({
        type: evt.target.value,
        offers: []
      });
    }
  };

  #offersClickHandler = (evt) => {
    if(evt.target.tagName === 'INPUT'){
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

  #priceInputHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      basePrice: Math.abs(Number(evt.target.value.replace(/[^\d]/g, ''))),
    });
  };

  static parseFormToState = (form) => ({...form,
    isDisabled: false,
    isSaving: false,
    isDeleting: false
  });

  static parseStateToForm = (state) => {
    delete state.isDisabled;
    delete state.isSaving;
    delete state.isDeleting;

    return state;
  };
}
