import {render} from '../render.js';
import NewWaypointView from '../view/waypoint-view.js';
import NewEditFormView from '../view/edit-form-view.js';
import NewSortingView from '../view/sorting-view.js';
import NewCreationFormView from '../view/creation-form-view.js';
import TripEventsView from '../view/events-view.js';


export default class TripEventsPresenter {
  constructor() {
    this.eventsList = new TripEventsView();
  }

  init (tripContainer) {
    this.tripContainer = tripContainer;

    render(new NewSortingView(), this.tripContainer);
    render(this.eventsList, this.tripContainer);
    render(new NewEditFormView(), this.eventsList.getElement());

    for (let i = 0; i < 3; i++) {
      render(new NewWaypointView(), this.eventsList.getElement());
    }

    render(new NewCreationFormView(), this.eventsList.getElement());
  }
}
