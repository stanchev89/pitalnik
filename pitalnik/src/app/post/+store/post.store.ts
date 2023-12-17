import { patchState, signalStore, withMethods, withState } from '@ngrx/signals'
import { inject } from '@angular/core'
import { IPostStore } from '../models/post-store.models'
import { PostService } from '../services/post.service'

const initialState: IPostStore = {
  postList: [],
  isLoading: false,
}
export const PostStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(({ postList, ...store }, postService = inject(PostService)) => ({
    getPosts() {
      patchState(store, { isLoading: true })
      postService.getPost().subscribe((posts) => {
        patchState(store, { isLoading: false })
      })
    },
  }))
)
