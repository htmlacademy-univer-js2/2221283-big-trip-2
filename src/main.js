import NewFilterView from './view/filter-view';
import TripEventsPresenter from './presenter/trip-presenter';
import { render } from './framework/render';
import PointsModel from './model/points-model';
import DestinationModel from './model/destinations-model';

const pointsModel = new PointsModel();
const destinationsModel = new DestinationModel();

const siteHeaderElement = document.querySelector('.trip-main');
const siteMainElement = document.querySelector('.page-main');
const siteFilters = siteHeaderElement.querySelector('.trip-controls__filters');
const siteEvents = siteMainElement.querySelector('.trip-events');
const TripPresenter = new TripEventsPresenter(siteEvents, pointsModel, destinationsModel);

render(new NewFilterView(), siteFilters);

TripPresenter.init();
