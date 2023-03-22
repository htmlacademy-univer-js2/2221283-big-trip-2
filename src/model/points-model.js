import { generatePoint } from '../mock/point.js';
import { getRandomNumber } from '../utils.js';
import { MIN_POINTS_COUNT, MAX_POINTS_COUNT } from '../mock/constants.js';

export default class PointsModel{
  constructor (){
    this.points = Array.from({length: getRandomNumber(MIN_POINTS_COUNT, MAX_POINTS_COUNT)}, generatePoint);
  }

  getPoints () { return this.points;}
}
