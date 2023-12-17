import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable()
export class PostService {
  private readonly baseUrl = '/api/v1'

  constructor(private httpClient: HttpClient) {}

  getPost(): Observable<{ message: string }> {
    return this.httpClient.get<{ message: string }>(`${this.baseUrl}/post`)
  }
}
