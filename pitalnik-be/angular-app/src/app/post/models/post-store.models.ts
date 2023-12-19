import { Post } from './post.model'

export interface IPostStore {
  postList: Post[]
  isLoading: boolean
}
