import { Injectable } from '@angular/core';
import { User } from '../interfaces/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  listusers: User[] = [];
  isConfirmed: boolean = false;

  token: string = ""

 // private url: string = "https://servidor-superherogame.vercel.app";
  private url: string = "http://localhost:8080";
  constructor(private http: HttpClient) {
    const lsToken = localStorage.getItem('token');
    if (lsToken !== null) {
      this.token = lsToken;
    }
  }

  updateTokenAndGetConfirmed(token: string) {
    this.token = token;
    this.updateConfirmed();
  }

  updateConfirmed() {
    this.getActualUser().subscribe((user) => {
      this.isConfirmed = user.userResponse.confirmado;
    })
  }

  getConfirmed(){
    return this.isConfirmed;
  }

 getHeaders() {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}` // Spring Security espera este formato
  });

  return { headers };
}


  //////////////////////////////////////////////////////////
  //FUNCIONES PARA OBTENCION/MODIFICACIÓN DEL USUARIO
  getActualUser(): Observable<any> {
    return this.http.get<any>(`${this.url}/api/user/getActualUser`, this.getHeaders());
  }
  getUsersTest(): Observable<any> {
    return this.http.get<any>(`${this.url}/api/user/getUsers`, this.getHeaders());
  }

  getEquipoTest(): Observable<any> {
    return this.http.get<any>(`${this.url}/api/user/equipo`, this.getHeaders());
  }

  agregarFavoritoUser(idHeroe: number): Observable<any> {
    return this.http.patch(`${this.url}/api/user/agregarFavorito/${idHeroe}`, {}, this.getHeaders());
  }

  eliminarFavoritoUser(idHeroe: number): Observable<any> {
    return this.http.patch(`${this.url}/api/user/eliminarFavorito/${idHeroe}`,{}, this.getHeaders());
  }

  updateUser(body: object): Observable<any> {
    return this.http.put<any>(`${this.url}/api/user/update`, body, this.getHeaders());
  }

  updatePassword(body: object): Observable<any> {
    return this.http.put<any>(`${this.url}/api/user/updatePassword`, body, this.getHeaders());
  }

  validarUsuario(): Observable<any> {
    return this.http.post<any>(`${this.url}/api/user/validarUsuario`, null, this.getHeaders());
  }

  //////////////////////////////////////////////////////////
  //FUNCIONES DE AUTENTICACIÓN

  signUp(body: object): Observable<any> {
    return this.http.post<any>(`${this.url}/api/auth/signup`, body);
  }

  signIn(body: object): Observable<any> {
    return this.http.post<any>(`${this.url}/api/auth/signin`, body);
  }

  confirmarEmail(token: string): Observable<any> {
    return this.http.get<any>(`${this.url}/api/auth/confirmemail/${token}`);
  }

  requestConfirmationEmail(email: string): Observable<any> {
    return this.http.post<any>(`${this.url}/api/auth/requestConfirmationEmail`, { email }, this.getHeaders());
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
