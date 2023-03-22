const TYPES = ['taxi', 'bus', 'train', 'ship','drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const MIN_POINTS_COUNT = 3;
const MAX_POINTS_COUNT = 10;

const DESTINATIONS = [
  'Ekaterinburg',
  'New York',
  'Detroit',
  'Tokyo',
  'London',
];

const OFFERS = [
  'Upgrade to a business class',
  'Add breakfast',
  'Rent a car',
  'Book tickets',
  'Switch to comfort',
];

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  null,
];

const PICTURE_DISCRIPTIONS = [
  'Nice place',
  'Ugly building',
  'Pretty picture',
  'Ancient city',
];

const PicturesInfo = {
  COUNT: 5,
  SRC: 100,
};

const Prices = {
  MIN: 1000,
  MAX: 2000
};

const OffersCount = {
  MIN: 0,
  MAX: 6
};

export {TYPES, MIN_POINTS_COUNT, MAX_POINTS_COUNT, DESTINATIONS, OFFERS, DESCRIPTIONS, PICTURE_DISCRIPTIONS, PicturesInfo, Prices, OffersCount};
