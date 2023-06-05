import { humanizeFormDate } from '../utils/task.js';
import { getOffersByType } from '../utils/common.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const fillOffersList = (checkedItems, allOffers) =>
  (allOffers.map((offer) => (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden"
      id="event-offer-${offer.id}" type="checkbox" name="event-offer-comfort"
      ${checkedItems.find((checkedOffer) => checkedOffer.id === offer.id) ? 'checked' : ''}>
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
      ${fillOffersList(checkedOffers, allOffers)}
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
    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value='${thisDestination}' list="destination-list-1">
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
  const {basePrice, dateFrom, dateTo, destination, offers, type} = form;

  const allOffers = getOffers(offers.offers, offersByType.offers);

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
      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
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

  constructor(form, allDestinatioins, allOffers) {
    super();
    this.#destinations = allDestinatioins;
    this._state = EditingFormView.parseFormToState(form);
    this.#allOffers = allOffers;
    this.#offersByType = getOffersByType(allOffers, this._state.type);

    this.#setInnerHandlers();
  }

  get template () {
    return createEditingFormTemplate(this._state, this.#destinations, this.#offersByType);
  }

  reset = (point) => {
    this.updateElement(EditingFormView.parseFormToState(point));
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
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-list').addEventListener('click', this.#pointTypeClickHandler);

    if(this.#offersByType.length > 0){
      this.element.querySelector('.event__available-offers').addEventListener('click', this.#offersClickHandler);
    }

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

  #pointTypeClickHandler = (evt) => {
    if(evt.target.tagName === 'INPUT'){
      this.updateElement({
        type: evt.target.value,
      });
    }
  };

  #offersClickHandler = (evt) => {
    if(evt.target.tagName === 'INPUT'){
      evt.preventDefault();

      const newOffer = this.#offersByType.find((offer) => offer.id === Number(evt.target.id.slice(-1))).id;

      if(this._state.offers.includes(newOffer)) {
        this._state.offers = this._state.offers.filter((n) => n !== Number(evt.target.id.slice(-1)));
      }
      else {
        this._state.offers.push(Number(evt.target.id.slice(-1)));
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
