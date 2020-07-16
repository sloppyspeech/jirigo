import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintTasksDashboardComponent } from './sprint-tasks-dashboard.component';

describe('SprintTasksComponent', () => {
  let component: SprintTasksDashboardComponent;
  let fixture: ComponentFixture<SprintTasksDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SprintTasksDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprintTasksDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
