import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class TestService {
  private readonly todosUrl = 'https://jsonplaceholder.typicode.com/todos'
  private httpClient = inject(HttpClient)

  getTodos(): Observable<any> {
    console.log('GET')
    return this.httpClient.get(this.todosUrl)
  }

  getPosts(): Observable<{ message: string }> {
    return this.httpClient.get<{ message: string }>('/api/v1/post')
  }
}
