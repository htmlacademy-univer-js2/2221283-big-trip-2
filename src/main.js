import TripEventsPresenter from './presenter/trip-presenter';
import FilterPresenter from './presenter/filter-presenter';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model';
import DestinationsModel from './model/destinations-model';
import OffersModel from './model/offers-model';
import PointsApiService from './points-api-service';

const AUTHORIZATION = 'Basic gfhjty8gfgh3rtfg';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip/';

const pointsModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel(new PointsApiService(END_POINT, AUTHORIZATION));
const offersModel = new OffersModel(new PointsApiService(END_POINT, AUTHORIZATION));
const destinationsModel = new DestinationsModel(new PointsApiService(END_POINT, AUTHORIZATION));

const siteHeaderElement = document.querySelector('.trip-main');
const siteMainElement = document.querySelector('.page-main');
const siteFilters = siteHeaderElement.querySelector('.trip-controls__filters');
const siteEvents = siteMainElement.querySelector('.trip-events');
const newPointButton = siteHeaderElement.querySelector('.trip-main__event-add-btn');

const tripPresenter = new TripEventsPresenter(siteEvents, pointsModel, offersModel, destinationsModel, filterModel);
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

offersModel.init().finally(() => {
  destinationsModel.init().finally(() => {
    pointsModel.init().finally(() => {
      newPointButton.addEventListener('click', onNewPointButtonClick);
    });
  });
});
