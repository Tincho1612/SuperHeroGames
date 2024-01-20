import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/User';
import { Heroe } from '../interfaces/Heroe';

@Injectable({
  providedIn: 'root'
})
export class SuperHeroApiService {
  
  apiUrl: string;
  apiKey: string;
  favoritos: Observable<Heroe>[] = [];
  
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

  getHeroesByWord(word: string): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}${this.apiKey}search/${word}`);
  }
}
