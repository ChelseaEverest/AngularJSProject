import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Schedule } from '../schedule';
import { Course } from '../course';
import { ScheduleService } from '../schedule.service';
import { CourseService } from '../course.service';
import {MatDialog} from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-find-schedule',
  templateUrl: './find-schedule.component.html',
  styleUrls: ['./find-schedule.component.css']
})
export class FindScheduleComponent implements OnInit {
  
  @Output() updateEvent = new EventEmitter<string>(); 

  selectedSchedule: Schedule;
  courses: Course;

  constructor(private scheduleService: ScheduleService,private courseService: CourseService,public dialog: MatDialog) {
    this.selectedSchedule = scheduleService.selectedSchedule;
    this.scheduleService.selectedScheduleChange.subscribe(value => this.selectedSchedule = value);
   }

  ngOnInit(): void {
  }
  delete(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: "Are you sure you want to delete schedule " + this.selectedSchedule.scheduleName + "?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        var name = this.selectedSchedule.scheduleName;
        if (!name) { return; }
        this.scheduleService.deleteSchedule(name)
          .subscribe(schedule => {
            this.updateEvent.emit("");
            this.selectedSchedule = undefined;
            this.scheduleService.newSelectedSchedule(undefined)
          });
      }
    });
  }
  changeStatus(): void {
    this.scheduleService.updateScheduleStatus(this.selectedSchedule.scheduleName)
    .subscribe(schedule => {
      this.updateEvent.emit("");
      if(this.selectedSchedule.status.localeCompare("private")==0){
        this.selectedSchedule.status = "public";
      }
      else{
        this.selectedSchedule.status = "private";
      }
    });
  }
  timetable(): void {

    this.courseService.searchMultipleCourses(this.selectedSchedule)
        .subscribe(courses => {
          this.courses = <Course> courses[0];
          for (var i = 1; i < courses.length; i++){
            this.courses.subjectCodes = this.courses.subjectCodes.concat((<Course>courses[i]).subjectCodes);
          }
      });
  
  }
  deleteCourse(code){
    for (var i = 0;i<this.selectedSchedule.codes.length;i++){
      if(this.selectedSchedule.codes[i] == code){
        this.selectedSchedule.codes.splice(i, 1);
      }
    }
    this.scheduleService.updateSchedule(this.selectedSchedule.scheduleName,this.selectedSchedule.codes)
        .subscribe(schedule => {
          this.updateEvent.emit("");
          this.scheduleService.newSelectedSchedule(this.selectedSchedule);
        });

  }

}
