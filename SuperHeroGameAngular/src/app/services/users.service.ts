import { Injectable } from '@angular/core';
import { User } from '../interfaces/User';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  listusers: User[] = [];
  currentUser!: User;

  constructor() {
    const storeData = localStorage.getItem('usuariosData');
    if(storeData){
      this.listusers = JSON.parse(storeData);
    }
    const storedUser = localStorage.getItem('usuarioActual');
    if(storedUser){
      this.currentUser = JSON.parse(storedUser);  
    }

   }

  getusers(): User[] {
    return this.listusers;
  }

  postUser(user: User) {
    this.listusers.push(user);
    localStorage.setItem('usuariosData', JSON.stringify(this.listusers));
  }

}
