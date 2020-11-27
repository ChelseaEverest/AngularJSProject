import { Component, OnInit } from '@angular/core';
import { CourseService } from '../course.service';
import { Course } from '../course';

@Component({
  selector: 'app-courses-search',
  templateUrl: './courses-search.component.html',
  styleUrls: ['./courses-search.component.css']
})
export class CoursesSearchComponent implements OnInit {

  courses: Course;

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
  }
  search(subjectCode: string,courseCode: string,component: string): void {
    subjectCode = this.cleanUpString(subjectCode)
    console.log(subjectCode)
    courseCode = this.cleanUpString(courseCode)
    component = this.cleanUpString(component)
    if (!subjectCode) { return; }
    this.courseService.searchCourses(subjectCode,courseCode,component)
      .subscribe(courses => {
        this.courses = courses;
        console.log(this.courses)
      });
  }
  cleanUpString(str: string){
    this.sanitize(str)
    str = str.replace(/\s+/g, '');
    return str.toUpperCase();
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
