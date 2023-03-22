import { generateDestination } from '../mock/destination.js';
import { DESTINATIONS } from '../mock/constants.js';

export default class DestinationsModel{
  constructor (){
    this.destinations = Array.from({length: DESTINATIONS.length},(value, index) => generateDestination(index));
  }

  getDestinations () {return this.destinations;}
}
