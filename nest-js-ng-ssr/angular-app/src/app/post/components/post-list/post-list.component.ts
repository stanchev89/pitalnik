import { Component, inject } from '@angular/core'
import { PostStore } from '../../+store/post.store'
import { JsonPipe } from '@angular/common'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [JsonPipe, RouterLink],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss',
})
export class PostListComponent {
  readonly postStore = inject(PostStore)
  hideList = false
}
