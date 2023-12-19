import { Injectable } from '@angular/core'
import { NavigationExtras, Router } from '@angular/router'

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(private router: Router) {}

  navigate(commands: string[], extras?: NavigationExtras): Promise<boolean> {
    return this.router.navigate(commands, extras)
  }
}
