export class FirebaseUserModel {
    name: string;
    provider: string;
    emailVerified: boolean;
  
    constructor(){
      this.name = "";
      this.provider = "";
      this.emailVerified = false;
    }
  }
  