import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryCategoryPlatform } from './secondary-category-platform';

describe('SecondaryCategoryPlatform', () => {
  let component: SecondaryCategoryPlatform;
  let fixture: ComponentFixture<SecondaryCategoryPlatform>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondaryCategoryPlatform]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondaryCategoryPlatform);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
