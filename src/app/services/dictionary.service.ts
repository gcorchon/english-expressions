import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { shuffleArray } from '../utils/array';

export type DictionaryEntry = { text: string; translation: string };

@Injectable({
  providedIn: 'root',
})
export class DictionaryService {
  constructor(private http: HttpClient) {}

  load() {
    return this.http
      .get<{ [key: string]: string }>('assets/data.json')
      .pipe(
        map(data =>
          shuffleArray(
            Object.entries(data).map((entry, index) => ({
              text: entry[0],
              translation: entry[1],
            }))
          )
        )
      );
  }
}
