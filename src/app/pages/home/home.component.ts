import { Component, ViewContainerRef, effect, inject, viewChild } from '@angular/core';
import { QuestionComponent } from '../../components/question/question.component';
import { HomeSignalStore } from './home.signal-store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [QuestionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [HomeSignalStore],
})
export default class HomeComponent {
  protected store = inject(HomeSignalStore);
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
    });
  }
}
