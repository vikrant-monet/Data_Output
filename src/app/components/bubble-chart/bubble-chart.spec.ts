import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BubbleChart } from './bubble-chart';

describe('BubbleChart', () => {
  let component: BubbleChart;
  let fixture: ComponentFixture<BubbleChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BubbleChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BubbleChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
