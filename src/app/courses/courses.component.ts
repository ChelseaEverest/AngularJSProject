import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Course } from '../course';
import { UpdateSchedule } from '../schedule';
import { SubjectCode } from '../subjectCode';
import { CourseService } from '../course.service';
import { ScheduleService } from '../schedule.service';
import { MatDialog } from '@angular/material/dialog';
import { ReviewComponent } from '../review/review.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  allSubjectCodes: string[] = [];
  classes: SubjectCode;
  clickedIndex;
  clickedIndexForClasses;
  clickedForReview = false;

  constructor(private courseService: CourseService,private scheduleService: ScheduleService,public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getSubjectCodes();
  }

  getSubjectCodes(): void {
    this.courseService.getSubjectCodes()
        .subscribe(subjectCodes => {
          console.log(subjectCodes.subjectCodes)
          for (let code of subjectCodes.subjectCodes) {
            var subject = code.subject;
            if (!this.allSubjectCodes.includes(subject)){
              this.allSubjectCodes.push(subject);
            }
          }
      });
  }
  getClasses(subjectName , index): void {
    console.log(index)
    this.clickedIndex = index;
    this.courseService.getClasses(subjectName)
        .subscribe(subjectCodes => {
          console.log(subjectCodes.subjectCodes)
          this.classes = subjectCodes;
      });
  }
  schedule: UpdateSchedule = {
    subjectCode: "",
    courseCode: ""
  };

  addCourse(courseCode, subjectCode): void{
    let schedule: UpdateSchedule = {
      subjectCode: subjectCode,
      courseCode: courseCode
    };
    var selectedSchedule = this.scheduleService.selectedSchedule
    selectedSchedule.codes.push(schedule)

    this.scheduleService.updateSchedule(selectedSchedule.scheduleName,selectedSchedule.codes)
      .subscribe(schedule => {
        this.scheduleService.newSelectedSchedule(selectedSchedule);
      });
  }

  getReview(index){
    this.clickedForReview = !this.clickedForReview;
    this.clickedIndexForClasses = index;
  }
  seeReview(index){
    var className = this.classes.subjectCodes[index].className;
    const dialogRef = this.dialog.open(ReviewComponent, {
      width: '350px',
      data: "Leave a review for " + className + "?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        console.log(result)
      }
    });
  }
}
