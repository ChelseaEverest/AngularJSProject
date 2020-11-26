import { Injectable } from '@angular/core';
import { Schedule } from './schedule';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  schedule: Schedule = {
    scheduleName:"TestSchedule",
    codes:[
        {
            subjectCode:"TESTCODE",
            courseCode:"1111"
        },
        {
          subjectCode:"TESTCODE2",
          courseCode:"2222"
      }
    ]
  };
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private allSchedulesUrl = 'api/allSchedules';
  private findScheduleUrl = 'api/specificSchedule/';
  private addScheduleUrl = 'api/newSchedule/';
  private deleteScheduleUrl = 'api/deleteSchedule/';
  private deleteAllSchedulesUrl = 'api/deleteAllSchedules';
  private updateScheduleUrl = 'api/updateSchedule/';

  constructor(private http: HttpClient,private messageService: MessageService) { }

  getSchedule(findSchedule): Observable<Schedule> {
    this.messageService.clear();
    var url = this.findScheduleUrl.concat(findSchedule);
    return this.http.get<Schedule>(url).pipe(
      catchError(this.handleError<Schedule>('getSchedule'))
    );
  }
  getSchedules(): Observable<[]> {
    this.messageService.clear();
    return this.http.get<[]>(this.allSchedulesUrl).pipe(
      catchError(this.handleError<[]>('getSchedules'))
    );
  }

  addSchedule(schedule: string): Observable<Schedule> {
    this.messageService.clear();
    var url = this.addScheduleUrl.concat(schedule);
    return this.http.put<Schedule>(url, this.httpOptions).pipe(
      catchError(this.handleError<Schedule>('addSchedule')),
      
    );
  }

  deleteSchedule(schedule: string): Observable<Schedule> {
    this.messageService.clear();
    var url = this.deleteScheduleUrl.concat(schedule);
    return this.http.delete<Schedule>(url, this.httpOptions).pipe(
      catchError(this.handleError<Schedule>('deleteSchedule'))
    );
  }

  deleteAllSchedules(): Observable<Schedule> {
    this.messageService.clear();
    return this.http.delete<Schedule>(this.deleteAllSchedulesUrl, this.httpOptions).pipe(
      catchError(this.handleError<Schedule>('deleteSchedule'))
    );
  }

  writeNewMessage(message): void{
    this.messageService.add(message);
  }

  updateSchedule(schedule: string, workingList): Observable<Schedule> {
    this.messageService.clear();
    var url = this.updateScheduleUrl.concat(schedule);
    return this.http.put<Schedule>(url,workingList, this.httpOptions).pipe(
      catchError(this.handleError<Schedule>('updateSchedule')),
      
    );
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

