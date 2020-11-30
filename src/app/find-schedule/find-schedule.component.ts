import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Schedule } from '../schedule';
import { Course } from '../course';
import { ScheduleService } from '../schedule.service';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-find-schedule',
  templateUrl: './find-schedule.component.html',
  styleUrls: ['./find-schedule.component.css']
})
export class FindScheduleComponent implements OnInit {
  @Input() schedules: Schedule;
  @Output() updateEvent = new EventEmitter<string>(); 
  @Output() replaceEvent = new EventEmitter<string>();

  courses: Course;

  constructor(private scheduleService: ScheduleService,private courseService: CourseService) { }

  ngOnInit(): void {
  }
  delete(): void {
    var name = this.schedules.scheduleName;
    if (!name) { return; }
    this.scheduleService.deleteSchedule(name)
      .subscribe(schedule => {
        this.updateEvent.emit("");
        this.schedules = undefined;
      });
  }
  replace(): void {
    this.replaceEvent.emit("");
  }
  changeStatus(): void {
    this.scheduleService.updateScheduleStatus(this.schedules.scheduleName)
    .subscribe(schedule => {
      this.updateEvent.emit("");
      if(this.schedules.status.localeCompare("private")==0){
        this.schedules.status = "public";
      }
      else{
        this.schedules.status = "private";
      }
    });
  }
  timetable(): void {

    this.courseService.searchMultipleCourses(this.schedules)
        .subscribe(courses => {
          this.courses = <Course> courses[0];
          for (var i = 1; i < courses.length; i++){
            this.courses.subjectCodes = this.courses.subjectCodes.concat((<Course>courses[i]).subjectCodes);
          }
      });
  
  }

}
