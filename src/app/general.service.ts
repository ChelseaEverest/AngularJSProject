import { Injectable } from '@angular/core';
import { UpdateSchedule } from './schedule';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  workingList: UpdateSchedule[] = [];

  constructor() { }

  addToWorkingList(workingList: UpdateSchedule){
    console.log(workingList)
    this.workingList.push(workingList);
  }
  clearWorkingList(){
    this.workingList = [];
  }
}
