import { Injectable } from '@angular/core';
import { Course } from './course';
import { Schedule } from './schedule';
import { SubjectCode } from './subjectCode';
import { Observable, of,forkJoin} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private allSubjectCodesUrl = 'api/subjectCodes';
  private subjectCodesUrl = 'api/subjectCodes/';
  private timetableUrl = 'api/timetable/';

  constructor(private http: HttpClient,private messageService: MessageService) { }

  getSubjectCodes(): Observable<SubjectCode> {
    this.messageService.clear();
    return this.http.get<SubjectCode>(this.allSubjectCodesUrl).pipe(
      catchError(this.handleError<SubjectCode>('getSubjectCodes'))
    );
  }
  getClasses(subjectName): Observable<SubjectCode> {
    this.messageService.clear();
    var url = this.subjectCodesUrl.concat(subjectName);
    return this.http.get<SubjectCode>(url).pipe(
      catchError(this.handleError<SubjectCode>('getSubjectCode'))
    );
  }
  searchCourses(subjectCode,courseCode,component): Observable<Course> {
    this.messageService.clear();


    var url = this.timetableUrl.concat(subjectCode);
    if(courseCode){
      url = url.concat('/' + courseCode);
    }
    if(component){
      url = url.concat('/' + component);
    }
    return this.http.get<Course>(url).pipe(
      catchError(this.handleError<Course>('searchCourses'))
    );
  }

  searchMultipleCourses(schedules:Schedule): Observable<unknown[]> {
    this.messageService.clear();
    var data = [];
    for(let entry of schedules.codes){
      var subjectCode = entry.subjectCode;
      var courseCode = entry.courseCode;
      var component = "";

      var url = this.timetableUrl.concat(subjectCode);
      if(courseCode){
        url = url.concat('/' + courseCode);
      }
      if(component){
        url = url.concat('/' + component);
      }

      data.push(this.http.get<Course>(url).pipe(catchError(this.handleError<Course>('searchCourses'))));

    }

    return forkJoin(data);


  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      console.error(`${operation} failed: ${error.message}`);

      this.messageService.add(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
