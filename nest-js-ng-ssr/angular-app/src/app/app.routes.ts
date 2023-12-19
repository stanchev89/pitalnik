import { Routes } from '@angular/router'
import { PostService } from './post/services/post.service'
import { PostStore } from './post/+store/post.store'

export const APP_ROUTES: Routes = [
  {
    path: 'post',
    providers: [PostService, PostStore],
    loadChildren: () => import('./post/routes').then((m) => m.postRoutes),
  },
]
