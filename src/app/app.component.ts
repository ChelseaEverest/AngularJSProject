import { Component} from '@angular/core';
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

  public generalService: GeneralService;

  constructor(public _router: Router){
  }
}
