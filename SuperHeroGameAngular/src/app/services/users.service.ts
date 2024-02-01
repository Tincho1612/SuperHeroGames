import { Injectable } from '@angular/core';
import { User } from '../interfaces/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  listusers: User[] = [];
  currentUser!: User;

  token: string = ""

  private url: string = "https://servidor-superherogame.vercel.app";

  constructor(private http: HttpClient) {
    const lsToken = localStorage.getItem('token');
    if (lsToken !== null) {
      this.token = lsToken;
    }
  }

  getHeaders() {
    const tokenAsString = String(this.token); // Convertir a string si es necesario

    const headers = new HttpHeaders({
      'access-token': tokenAsString // Asegurarse de que el token sea de tipo string
    });

    const requestOptions = {
      headers: headers
    };

    return requestOptions;
  }

  //////////////////////////////////////////////////////////
  //FUNCIONES PARA OBTENCION/MODIFICACIÓN DEL USUARIO
  getActualUser(): Observable<any> {
    return this.http.get<any>(`${this.url}/api/user/getActualUser`, this.getHeaders());
  }
  getUsersTest(): Observable<any> {
    return this.http.get<any>(`${this.url}/api/user/getUsers`, this.getHeaders());
  }

  getFavoritosTest(): Observable<any> {
    return this.http.get<any>(`${this.url}/api/user/favoritos`, this.getHeaders());
  }

  getEquipoTest(): Observable<any> {
    return this.http.get<any>(`${this.url}/api/user/equipo`, this.getHeaders());
  }

  agregarFavoritoUser(idHeroe: number): Observable<any> {
    return this.http.put(`${this.url}/api/user/agregarFavorito/${idHeroe}`, {}, this.getHeaders());
  }

  eliminarFavoritoUser(idHeroe: number): Observable<any> {
    return this.http.delete(`${this.url}/api/user/eliminarFavorito/${idHeroe}`, this.getHeaders());
  }

  updateUser(body: object): Observable<any> {
    return this.http.put<any>(`${this.url}/api/user/update`, body, this.getHeaders());
  }

  updatePassword(body: object): Observable<any> {
    return this.http.put<any>(`${this.url}/api/user/updatePassword`, body, this.getHeaders());
  }

  //////////////////////////////////////////////////////////
  //FUNCIONES DE AUTENTICACIÓN

  signUp(body: object): Observable<any> {
    return this.http.post<any>(`${this.url}/api/auth/signup`, body);
  }

  signIn(body: object): Observable<any> {
    return this.http.post<any>(`${this.url}/api/auth/signin`, body);
  }

  validarUsuario(): Observable<any> {
    return this.http.post<any>(`${this.url}/api/user/validarUsuario`, null, this.getHeaders());
  }

  recuperarPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.url}/api/auth/recoverPassword`, { email });
  }

  resetPassword(newPassword: string, token: string): Observable<any> {
    return this.http.post<any>(`${this.url}/api/auth/resetPassword/${token}`, { newPassword });
  }

  //////////////////////////////////////////////////////////
  //FUNCIONES PARA LAS PELEAS

  getPeleasUser(): Observable<any> {
    return this.http.get<any>(`${this.url}/api/pelea/getPeleas`, this.getHeaders());
  }

  agregarPelea(body: object): Observable<any> {
    return this.http.post<any>(`${this.url}/api/pelea/agregar`, body, this.getHeaders());
  }
}
