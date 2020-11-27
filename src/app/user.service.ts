import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Resolve, Router } from "@angular/router";
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    public db: AngularFirestore,
    public afAuth: AngularFireAuth, 
    private router: Router
  ){
  }
 
 
   getCurrentUser(){
     return new Promise<any>((resolve, reject) => {
       var user = firebase.default.auth().onAuthStateChanged(function(user){
         if (user) {
           resolve(user);
         } else {
           reject('No user logged in');
         }
       })
     })
   }
 
   updateCurrentUser(value){
     return new Promise<any>((resolve, reject) => {
       var user = firebase.default.auth().currentUser;
       user.updateProfile({
         displayName: value.name,
         photoURL: user.photoURL
       }).then(res => {
         resolve(res);
       }, err => reject(err))
     })
   }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return firebase.default.auth().currentUser.sendEmailVerification()
    .then(() => {
      this.router.navigate(['/login']);
    })
  }
}
