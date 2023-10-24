import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Heroe } from '../interfaces/Heroe'

@Injectable({
  providedIn: 'root'
})
export class SuperHeroApiService {

  apiUrl: string;
  apiKey: string;

  constructor(private http: HttpClient) { 
    this.apiUrl = "https://superheroapi.com/api.php/";
    this.apiKey = "/3715170588728325/"
   }

   getListHeroes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.apiKey}search/a`);
  }

  getHeroe(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.apiKey}${id}`);
  }

}
