import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryCategoryDistribution } from './secondary-category-distribution';

describe('SecondaryCategoryDistribution', () => {
  let component: SecondaryCategoryDistribution;
  let fixture: ComponentFixture<SecondaryCategoryDistribution>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondaryCategoryDistribution]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondaryCategoryDistribution);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
