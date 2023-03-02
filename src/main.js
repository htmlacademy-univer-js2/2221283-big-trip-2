import NewFilterView from './view/filter-view';
import TripEventsPresenter from './presenter/trip-presenter';
import { render } from './render';

const siteHeaderElement = document.querySelector('.trip-main');
const siteMainElement = document.querySelector('.page-main');
const siteFilters = siteHeaderElement.querySelector('.trip-controls__filters');
const siteEvents = siteMainElement.querySelector('.trip-events');
const TripPresenter = new TripEventsPresenter();

render(new NewFilterView(), siteFilters);

TripPresenter.init(siteEvents);
