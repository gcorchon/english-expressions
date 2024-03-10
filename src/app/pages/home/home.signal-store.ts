import { computed, inject } from "@angular/core";
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from "rxjs";
import { DictionaryEntry, DictionaryService } from "../../services/dictionary.service";

type HomeSignalState = {
    loading:boolean,
    dictionary:DictionaryEntry[],
    currentQuestionIndex: number
}

const initialState:HomeSignalState = {
    loading: false,
    dictionary: [],
    currentQuestionIndex: 0
}

export const HomeSignalStore = signalStore(
    withState(initialState),
    withComputed((store)=>({
        question: computed(() => store.dictionary()[store.currentQuestionIndex() % store.dictionary().length]),
        totalQuestions: computed(() => store.dictionary().length)
    })),
    withMethods((store, dictionaryService = inject(DictionaryService)) => ({
        load: rxMethod<void>(
            pipe(
                tap(_ => patchState(store, { loading: true })),
                switchMap(_ => dictionaryService.load().pipe(
                    tapResponse(dictionary => patchState(store, { dictionary }),
                                _ => patchState(store, { dictionary: [] }),
                                () => patchState(store, { loading: false })
                    )
                )))
        ),
        nextQuestion() {
            patchState(store, { currentQuestionIndex: (store.currentQuestionIndex() + 1) % store.totalQuestions() });
        }
    })),
    withHooks((store) => ({
        onInit(){
            store.load()
        }
    }))
)