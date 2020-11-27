import { Injectable } from '@angular/core';
import { Resolve, Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private router: Router) { }

  goToLoginPage(){
    this.router.navigate(['/login']);
  }
  goToMainPage(){
    this.router.navigate(['']);
  }
}
