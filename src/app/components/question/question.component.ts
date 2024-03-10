import { Component, EventEmitter, HostBinding, HostListener, Output, inject, input, signal } from '@angular/core';
import { DictionaryEntry } from '../../services/dictionary.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { KeyboardService } from '../../services/keyboard.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [],
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss',
  animations: [
    trigger('slide', [
      transition(":enter", [
        style({ 
          "top": 0,
          "left": 0,
          "opacity": 0,
          "position": "absolute",
          "transform": "translateX(100%)"
        }),
        animate('300ms', style({ "transform": "translateX(0%)", "opacity": 1 }))
      ]),
      transition(":leave", [
        style({ 
          "position": "absolute",
          "top": 0,
          "left": 0,
        }),
        animate('300ms', style({ "transform": "translateX(-100%", "opacity": 0 }))
      ])
    ])
  ],
})
export class QuestionComponent {
    
  @HostBinding('@slide') get slide() { return true; }
  @Output() next:EventEmitter<void> = new EventEmitter();

  questionNumber = input.required<number>();
  data = input.required<DictionaryEntry>();

  protected answerShown = signal(false);
  private keyboard = inject(KeyboardService);

  constructor(){
    this.keyboard.keypressed$.pipe(takeUntilDestroyed()).subscribe(()=>{
      if(this.answerShown()) this.next.emit();
      else this.answerShown.set(true);
    });
  }
    
  synthesize(){
    let utterance = new SpeechSynthesisUtterance(this.data().translation);
    utterance.lang = "en-GB";
    window.speechSynthesis.speak(utterance);
  }
}
