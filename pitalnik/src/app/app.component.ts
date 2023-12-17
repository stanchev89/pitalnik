import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink, RouterOutlet } from '@angular/router'
import { HeaderComponent } from './core/components/header/header.component'
import { TestStore } from './+store/test/test.store'

@Component({
  selector: 'app-root',
  standalone: true,

  imports: [CommonModule, RouterOutlet, HeaderComponent, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  test = 'test'
  readonly testStore = inject(TestStore)
}
