import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimateTaskComponent } from './estimate-task.component';

describe('EstimateTaskComponent', () => {
  let component: EstimateTaskComponent;
  let fixture: ComponentFixture<EstimateTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstimateTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstimateTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
