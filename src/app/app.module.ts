import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { ReactiveFormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { UserResolver } from './user/user.resolver';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

import { AppComponent } from './app.component';
import { MessagesComponent } from './messages/messages.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { CoursesComponent } from './courses/courses.component';
import { httpInterceptorProviders } from './http-interceptors';
import { FindScheduleComponent } from './find-schedule/find-schedule.component';
import { CoursesSearchComponent } from './courses-search/courses-search.component';
import { TimetableComponent } from './timetable/timetable.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PublicSchedulesComponent } from './public-schedules/public-schedules.component';

@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,

    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
  ],
  declarations: [
    AppComponent,
    MessagesComponent,
    SchedulesComponent,
    CoursesComponent,
    FindScheduleComponent,
    CoursesSearchComponent,
    TimetableComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    PublicSchedulesComponent
  ],
  bootstrap: [ AppComponent ],
  providers: [
    httpInterceptorProviders, AuthService, UserService, UserResolver, AuthGuard
  ]
})
export class AppModule { }