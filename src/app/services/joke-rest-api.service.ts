import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {H} from "@angular/cdk/keycodes";


@Injectable({
  providedIn: 'root'
})

export class JokeRestApiService {

  getApiUrl= "https://api.chucknorris.io/jokes/random";

  constructor(private http: HttpClient) {}

  getJoke(){
    return this.http.get<Joke[]>(this.getApiUrl);
  }

}

export interface Joke {
  categories: Array<string>;
  created_at: string;
  icon_url: string;
  id: string;
  updated_at: string;
  url: string;
  value: string;
}
