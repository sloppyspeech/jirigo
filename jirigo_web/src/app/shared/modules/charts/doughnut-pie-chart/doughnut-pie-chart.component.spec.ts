import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoughnutPieChartComponent } from './doughnut-pie-chart.component';

describe('DoughnutPieChartComponent', () => {
  let component: DoughnutPieChartComponent;
  let fixture: ComponentFixture<DoughnutPieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoughnutPieChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoughnutPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
