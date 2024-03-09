import { Component, EventEmitter, HostBinding, Output, input, signal } from '@angular/core';
import { DictionaryEntry } from '../../services/dictionary.service';
import { animate, style, transition, trigger } from '@angular/animations';

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

  questionNumber = input.required<number>();
  data = input.required<DictionaryEntry>();

  @Output()
  next = new EventEmitter();

  answerShown = signal(false);
    

  synthesize(){
    let utterance = new SpeechSynthesisUtterance(this.data().translation);
    utterance.lang = "en-GB";
    window.speechSynthesis.speak(utterance);
  }
}
