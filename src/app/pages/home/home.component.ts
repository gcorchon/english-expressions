declare function gtag(...values:any[]):void;
import { Component, ViewContainerRef, effect, inject, viewChild } from '@angular/core';
import { QuestionComponent } from '../../components/question/question.component';
import { HomeSignalStore } from './home.signal-store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, EMPTY, Subject, combineLatest, filter, fromEvent, interval, merge, switchMap, takeUntil, tap } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { KeyboardService } from '../../services/keyboard.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [QuestionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [HomeSignalStore],
})
export default class HomeComponent {
  private document = inject(DOCUMENT);
  private keyboard = inject(KeyboardService);
  protected store = inject(HomeSignalStore);
    
  insertionPoint = viewChild("vcr", { read: ViewContainerRef });

  protected autoModeChanged$:Subject<boolean> = new Subject();
  constructor(){
    effect(()=>{
      let vcr = this.insertionPoint();
      if(!vcr) return;
      
      vcr.clear();

      let componentRef = vcr.createComponent(QuestionComponent);
      componentRef.setInput("data", this.store.question());
      componentRef.setInput("questionNumber", (this.store.currentQuestionIndex() + 1) + "/" + this.store.totalQuestions());
      componentRef.instance.next.subscribe(() => this.store.nextQuestion());

      gtag({
        'event': 'pageview',     
          'page_location': '/',
          'page_title': this.store.question().text             
      });
    });

    merge(
      fromEvent<KeyboardEvent>(this.document, "keydown")
        .pipe(
          filter(evt => evt.code == 'ArrowRight')
        ),
      this.autoModeChanged$.pipe(
        switchMap(auto => auto ?
            interval(3000).pipe(takeUntil(this.autoModeChanged$.pipe(filter(a => !a)))): EMPTY
        )
    )).pipe(takeUntilDestroyed()).subscribe(_ => this.keyboard.keypressed());
  }
}
