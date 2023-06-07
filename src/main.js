import NewFilterView from './view/filter-view';
import TripEventsPresenter from './presenter/trip-presenter';
import { render } from './framework/render';
import PointsModel from './model/points-model';
import { generateFilter } from './mock/filter';

const pointsModel = new PointsModel();
const filters = generateFilter(pointsModel.points);

const siteHeaderElement = document.querySelector('.trip-main');
const siteMainElement = document.querySelector('.page-main');
const siteFilters = siteHeaderElement.querySelector('.trip-controls__filters');
const siteEvents = siteMainElement.querySelector('.trip-events');
const TripPresenter = new TripEventsPresenter(siteEvents, pointsModel);

render(new NewFilterView(filters), siteFilters);

TripPresenter.init();
