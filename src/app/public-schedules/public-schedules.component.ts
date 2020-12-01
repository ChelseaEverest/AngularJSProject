import { Component, OnInit } from '@angular/core';
import { PublicSchedule } from '../schedule';
import { ScheduleService } from '../schedule.service';

@Component({
  selector: 'app-public-schedules',
  templateUrl: './public-schedules.component.html',
  styleUrls: ['./public-schedules.component.css']
})
export class PublicSchedulesComponent implements OnInit {

  publicSchedules: PublicSchedule;

  constructor(private scheduleService: ScheduleService) { }

  ngOnInit(): void {
    this.getPublicSchedules();
  }

  getPublicSchedules(): void {

    this.scheduleService.allPublicSchedules()
        .subscribe(schedules => {
          console.log(schedules)
          this.publicSchedules = schedules;
      });
  }

}
