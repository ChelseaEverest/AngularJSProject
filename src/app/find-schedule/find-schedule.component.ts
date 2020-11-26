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
