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

  // Función para actualizar tanto la lista de usuarios como el usuario actual en el servicio y el almacenamiento local
  updateUserData(updatedUser: User) {
    // Actualiza el usuario actual
    this.currentUser = updatedUser;
    localStorage.setItem('usuarioActual', JSON.stringify(updatedUser));

    // Busca y actualiza el usuario en la lista de usuarios
    const userIndex = this.listusers.findIndex((user) => user.email === updatedUser.email);
    if (userIndex !== -1) {
      this.listusers[userIndex] = updatedUser;
      localStorage.setItem('usuariosData', JSON.stringify(this.listusers));
    }
  }
}
