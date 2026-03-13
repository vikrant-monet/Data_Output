import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsOverview } from './stats-overview';

describe('StatsOverview', () => {
  let component: StatsOverview;
  let fixture: ComponentFixture<StatsOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatsOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
