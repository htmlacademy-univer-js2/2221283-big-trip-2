import NewFilterView from './view/filter-view';
import TripEventsPresenter from './presenter/trip-presenter';
import { render } from './render';
import PointsModel from './model/points-model';
import EditingFormModel from './model/editing-form-model';
import DestinationModel from './model/destinations-model';

const siteHeaderElement = document.querySelector('.trip-main');
const siteMainElement = document.querySelector('.page-main');
const siteFilters = siteHeaderElement.querySelector('.trip-controls__filters');
const siteEvents = siteMainElement.querySelector('.trip-events');
const TripPresenter = new TripEventsPresenter();

const pointsModel = new PointsModel();
const editingFormModel = new EditingFormModel();
const destinationsModel = new DestinationModel();

render(new NewFilterView(), siteFilters);

TripPresenter.init(siteEvents, pointsModel, editingFormModel, destinationsModel);
