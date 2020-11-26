import { Component, OnInit, Input } from '@angular/core';
import { Course } from '../course';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {

  @Input() courses: Course;
  constructor() { }

  ngOnInit(): void {
  }

}
