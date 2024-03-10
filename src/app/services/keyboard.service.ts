import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {

  constructor() { }

  private subject:Subject<void> = new Subject();
  keypressed$ = this.subject.asObservable();

  keypressed() {
    this.subject.next();
  }
  
}
