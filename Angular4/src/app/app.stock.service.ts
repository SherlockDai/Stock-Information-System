import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { Option } from "./option";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class StockService {
  
    private url = 'http://derekdai-stock.us-east-2.elasticbeanstalk.com';  // URL to web api
    constructor(
        private http: HttpClient) { }

/** GET heroes from the server */
getOption (term: string): Observable<Option[]> {
    if (!term.trim()) {
        // if not search term, return empty hero array.
        return of([]);
      }
    return this.http.get<Option[]>(`${this.url}/api/options/?symbol=${term}`)
    .pipe(
        catchError(this.handleError('getOption', []))
      );
  }

getData (symbol: string, func: string): Observable<JSON>{
  
  return this.http.get<JSON>(`${this.url}/api/data/?symbol=${symbol}&function=${func}`);
}

getPic (url: string, data: string): Observable<JSON>{
  return this.http.post<JSON>(url, data);
}

private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}