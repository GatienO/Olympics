import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { filter } from 'rxjs/operators';



/**
 * OlympicService
 *
 * This service is responsible for fetching and managing Olympic data.
 * It provides methods to load data from a mock JSON file and exposes an observable
 * for accessing the loaded data.
 */

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  /* URL to the mock Olympic data JSON file.*/
  private olympicUrl = './assets/mock/olympic.json';

  /*BehaviorSubject to hold the Olympic data, enabling reactive programming patterns.*/
  private olympics$ = new BehaviorSubject<Olympic[] | null>(null);


    /**
   * Constructor
   * @param http Angular HttpClient for making HTTP requests.
   */
  constructor(private http: HttpClient) {}


  /**
   * Loads the initial Olympic data from the mock JSON file.
   * The data is stored in the `olympics$` BehaviorSubject for further access.
   * 
   * @returns An observable of the HTTP GET request, which also updates the BehaviorSubject.
   * If an error occurs, it logs the error and sets the BehaviorSubject's value to `null`.
   */
  loadInitialData() {

    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next(null);
        return caught;
      })
    );
  }


  /**
   * Provides an observable for the Olympic data.
   * Filters out null values and ensures the data is cast to `Olympic[]`.
   * 
   * @returns An observable of the Olympic data.
   */
  getOlympics(): Observable<Olympic[]> {
    return this.olympics$.asObservable().pipe(
      filter((data) => !!data),
      map((data) => data as Olympic[])
    );
  }

}
