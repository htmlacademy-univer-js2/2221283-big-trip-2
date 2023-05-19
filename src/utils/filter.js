import { FilterType } from '../const.js';
import { isPointPast, isPointFuture } from './task.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => Array.from(points),
  [FilterType.FUTURE]: (points) => Array.from(points).filter((point) => isPointFuture(point)),
  [FilterType.PAST]: (points) => Array.from(points).filter((point) => isPointPast(point))
};

export {filter};
