import { Component, inject, OnInit } from '@angular/core'
import { PostStore } from '../../+store/post.store'
import { JsonPipe } from '@angular/common'

@Component({
  selector: 'app-post-entity',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './post-entity.component.html',
  styleUrl: './post-entity.component.scss',
})
export class PostEntityComponent implements OnInit {
  readonly postStore = inject(PostStore)

  ngOnInit() {
    console.log('I am rendered')
  }
}
