import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { Schedule } from '../schedule';
import { ScheduleService } from '../schedule.service';
import { UpdateSchedule } from '../schedule';


@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css']
})


export class SchedulesComponent implements OnInit {
  @Input() workingList: UpdateSchedule[];
  @Output() completeReplaceEvent = new EventEmitter<string>();
  allSchedules:[];
  selectedSchedule: Schedule;

  constructor(private scheduleService: ScheduleService) { }

  ngOnInit(): void {
    this.getSchedules();
  }

  getSchedules(): void {
    this.scheduleService.getSchedules()
        .subscribe(schedules => {
          this.allSchedules = schedules
      });
  }
  getSpecificSchedule(all): void {
    all = all.split(":")[0]; 
    this.selectedSchedule = all;
    this.scheduleService.getSchedule(all)
    .subscribe(schedules => {
      this.selectedSchedule = schedules});
  }
  add(name: string): void {
    name = this.sanitize(name);
    name = name.trim();
    if (!name) { return; }
    this.scheduleService.addSchedule(name)
      .subscribe(schedule => {
        this.getSchedules();
      });
  }  
  deleteAllSchedules(): void {
    this.scheduleService.deleteAllSchedules()
      .subscribe(schedule => {
        this.getSchedules();
      });
  }
  replaceSchedules(): void {
    if(!this.workingList){
      console.log(this.workingList)
      this.scheduleService.writeNewMessage("No items in working list");
    }
    else{
      console.log("else" + this.workingList)
      this.scheduleService.updateSchedule(this.selectedSchedule.scheduleName,this.workingList)
        .subscribe(schedule => {
          this.getSchedules();
          this.getSpecificSchedule(this.selectedSchedule.scheduleName);
          this.completeReplaceEvent.emit("");
        });
    }
  }

  sanitize(string): string {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return string.replace(reg, (match)=>(map[match]));
  }

}
