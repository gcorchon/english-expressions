declare function gtag(...values:any[]):void;
import { Component, ViewContainerRef, effect, inject, viewChild } from '@angular/core';
import { QuestionComponent } from '../../components/question/question.component';
import { HomeSignalStore } from './home.signal-store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, combineLatest, filter, fromEvent, interval, merge, switchMap, tap } from 'rxjs';
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
  protected autoModeEnabled:BehaviorSubject<boolean> = new BehaviorSubject(false);
  
  private tick$ = combineLatest({ interval: interval(3000), enabled:this.autoModeEnabled }).pipe(filter(v => v.enabled ));

  insertionPoint = viewChild("vcr", { read: ViewContainerRef });

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
          filter(evt => evt.code == 'Space')
        ),
      this.tick$
    ).pipe(takeUntilDestroyed()).subscribe(_ => this.keyboard.keypressed());
  }
}
