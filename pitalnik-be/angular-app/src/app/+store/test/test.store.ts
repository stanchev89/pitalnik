import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals'
import { computed, inject } from '@angular/core'
import { TestService } from '../../core/services/test/test.service'

interface State {
  count: number

  increment(): void

  decrement(): void

  doubleCount(): number
}

export const TestStore = signalStore(
  { providedIn: 'root' },
  withState({ count: 0 }),
  withComputed(({ count }) => ({
    doubleCount: computed(() => count() * 2),
  })),
  withMethods(({ count, ...store }, testService = inject(TestService)) => ({
    increment() {
      testService.getTodos().subscribe((res) => {
        patchState(store, { count: count() + res.length })
      })
    },
    decrement() {
      patchState(store, { count: count() - 1 })
    },
  }))
)
