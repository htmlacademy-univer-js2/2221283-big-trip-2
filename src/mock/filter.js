import { filter } from '../utils/filter.js';

export const generateFilter = (points) => Object.entries(filter).map(
  ([filterName, isFilteredPoints]) => ({
    name: filterName,
    isPoints: isFilteredPoints(points).length > 0
  })
);
