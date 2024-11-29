import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class OlympicDataService {
  private dataUrl = 'assets/mock/olympic.json';

  constructor(private http:HttpClient) { }

  getOlympicData(): Observable<any> {
    return this.http.get(this.dataUrl);
  }
}
