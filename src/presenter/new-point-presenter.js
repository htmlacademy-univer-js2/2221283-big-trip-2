import dayjs from 'dayjs';
import NewFormView from '../view/creation-form-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { isEscapeKey } from '../utils/common.js';
import { UserAction, UpdateType, TYPES} from '../const.js';

export default class NewPointPresenter {
  #pointsListContainer = null;
  #newPointComponent = null;
  #changeData = null;
  #deleteCallback = null;
  #offers = null;
  #destinations = null;

  constructor (eventsListContainer, changeData, destinations, offers) {
    this.#pointsListContainer = eventsListContainer;
    this.#changeData = changeData;

    this.#offers = offers;
    this.#destinations = destinations;
  }

  init = (callback) => {
    this.#deleteCallback = callback;

    if (this.#newPointComponent !== null) {
      return;
    }

    this.#newPointComponent = new NewFormView(this.#getBlankForm(), this.#destinations, this.#offers);

    this.#newPointComponent.setFormSubmitHandler(this.#onFormSubmitClick);
    this.#newPointComponent.setDeleteClickHandler(this.#onDeleteButtonClick);

    render(this.#newPointComponent, this.#pointsListContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#onEscKeyDownClick);
  };

  destroy = () => {
    if (this.#newPointComponent === null) {
      return;
    }

    this.#deleteCallback?.();

    remove(this.#newPointComponent);
    this.#newPointComponent = null;

    document.removeEventListener('keydown', this.#onEscKeyDownClick);
  };

  #getBlankForm = () => ({
    'basePrice': 0,
    'dateFrom': dayjs().toDate(),
    'dateTo': dayjs().toDate(),
    'destination': this.#destinations[0].id,
    'isFavourite': false,
    'offers': [],
    'type': TYPES[0],
  });

  setSaving() {
    this.#newPointComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#newPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#newPointComponent.shake(resetFormState);
  }

  #onFormSubmitClick = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );

    this.destroy();
  };

  #onDeleteButtonClick = () => this.destroy();

  #onEscKeyDownClick = (evt) => {
    if (isEscapeKey(evt)){
      evt.preventDefault();
      this.destroy();
    }
  };
}
