declare function gtag(...values:any[]):void;
import { Component, ViewContainerRef, effect, inject, viewChild } from '@angular/core';
import { QuestionComponent } from '../../components/question/question.component';
import { HomeSignalStore } from './home.signal-store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, fromEvent, tap } from 'rxjs';
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
  protected store = inject(HomeSignalStore);
  private keyboard = inject(KeyboardService);

  insertionPoint = viewChild("vcr", { read: ViewContainerRef });

  constructor(){
    effect(()=>{
      let vcr = this.insertionPoint();
      if(!vcr) return;
      
      vcr.clear();

      let componentRef = vcr.createComponent(QuestionComponent);
      componentRef.setInput("data", this.store.question());
      componentRef.setInput("questionNumber", this.store.currentQuestionIndex() + 1);
      componentRef.instance.next.subscribe(() => this.store.nextQuestion());

      gtag({
        'event': 'pageview',     
          'page_location': '/',
          'page_title': this.store.question().text             
      });
    });

    fromEvent<KeyboardEvent>(this.document, "keydown").pipe(
      takeUntilDestroyed(), 
      filter(evt => evt.code == 'Space')
    ).subscribe(()=>this.keyboard.keypressed());
  }
}
