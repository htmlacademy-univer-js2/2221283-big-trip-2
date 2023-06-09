import { FilterType } from '../const.js';
import { isPointPast, isPointFuture } from './task.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => points === null ? [] : Array.from(points),
  [FilterType.FUTURE]: (points) => points === null ? [] : Array.from(points).filter((point) => isPointFuture(point)),
  [FilterType.PAST]: (points) => points === null ? [] : Array.from(points).filter((point) => isPointPast(point))
};

export {filter};
