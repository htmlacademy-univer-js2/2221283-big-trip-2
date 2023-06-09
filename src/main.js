import TripEventsPresenter from './presenter/trip-presenter';
import FilterPresenter from './presenter/filter-presenter';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model';

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.trip-main');
const siteMainElement = document.querySelector('.page-main');
const siteFilters = siteHeaderElement.querySelector('.trip-controls__filters');
const siteEvents = siteMainElement.querySelector('.trip-events');
const newPointButton = siteHeaderElement.querySelector('.trip-main__event-add-btn');

const tripPresenter = new TripEventsPresenter(siteEvents, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(siteFilters, filterModel, pointsModel);

const onNewPointCloseClick = () => {
  newPointButton.disabled = false;
};

const onNewPointButtonClick = () => {
  tripPresenter.createPoint(onNewPointCloseClick);
  newPointButton.disabled = true;
};

newPointButton.addEventListener('click', onNewPointButtonClick);

tripPresenter.init();
filterPresenter.init();
