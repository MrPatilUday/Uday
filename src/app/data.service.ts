import { Injectable } from '@angular/core';
import { TempData } from './temp-data.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private httpclient: HttpClient) { }

  displayData(): Observable<TempData[]> {

    return this.httpclient.get<TempData[]>('http://localhost:3000/tempdata');

  }

}
