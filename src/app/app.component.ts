import { Component} from '@angular/core';
import { UpdateSchedule } from './schedule';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'se3316-ceveres4-lab5';
  workingList: UpdateSchedule[] = [];
  workingListClear: UpdateSchedule[] = [];
  replaceSchedule(workingList: UpdateSchedule[]): void {
    this.workingList = workingList;
  }
  completeReplace(): void{
    this.workingList = this.workingListClear;
    console.log(this.workingList)
  }
}
