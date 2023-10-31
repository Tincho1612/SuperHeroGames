import { Injectable } from '@angular/core';
import { User } from '../interfaces/User';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  listusers:User[]=[];
  currentUser!:User;
  constructor() { 
    
  }

  getusers():User[]{
    return this.listusers;
  }

  postUser(user:User){
      this.listusers.push(user);
  }
}
