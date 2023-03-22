import { generateEditingForm } from '../mock/editing-form';

export default class EditingFormModel{
  constructor (){
    this.form = generateEditingForm();
  }

  getForm () { return this.form;}
}
