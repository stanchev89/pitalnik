import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PostEntityComponent } from './post-entity.component'

describe('PostEntityComponent', () => {
  let component: PostEntityComponent
  let fixture: ComponentFixture<PostEntityComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostEntityComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(PostEntityComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
