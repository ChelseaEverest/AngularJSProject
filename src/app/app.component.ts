import { Component} from '@angular/core';
import { UpdateSchedule } from './schedule';
import { GeneralService } from './general.service';
import { Resolve, Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'se3316-ceveres4-lab5';
  router: string;
  workingList: UpdateSchedule[] = [];
  workingListClear: UpdateSchedule[] = [];

  public generalService: GeneralService;

  constructor(private _router: Router){
  }

  replaceSchedule(workingList: UpdateSchedule[]): void {
    this.workingList = workingList;
  }
  completeReplace(): void{
    this.workingList = this.workingListClear;
    console.log(this.workingList)
  }
}
