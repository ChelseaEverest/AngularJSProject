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
    subjectCode = this.sanitize(subjectCode)
    subjectCode = subjectCode.trim();
    courseCode = this.sanitize(courseCode)
    courseCode = courseCode.trim();
    component = this.sanitize(component)
    component = component.trim();
    if (!subjectCode) { return; }
    this.courseService.searchCourses(subjectCode,courseCode,component)
      .subscribe(courses => {
        this.courses = courses;
        console.log(this.courses)
      });
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
