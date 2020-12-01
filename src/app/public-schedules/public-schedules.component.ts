import { Component, OnInit } from '@angular/core';
import { PublicSchedule,Schedule } from '../schedule';
import { Course } from '../course';
import { ScheduleService } from '../schedule.service';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-public-schedules',
  templateUrl: './public-schedules.component.html',
  styleUrls: ['./public-schedules.component.css']
})
export class PublicSchedulesComponent implements OnInit {

  publicSchedules: PublicSchedule[];
  clickedSchedule: PublicSchedule;
  clickedIndex;
  courses: Course;

  constructor(private scheduleService: ScheduleService,private courseService: CourseService) { }

  ngOnInit(): void {
    this.getPublicSchedules();
  }

  getPublicSchedules(): void {

    this.scheduleService.allPublicSchedules()
        .subscribe(schedules => {
          console.log(schedules)
          this.publicSchedules = schedules.slice(0,10);
      });
  }

  getCourseList(index): void {
    if(this.clickedSchedule && this.clickedIndex==index){
      this.clickedIndex = undefined;
      this.clickedSchedule = undefined;
    }
    else{
      this.clickedIndex = index;
      this.clickedSchedule = this.publicSchedules[index]
    }
  }

  timetable(index): void {
    var schedule: Schedule = {
      scheduleName:this.clickedSchedule.scheduleName,
      status:"public",
      description:this.clickedSchedule.description,
      lastModified:this.clickedSchedule.lastModified,
      codes: this.clickedSchedule.codes
    };

    this.courseService.searchMultipleCourses(schedule)
        .subscribe(courses => {
          this.courses = <Course> courses[0];
          for (var i = 1; i < courses.length; i++){
            this.courses.subjectCodes = this.courses.subjectCodes.concat((<Course>courses[i]).subjectCodes);
          }
      });
      this.getCourseList(index);
  }
  closeTimetable(index){
    this.courses = undefined;
    this.getCourseList(index);
  }
}
