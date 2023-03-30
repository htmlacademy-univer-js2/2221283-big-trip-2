import { generateDestination } from '../mock/destination.js';
import { DESTINATIONS } from '../mock/constants.js';

export default class DestinationsModel{
  #destinations = null;

  constructor (){
    this.#destinations = Array.from({length: DESTINATIONS.length},(value, index) => generateDestination(index));
  }

  get destinations () {
    return this.#destinations;
  }
}
