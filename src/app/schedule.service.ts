import { Injectable } from '@angular/core';
import { Schedule,Schedules,PublicSchedule } from './schedule';
import { Observable, of, from } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, concatMap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private allSchedulesUrl = 'api/allSchedules';
  private findScheduleUrl = 'api/specificSchedule';
  private addScheduleUrl = 'api/newSchedule';
  private deleteScheduleUrl = 'api/deleteSchedule/';
  private deleteAllSchedulesUrl = 'api/deleteAllSchedules/';
  private updateScheduleUrl = 'api/updateSchedule';
  private updateScheduleStatusUrl = 'api/updateScheduleStatus';
  private allPublicSchedulesUrl = 'api/allPublicSchedules';

  constructor(public userService: UserService,private http: HttpClient,private messageService: MessageService) { }

  getSchedule(findSchedule): Observable<Schedule> {
    this.messageService.clear();
    var url = this.findScheduleUrl;

    return from(this.userService.getCurrentUser()).pipe(concatMap(
      res => {
        var body = {
          "scheduleName": findSchedule,
          "email": res.email
          }
        return this.http.put<Schedule>(url,body, this.httpOptions).pipe(
          catchError(this.handleError<Schedule>('getSchedule'))
        );
      }))
  }
  getSchedules(): Observable<[]> {
    this.messageService.clear();
    return from(this.userService.getCurrentUser()).pipe(concatMap(
      res => {
        var body = {
          "email": res.email
          }
        return this.http.put<[]>(this.allSchedulesUrl,body, this.httpOptions).pipe(
          catchError(this.handleError<[]>('getSchedules'))
        );
      }))
  }

  addSchedule(schedule: string,description: string): Observable<Schedules> {
    this.messageService.clear();
    var url = this.addScheduleUrl;
    return from(this.userService.getCurrentUser()).pipe(concatMap(
      res => {
        console.log(description)
        var body = {
          "scheduleName": schedule,
          "description": description,
          "email": res.email
          }
        return this.http.put<Schedules>(url,body, this.httpOptions).pipe(
          catchError(this.handleError<Schedules>('addSchedule'))
        );
      }))
  }

  deleteSchedule(schedule: string): Observable<Schedule> {
    this.messageService.clear();
    return from(this.userService.getCurrentUser()).pipe(concatMap(
      res => {
        var url = this.deleteScheduleUrl.concat(res.email + "/" +schedule);
        return this.http.delete<Schedule>(url, this.httpOptions).pipe(
          catchError(this.handleError<Schedule>('deleteSchedule'))
        );
      }))
  }

  deleteAllSchedules(): Observable<Schedules> {
    this.messageService.clear();
    return from(this.userService.getCurrentUser()).pipe(concatMap(
      res => {
        var url = this.deleteAllSchedulesUrl.concat(res.email);
        return this.http.delete<Schedules>(url, this.httpOptions).pipe(
          catchError(this.handleError<Schedules>('deleteAllSchedules'))
        );
      }))
  }

  writeNewMessage(message): void{
    this.messageService.add(message);
  }

  updateSchedule(schedule: string, workingList): Observable<Schedule> {
    this.messageService.clear();
    var url = this.updateScheduleUrl;

    return from(this.userService.getCurrentUser()).pipe(concatMap(
      res => {
        var body = {
          "scheduleName": schedule,
          "email": res.email,
          "codes": workingList
          }
        return this.http.put<Schedule>(url,body, this.httpOptions).pipe(
          catchError(this.handleError<Schedule>('updateSchedule'))
        );
      }))
  }

  updateScheduleStatus(schedule: string): Observable<Schedules> {
    this.messageService.clear();
    var url = this.updateScheduleStatusUrl;

    return from(this.userService.getCurrentUser()).pipe(concatMap(
      res => {
        var body = {
          "scheduleName": schedule,
          "email": res.email
          }
        return this.http.put<Schedules>(url,body, this.httpOptions).pipe(
          catchError(this.handleError<Schedules>('updateScheduleStatus'))
        );
      }))
  }

  allPublicSchedules(): Observable<PublicSchedule> {
    this.messageService.clear();
    var url = this.allPublicSchedulesUrl;

    return this.http.get<PublicSchedule>(url).pipe(
      catchError(this.handleError<PublicSchedule>('allPublicSchedules'))
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

